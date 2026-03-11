"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  FormLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import type { Project, StoredImage, Tag, TagCategory, UpholsteryPiece } from "@/lib/firestore";
import {
  createProject,
  getTagCategories,
  getTags,
  getUpholsteryPieces,
  projectSlugExists,
  slugify,
} from "@/lib/firestore";
import { useAuth } from "@/contexts/AuthContext";

function compactSlug(s: string) {
  return s.trim();
}

export default function NewProjectPage() {
  const router = useRouter();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [slugError, setSlugError] = useState("");

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [metaDescription, setMetaDescription] = useState("");

  const [categories, setCategories] = useState<TagCategory[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [pieces, setPieces] = useState<UpholsteryPiece[]>([]);

  const [primaryImage, setPrimaryImage] = useState<StoredImage | null>(null);
  const [primaryFromPieceId, setPrimaryFromPieceId] = useState<string>("");
  const [pieceIds, setPieceIds] = useState<string[]>([]);

  const [beforeImages, setBeforeImages] = useState<StoredImage[]>([]);
  const [afterImages, setAfterImages] = useState<StoredImage[]>([]);

  const [selectedTagIds, setSelectedTagIds] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (authLoading) return;
    if (!user || !isAdmin) {
      router.replace("/login");
      return;
    }
  }, [user, isAdmin, authLoading, router]);

  useEffect(() => {
    if (!user || !isAdmin) return;
    setLoading(true);
    Promise.all([getTagCategories(), getTags(), getUpholsteryPieces()])
      .then(([c, t, p]) => {
        setCategories(c);
        setTags(t);
        setPieces(p);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load data"))
      .finally(() => setLoading(false));
  }, [user, isAdmin]);

  const piecesById = useMemo(() => {
    const m: Record<string, UpholsteryPiece> = {};
    pieces.forEach((p) => (m[p.id] = p));
    return m;
  }, [pieces]);

  const tagsByCategory = useMemo(
    () =>
      categories.map((c) => ({
        category: c,
        tags: tags.filter((t) => t.categoryId === c.id),
      })),
    [categories, tags]
  );

  const handleUploadSingle = async (file: File): Promise<StoredImage> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Upload failed");
    return {
      storageKey: data.storageKey,
      publicUrl: data.publicUrl,
      thumbnailUrl: data.thumbnailUrl ?? undefined,
    };
  };

  const handlePrimaryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    setError("");
    try {
      const img = await handleUploadSingle(f);
      setPrimaryFromPieceId("");
      setPrimaryImage(img);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    }
  };

  const handleBeforeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (!files.length) return;
    setError("");
    try {
      const uploaded: StoredImage[] = [];
      for (const f of files) uploaded.push(await handleUploadSingle(f));
      setBeforeImages((prev) => [...prev, ...uploaded]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    }
  };

  const handleAfterUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (!files.length) return;
    setError("");
    try {
      const uploaded: StoredImage[] = [];
      for (const f of files) uploaded.push(await handleUploadSingle(f));
      setAfterImages((prev) => [...prev, ...uploaded]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    }
  };

  const handlePiecePick = (id: string, selected: boolean) => {
    setPieceIds((prev) => {
      if (selected) return prev.includes(id) ? prev : [...prev, id];
      return prev.filter((x) => x !== id);
    });
  };

  const movePiece = (id: string, dir: -1 | 1) => {
    setPieceIds((prev) => {
      const idx = prev.indexOf(id);
      if (idx < 0) return prev;
      const next = idx + dir;
      if (next < 0 || next >= prev.length) return prev;
      const copy = [...prev];
      const tmp = copy[idx];
      copy[idx] = copy[next];
      copy[next] = tmp;
      return copy;
    });
  };

  const handleTagChange = (categoryId: string, tagId: string, selected: boolean, selection: "single" | "multiple") => {
    setSelectedTagIds((prev) => {
      const current = prev[categoryId] ?? [];
      if (selection === "single") return { ...prev, [categoryId]: selected ? [tagId] : [] };
      if (selected) return { ...prev, [categoryId]: [...current, tagId] };
      return { ...prev, [categoryId]: current.filter((x) => x !== tagId) };
    });
  };

  const setPrimaryFromPiece = (pieceId: string) => {
    setPrimaryFromPieceId(pieceId);
    const p = piecesById[pieceId];
    if (!p) return;
    setPrimaryImage({
      storageKey: p.storageKey,
      publicUrl: p.publicUrl,
      thumbnailUrl: p.thumbnailUrl,
    });
  };

  const checkSlug = async () => {
    if (!slug.trim()) return;
    const exists = await projectSlugExists(compactSlug(slug));
    setSlugError(exists ? "This URL is already used" : "");
  };

  const handleSave = async () => {
    setError("");
    setSlugError("");
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    const s = compactSlug(slug.trim() || slugify(title));
    const exists = await projectSlugExists(s);
    if (exists) {
      setSlugError("This URL is already used");
      return;
    }
    if (!primaryImage) {
      setError("Primary image is required");
      return;
    }
    setSaving(true);
    try {
      const tagIds = Object.values(selectedTagIds).flat();
      const uploadedStorageKeys: string[] = [
        ...(primaryImage && !primaryFromPieceId ? [primaryImage.storageKey] : []),
        ...beforeImages.map((i) => i.storageKey),
        ...afterImages.map((i) => i.storageKey),
      ];
      const data: Omit<Project, "id" | "createdAt" | "updatedAt"> = {
        title: title.trim(),
        slug: s,
        metaDescription: metaDescription.trim() || undefined,
        primaryImage,
        primaryImageFromPieceId: primaryFromPieceId || undefined,
        pieceIds,
        beforeImages: beforeImages.length ? beforeImages : undefined,
        afterImages: afterImages.length ? afterImages : undefined,
        tagIds,
        uploadedStorageKeys: uploadedStorageKeys.length ? uploadedStorageKeys : undefined,
        createdBy: user?.uid,
      };
      const id = await createProject(data);
      router.push(`/admin/projects/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || !user || !isAdmin) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 320 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
        <Typography component="h1" variant="h5" fontWeight={600} sx={{ fontSize: { xs: "1.25rem", md: "1.5rem" } }}>
          Add project
        </Typography>
        <Button component={Link} href="/admin/projects" variant="outlined" sx={{ minHeight: 44 }}>
          Back
        </Button>
      </Stack>

      {error && <Alert severity="error" onClose={() => setError("")}>{error}</Alert>}
      {slugError && <Alert severity="warning">{slugError}</Alert>}

      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
        <Stack spacing={2}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
            slotProps={{ input: { style: { minHeight: 44 } } }}
          />
          <TextField
            label="URL slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            onBlur={checkSlug}
            helperText="Used in the page URL (e.g. /projects/office-reupholstery)"
            fullWidth
            slotProps={{ input: { style: { minHeight: 44 } } }}
          />
          <Button variant="outlined" size="small" onClick={() => setSlug(slugify(title))} sx={{ alignSelf: "flex-start" }}>
            Generate slug from title
          </Button>
          <TextField
            label="Meta description (optional)"
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            fullWidth
            multiline
            rows={2}
            slotProps={{ input: { style: { minHeight: 44 } } }}
          />
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
        <Stack spacing={2}>
          <Typography fontWeight={600}>Primary image</Typography>
          {primaryImage ? (
            <Box
              component="img"
              src={primaryImage.thumbnailUrl || primaryImage.publicUrl}
              alt="Primary"
              sx={{ width: "100%", maxWidth: 360, borderRadius: 1, bgcolor: "action.hover" }}
            />
          ) : (
            <Typography color="text.secondary">Upload a primary image or pick from a piece.</Typography>
          )}

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }}>
            <Button component="label" variant="contained" startIcon={<AddPhotoAlternateIcon />} sx={{ minHeight: 44 }}>
              Upload primary
              <input type="file" accept="image/*" hidden onChange={handlePrimaryUpload} />
            </Button>

            <FormControl sx={{ minWidth: 240 }} size="small">
              <InputLabel>Pick from piece</InputLabel>
              <Select
                value={primaryFromPieceId}
                label="Pick from piece"
                onChange={(e) => setPrimaryFromPiece(String(e.target.value))}
              >
                <MenuItem value=""><em>None</em></MenuItem>
                {pieces.map((p) => (
                  <MenuItem key={p.id} value={p.id}>{p.title}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
        <Stack spacing={2}>
          <Typography fontWeight={600}>Pieces in this project</Typography>
          <FormControl fullWidth size="small">
            <InputLabel>Add piece</InputLabel>
            <Select
              value=""
              label="Add piece"
              onChange={(e) => {
                const id = String(e.target.value);
                if (!id) return;
                handlePiecePick(id, true);
              }}
            >
              <MenuItem value=""><em>Select…</em></MenuItem>
              {pieces
                .filter((p) => !pieceIds.includes(p.id))
                .map((p) => (
                  <MenuItem key={p.id} value={p.id}>{p.title}</MenuItem>
                ))}
            </Select>
          </FormControl>

          {pieceIds.length === 0 ? (
            <Typography color="text.secondary">Optional: attach existing pieces to this project.</Typography>
          ) : (
            <Stack spacing={1}>
              {pieceIds.map((id, idx) => {
                const p = piecesById[id];
                return (
                  <Paper key={id} variant="outlined" sx={{ p: 1.25, borderRadius: 2 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Box
                        component="img"
                        src={(p?.thumbnailUrl || p?.publicUrl) ?? ""}
                        alt={p?.title ?? "Piece"}
                        sx={{ width: 64, height: 48, borderRadius: 1, bgcolor: "action.hover", objectFit: "cover" }}
                      />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography fontWeight={600} noWrap title={p?.title ?? id}>
                          {p?.title ?? id}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          #{idx + 1}
                        </Typography>
                      </Box>
                      <Tooltip title="Move up">
                        <span>
                          <IconButton size="small" onClick={() => movePiece(id, -1)} disabled={idx === 0}>
                            <ArrowUpwardIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title="Move down">
                        <span>
                          <IconButton size="small" onClick={() => movePiece(id, 1)} disabled={idx === pieceIds.length - 1}>
                            <ArrowDownwardIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title="Remove">
                        <IconButton size="small" color="error" onClick={() => handlePiecePick(id, false)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Paper>
                );
              })}
            </Stack>
          )}
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
        <Stack spacing={2}>
          <Typography fontWeight={600}>Before / After images (optional)</Typography>
          <Stack spacing={1}>
            <FormControl>
              <FormLabel>Before images</FormLabel>
              <Button component="label" variant="outlined" sx={{ mt: 0.75, minHeight: 44 }}>
                Upload before images
                <input type="file" accept="image/*" multiple hidden onChange={handleBeforeUpload} />
              </Button>
            </FormControl>
            {beforeImages.length > 0 && (
              <Stack direction="row" flexWrap="wrap" gap={1} useFlexGap>
                {beforeImages.map((img, i) => (
                  <Paper key={img.storageKey} variant="outlined" sx={{ p: 0.5, borderRadius: 2 }}>
                    <Stack spacing={0.5} alignItems="flex-end">
                      <Box
                        component="img"
                        src={img.thumbnailUrl || img.publicUrl}
                        alt={`Before ${i + 1}`}
                        sx={{ width: 110, height: 80, borderRadius: 1, objectFit: "cover", bgcolor: "action.hover" }}
                      />
                      <IconButton size="small" color="error" onClick={() => setBeforeImages((p) => p.filter((_, idx) => idx !== i))}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            )}
          </Stack>

          <Divider />

          <Stack spacing={1}>
            <FormControl>
              <FormLabel>After images</FormLabel>
              <Button component="label" variant="outlined" sx={{ mt: 0.75, minHeight: 44 }}>
                Upload after images
                <input type="file" accept="image/*" multiple hidden onChange={handleAfterUpload} />
              </Button>
            </FormControl>
            {afterImages.length > 0 && (
              <Stack direction="row" flexWrap="wrap" gap={1} useFlexGap>
                {afterImages.map((img, i) => (
                  <Paper key={img.storageKey} variant="outlined" sx={{ p: 0.5, borderRadius: 2 }}>
                    <Stack spacing={0.5} alignItems="flex-end">
                      <Box
                        component="img"
                        src={img.thumbnailUrl || img.publicUrl}
                        alt={`After ${i + 1}`}
                        sx={{ width: 110, height: 80, borderRadius: 1, objectFit: "cover", bgcolor: "action.hover" }}
                      />
                      <IconButton size="small" color="error" onClick={() => setAfterImages((p) => p.filter((_, idx) => idx !== i))}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            )}
          </Stack>
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
        <Stack spacing={2}>
          <Typography fontWeight={600}>Tags (apply to whole project)</Typography>
          {tagsByCategory.map(({ category, tags: catTags }) => {
            const selected = selectedTagIds[category.id] ?? [];
            return (
              <Box key={category.id}>
                <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ display: "block", mb: 0.75 }}>
                  {category.name}
                </Typography>
                <Stack direction="row" flexWrap="wrap" gap={1} useFlexGap>
                  {catTags.map((t) => {
                    const isSelected = selected.includes(t.id);
                    return (
                      <Button
                        key={t.id}
                        size="small"
                        variant={isSelected ? "contained" : "outlined"}
                        onClick={() => handleTagChange(category.id, t.id, !isSelected, category.selection)}
                        sx={{ minHeight: 36 }}
                      >
                        {t.label}
                      </Button>
                    );
                  })}
                  {catTags.length === 0 && <Typography variant="body2" color="text.secondary">No tags in this category.</Typography>}
                </Stack>
              </Box>
            );
          })}
        </Stack>
      </Paper>

      <Stack direction="row" spacing={2}>
        <Button variant="contained" onClick={handleSave} disabled={saving} sx={{ minHeight: 44 }}>
          {saving ? <CircularProgress size={20} color="inherit" /> : "Create project"}
        </Button>
        <Button component={Link} href="/admin/projects" variant="outlined" sx={{ minHeight: 44 }}>
          Cancel
        </Button>
      </Stack>
    </Box>
  );
}

