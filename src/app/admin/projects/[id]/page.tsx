"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
  deleteProject,
  getProjectById,
  getTagCategories,
  getTags,
  getUpholsteryPieces,
  projectSlugExists,
  slugify,
  updateProject,
} from "@/lib/firestore";
import { useAuth } from "@/contexts/AuthContext";

function toSelectedByCategory(tagIds: string[], tags: Tag[]): Record<string, string[]> {
  const byCat: Record<string, string[]> = {};
  tagIds.forEach((id) => {
    const t = tags.find((x) => x.id === id);
    if (!t) return;
    if (!byCat[t.categoryId]) byCat[t.categoryId] = [];
    byCat[t.categoryId].push(id);
  });
  return byCat;
}

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string | undefined;
  const { user, isAdmin, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [slugError, setSlugError] = useState("");

  const [project, setProject] = useState<Project | null>(null);
  const [categories, setCategories] = useState<TagCategory[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [pieces, setPieces] = useState<UpholsteryPiece[]>([]);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [metaDescription, setMetaDescription] = useState("");

  const [primaryImage, setPrimaryImage] = useState<StoredImage | null>(null);
  const [primaryFromPieceId, setPrimaryFromPieceId] = useState<string>("");
  const [pieceIds, setPieceIds] = useState<string[]>([]);
  const [beforeImages, setBeforeImages] = useState<StoredImage[]>([]);
  const [afterImages, setAfterImages] = useState<StoredImage[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<Record<string, string[]>>({});

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user || !isAdmin) {
      router.replace("/login");
      return;
    }
  }, [user, isAdmin, authLoading, router]);

  useEffect(() => {
    if (!user || !isAdmin || !id) return;
    setLoading(true);
    Promise.all([getProjectById(id), getTagCategories(), getTags(), getUpholsteryPieces()])
      .then(([proj, c, t, p]) => {
        setCategories(c);
        setTags(t);
        setPieces(p);
        setProject(proj);
        if (proj) {
          setTitle(proj.title);
          setSlug(proj.slug);
          setMetaDescription(proj.metaDescription ?? "");
          setPrimaryImage(proj.primaryImage);
          setPrimaryFromPieceId(proj.primaryImageFromPieceId ?? "");
          setPieceIds(proj.pieceIds ?? []);
          setBeforeImages(proj.beforeImages ?? []);
          setAfterImages(proj.afterImages ?? []);
          setSelectedTagIds(toSelectedByCategory(proj.tagIds ?? [], t));
        }
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load project"))
      .finally(() => setLoading(false));
  }, [user, isAdmin, id]);

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

  const movePiece = (pid: string, dir: -1 | 1) => {
    setPieceIds((prev) => {
      const idx = prev.indexOf(pid);
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

  const handleTagChange = (categoryId: string, tagId: string, selected: boolean, selection: "single" | "multiple") => {
    setSelectedTagIds((prev) => {
      const current = prev[categoryId] ?? [];
      if (selection === "single") return { ...prev, [categoryId]: selected ? [tagId] : [] };
      if (selected) return { ...prev, [categoryId]: [...current, tagId] };
      return { ...prev, [categoryId]: current.filter((x) => x !== tagId) };
    });
  };

  const checkSlug = async () => {
    if (!slug.trim() || !project) return;
    const exists = await projectSlugExists(slug.trim(), project.id);
    setSlugError(exists ? "This URL is already used" : "");
  };

  const handleSave = async () => {
    if (!project) return;
    setError("");
    setSlugError("");
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    const s = slug.trim() || slugify(title);
    const exists = await projectSlugExists(s, project.id);
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
      await updateProject(project.id, {
        title: title.trim(),
        slug: s.trim(),
        metaDescription: metaDescription.trim() || undefined,
        primaryImage,
        primaryImageFromPieceId: primaryFromPieceId || undefined,
        pieceIds,
        beforeImages: beforeImages.length ? beforeImages : undefined,
        afterImages: afterImages.length ? afterImages : undefined,
        tagIds,
        uploadedStorageKeys: uploadedStorageKeys.length ? uploadedStorageKeys : undefined,
      });
      router.push("/admin/projects");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!project) return;
    setDeleting(true);
    try {
      const keys = project.uploadedStorageKeys ?? [];
      if (keys.length > 0) {
        const res = await fetch("/api/projects/cleanup-r2", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ keys }),
        });
        if (!res.ok) throw new Error("Failed to remove project images");
      }
      await deleteProject(project.id);
      router.push("/admin/projects");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setDeleting(false);
      setConfirmDeleteOpen(false);
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

  if (!project) {
    return (
      <Box sx={{ py: 6 }}>
        <Typography color="text.secondary">Project not found.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
        <Typography component="h1" variant="h5" fontWeight={600} sx={{ fontSize: { xs: "1.25rem", md: "1.5rem" } }}>
          Edit project
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button component={Link} href="/admin/projects" variant="outlined" sx={{ minHeight: 44 }}>
            Back
          </Button>
          <Button variant="contained" color="error" onClick={() => setConfirmDeleteOpen(true)} sx={{ minHeight: 44 }}>
            Delete
          </Button>
        </Stack>
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
                const pid = String(e.target.value);
                if (!pid) return;
                setPieceIds((prev) => (prev.includes(pid) ? prev : [...prev, pid]));
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
              {pieceIds.map((pid, idx) => {
                const p = piecesById[pid];
                return (
                  <Paper key={pid} variant="outlined" sx={{ p: 1.25, borderRadius: 2 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Box
                        component="img"
                        src={(p?.thumbnailUrl || p?.publicUrl) ?? ""}
                        alt={p?.title ?? "Piece"}
                        sx={{ width: 64, height: 48, borderRadius: 1, bgcolor: "action.hover", objectFit: "cover" }}
                      />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography fontWeight={600} noWrap title={p?.title ?? pid}>
                          {p?.title ?? pid}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          #{idx + 1}
                        </Typography>
                      </Box>
                      <Tooltip title="Move up">
                        <span>
                          <IconButton size="small" onClick={() => movePiece(pid, -1)} disabled={idx === 0}>
                            <ArrowUpwardIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title="Move down">
                        <span>
                          <IconButton size="small" onClick={() => movePiece(pid, 1)} disabled={idx === pieceIds.length - 1}>
                            <ArrowDownwardIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title="Remove">
                        <IconButton size="small" color="error" onClick={() => setPieceIds((prev) => prev.filter((x) => x !== pid))}>
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
          {saving ? <CircularProgress size={20} color="inherit" /> : "Save changes"}
        </Button>
        <Button component={Link} href="/admin/projects" variant="outlined" sx={{ minHeight: 44 }}>
          Cancel
        </Button>
      </Stack>

      <Dialog open={confirmDeleteOpen} onClose={() => !deleting && setConfirmDeleteOpen(false)}>
        <DialogTitle>Delete project?</DialogTitle>
        <DialogContent>
          <Typography>{`\"${project.title}\" will be permanently deleted. This cannot be undone.`}</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 2 }}>
          <Button onClick={() => setConfirmDeleteOpen(false)} disabled={deleting}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleDelete} disabled={deleting}>
            {deleting ? <CircularProgress size={20} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

