"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  TextField,
  Alert,
  Stack,
  Paper,
  Chip,
  Tooltip,
  IconButton,
  Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import RotateRightIcon from "@mui/icons-material/RotateRight";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "@/contexts/AuthContext";
import type { TagCategory, Tag, UpholsteryPiece } from "@/lib/firestore";
import {
  getUpholsteryPieceById,
  getTagCategories,
  getTags,
  slugExists,
  slugify,
  updateUpholsteryPiece,
  deleteUpholsteryPiece,
  toggleTagFeaturedImage,
  type StoredImage,
} from "@/lib/firestore";

// Accepted image formats – everything is converted to WebP on the server
const ACCEPT_FORMATS =
  "image/jpeg,image/png,image/webp,image/gif,image/avif,image/heic,image/heif,image/tiff,image/bmp";

type Rotation = 0 | 90 | 180 | 270;

function rotateLeft(r: Rotation): Rotation {
  return ((r + 270) % 360) as Rotation;
}
function rotateRight(r: Rotation): Rotation {
  return ((r + 90) % 360) as Rotation;
}

export default function EditPiecePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string | undefined;
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [piece, setPiece] = useState<UpholsteryPiece | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [slugError, setSlugError] = useState("");
  const [tagValidationErrors, setTagValidationErrors] = useState<string[]>([]);
  const [togglingStarFor, setTogglingStarFor] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<Record<string, string[]>>({});

  const [categories, setCategories] = useState<TagCategory[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  // ─── Replace Image state ──────────────────────────────────────────────────
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const [replaceFile, setReplaceFile] = useState<File | null>(null);
  const [replacePreview, setReplacePreview] = useState<string | null>(null);
  const [replaceRotation, setReplaceRotation] = useState<Rotation>(0);
  const [replacing, setReplacing] = useState(false);
  const [replaceError, setReplaceError] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user || !isAdmin) {
      router.replace("/login");
      return;
    }
  }, [user, isAdmin, authLoading, router]);

  const loadData = useCallback(async () => {
    if (!id) return;
    const [p, cats, allTags] = await Promise.all([
      getUpholsteryPieceById(id),
      getTagCategories(),
      getTags(),
    ]);
    if (p) {
      setPiece(p);
      setTitle(p.title);
      setSlug(p.slug);
      setMetaDescription(p.metaDescription ?? "");
      const byCategory: Record<string, string[]> = {};
      p.tagIds.forEach((tagId) => {
        const t = allTags.find((x) => x.id === tagId);
        if (t) {
          if (!byCategory[t.categoryId]) byCategory[t.categoryId] = [];
          byCategory[t.categoryId].push(tagId);
        }
      });
      setSelectedTagIds(byCategory);
    }
    setCategories(cats);
    setTags(allTags);
  }, [id]);

  useEffect(() => {
    if (!user || !isAdmin || !id) return;
    setLoading(true);
    loadData().finally(() => setLoading(false));
  }, [user, isAdmin, id, loadData]);

  const checkSlug = async () => {
    if (!slug.trim() || !id) return;
    const exists = await slugExists(slug.trim(), id);
    setSlugError(exists ? "This URL is already used" : "");
  };

  const tagsByCategory = categories.map((c) => ({
    category: c,
    tags: tags.filter((t) => t.categoryId === c.id),
  }));

  const handleTagChange = (categoryId: string, tagId: string, selected: boolean, selection: "single" | "multiple") => {
    setSelectedTagIds((prev) => {
      const current = prev[categoryId] ?? [];
      if (selection === "single") return { ...prev, [categoryId]: selected ? [tagId] : [] };
      if (selected) return { ...prev, [categoryId]: [...current, tagId] };
      return { ...prev, [categoryId]: current.filter((x) => x !== tagId) };
    });
  };

  const handleToggleFeatured = async (tagId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!piece) return;

    const tag = tags.find(t => t.id === tagId);
    if (!tag) return;

    const isCurrentlyFeatured = tag.featuredImages?.some(img => img.storageKey === piece.storageKey) || false;

    setTogglingStarFor(tagId);
    try {
      const imgObj: StoredImage = {
        storageKey: piece.storageKey,
        publicUrl: piece.publicUrl,
        thumbnailUrl: piece.thumbnailUrl
      };
      await toggleTagFeaturedImage(tagId, imgObj, !isCurrentlyFeatured);

      // Refresh tags list to update UI
      const updatedTags = await getTags();
      setTags(updatedTags);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update featured images");
    } finally {
      setTogglingStarFor(null);
    }
  };

  const validateTags = (): boolean => {
    const mandatory = categories.filter((c) => c.type === "mandatory");
    const errs: string[] = [];
    for (const c of mandatory) {
      const selected = selectedTagIds[c.id] ?? [];
      if (selected.length === 0) errs.push(`Select at least one tag in "${c.name}"`);
    }
    setTagValidationErrors(errs);
    return errs.length === 0;
  };

  // ─── Replace image handlers ───────────────────────────────────────────────

  const handleReplaceFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (replacePreview) URL.revokeObjectURL(replacePreview);
    setReplaceFile(f);
    setReplacePreview(URL.createObjectURL(f));
    setReplaceRotation(0);
    setReplaceError("");
    e.target.value = "";
  };

  const cancelReplace = () => {
    if (replacePreview) URL.revokeObjectURL(replacePreview);
    setReplaceFile(null);
    setReplacePreview(null);
    setReplaceRotation(0);
    setReplaceError("");
  };

  const handleSave = async () => {
    if (!piece || !validateTags()) return;
    const s = slug.trim() || slugify(title);
    const exists = await slugExists(s, piece.id);
    if (exists) {
      setSlugError("This URL is already used");
      return;
    }
    setError("");
    setSaving(true);
    try {
      const allTagIds = Object.values(selectedTagIds).flat();

      // If the user chose a replacement image, upload it first
      let newImageFields: { storageKey?: string; publicUrl?: string; thumbnailUrl?: string } = {};
      if (replaceFile) {
        setReplacing(true);
        const fd = new FormData();
        fd.append("file", replaceFile);
        if (replaceRotation !== 0) fd.append("rotation", String(replaceRotation));
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        setReplacing(false);
        if (!res.ok) {
          setReplaceError(data.error || "Image upload failed");
          setSaving(false);
          return;
        }
        newImageFields = {
          storageKey: data.storageKey,
          publicUrl: data.publicUrl,
          thumbnailUrl: data.thumbnailUrl ?? "",
        };
      }

      await updateUpholsteryPiece(piece.id, {
        title: title.trim(),
        slug: s,
        metaDescription: metaDescription.trim() || undefined,
        tagIds: allTagIds,
        ...newImageFields,
      });
      router.push("/admin/pieces");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
      setReplacing(false);
    }
  };

  const handleDelete = async () => {
    if (!piece || !confirm("Delete this piece? This cannot be undone.")) return;
    setError("");
    setDeleting(true);
    try {
      await deleteUpholsteryPiece(piece.id);
      router.push("/admin/pieces");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  if (authLoading || !user || !isAdmin) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (loading || !piece) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 320 }}>
        {loading ? <CircularProgress /> : <Typography color="text.secondary">Piece not found.</Typography>}
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
        <Typography component="h1" variant="h5" fontWeight={600} sx={{ fontSize: { xs: "1.25rem", md: "1.5rem" } }}>
          Edit piece
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button component={Link} href="/admin/pieces" variant="outlined" sx={{ minHeight: 44 }}>
            Back to gallery
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
            disabled={deleting}
            sx={{ minHeight: 44 }}
          >
            {deleting ? <CircularProgress size={20} color="inherit" /> : "Delete"}
          </Button>
        </Stack>
      </Stack>

      {error && <Alert severity="error" onClose={() => setError("")}>{error}</Alert>}
      {slugError && <Alert severity="warning">{slugError}</Alert>}
      {tagValidationErrors.length > 0 && (
        <Alert severity="warning">
          {tagValidationErrors.map((e) => (
            <div key={e}>{e}</div>
          ))}
        </Alert>
      )}

      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
        {/* ── Current image + Replace controls ── */}
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
          Image
        </Typography>

        {replacePreview ? (
          /* New image preview with rotate controls */
          <Stack spacing={1.5} sx={{ mb: 2 }}>
            <Box sx={{ position: "relative", display: "inline-flex", alignSelf: "flex-start" }}>
              <Box
                sx={{
                  width: 280,
                  height: 210,
                  overflow: "hidden",
                  borderRadius: 1,
                  bgcolor: "action.hover",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  component="img"
                  src={replacePreview}
                  alt="New image preview"
                  sx={{
                    width: replaceRotation === 90 || replaceRotation === 270 ? "75%" : "100%",
                    height: replaceRotation === 90 || replaceRotation === 270 ? "75%" : "100%",
                    objectFit: "cover",
                    transform: `rotate(${replaceRotation}deg)`,
                    transition: "transform 0.25s ease",
                  }}
                />
              </Box>
              {/* Close / cancel replace */}
              <IconButton
                size="small"
                onClick={cancelReplace}
                sx={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  bgcolor: "rgba(0,0,0,0.55)",
                  color: "#fff",
                  "&:hover": { bgcolor: "rgba(0,0,0,0.75)" },
                  width: 24,
                  height: 24,
                }}
              >
                <CloseIcon sx={{ fontSize: 14 }} />
              </IconButton>
            </Box>

            {/* Rotate buttons */}
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="caption" color="text.secondary">
                Rotation:
              </Typography>
              <Tooltip title="Rotate left 90°">
                <IconButton
                  size="small"
                  onClick={() => setReplaceRotation(rotateLeft(replaceRotation))}
                  sx={{ bgcolor: "action.hover" }}
                >
                  <RotateLeftIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Rotate right 90°">
                <IconButton
                  size="small"
                  onClick={() => setReplaceRotation(rotateRight(replaceRotation))}
                  sx={{ bgcolor: "action.hover" }}
                >
                  <RotateRightIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Typography variant="caption" color="text.secondary">
                {replaceRotation}°
              </Typography>
            </Stack>

            {replaceError && (
              <Alert severity="error" sx={{ mt: 0.5 }}>
                {replaceError}
              </Alert>
            )}

            <Typography variant="caption" color="text.secondary">
              New image will be saved when you click &quot;Save changes&quot;.
            </Typography>
          </Stack>
        ) : (
          /* Current stored image */
          <Box
            component="img"
            src={piece.thumbnailUrl || piece.publicUrl}
            alt={piece.title}
            sx={{ maxWidth: 280, width: "100%", borderRadius: 1, mb: 1.5, display: "block" }}
          />
        )}

        {/* Replace image button */}
        <Button
          variant="outlined"
          size="small"
          startIcon={<SwapHorizIcon />}
          onClick={() => replaceInputRef.current?.click()}
          disabled={replacing}
          sx={{ mb: 2 }}
        >
          {replaceFile ? "Choose different image" : "Replace image"}
        </Button>
        <input
          ref={replaceInputRef}
          type="file"
          accept={ACCEPT_FORMATS}
          hidden
          onChange={handleReplaceFileChange}
        />
        <Typography variant="caption" color="text.disabled" sx={{ display: "block", mb: 2 }}>
          JPEG · PNG · HEIC · AVIF · WebP · GIF · TIFF · BMP — converted to WebP automatically
        </Typography>

        <Divider sx={{ mb: 2 }} />

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
            helperText="Used in the page URL"
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

      <Typography variant="subtitle2" fontWeight={600} sx={{ mt: 1 }}>
        Tags
      </Typography>
      <Stack spacing={2}>
        {tagsByCategory.map(({ category, tags: catTags }) => {
          const selected = selectedTagIds[category.id] ?? [];
          return (
            <Paper
              key={category.id}
              variant="outlined"
              sx={{
                p: 2,
                borderRadius: 2,
                borderColor: category.type === "mandatory" && selected.length === 0 ? "error.light" : "divider",
              }}
            >
              <Stack spacing={1}>
                <Typography variant="subtitle2" fontWeight={600}>
                  {category.name}
                  {category.type === "mandatory" && (
                    <Chip label="Required" size="small" color="primary" variant="outlined" sx={{ ml: 1 }} />
                  )}
                </Typography>
                <Stack direction="row" flexWrap="wrap" gap={1} useFlexGap>
                  {catTags.map((t) => {
                    const isSelected = selected.includes(t.id);
                    const isFeatured = t.featuredImages?.some(img => img.storageKey === piece?.storageKey);

                    return (
                      <Chip
                        key={t.id}
                        label={t.label}
                        onClick={() => handleTagChange(category.id, t.id, !isSelected, category.selection)}
                        variant={isSelected ? "filled" : "outlined"}
                        color={isSelected ? "primary" : "default"}
                        onDelete={isSelected ? (e) => handleToggleFeatured(t.id, e as any) : undefined}
                        deleteIcon={
                          isSelected ? (
                            togglingStarFor === t.id ? (
                              <CircularProgress size={16} color="inherit" />
                            ) : isFeatured ? (
                              <Tooltip title="Remove from Featured Images"><StarIcon sx={{ color: "#ffd700 !important", fontSize: 20 }} /></Tooltip>
                            ) : (
                              <Tooltip title="Set as Featured Image for this Tag"><StarBorderIcon sx={{ fontSize: 20 }} /></Tooltip>
                            )
                          ) : undefined
                        }
                        sx={{ cursor: "pointer", fontWeight: 500, "& .MuiChip-deleteIcon": { opacity: 1 } }}
                      />
                    );
                  })}
                  {catTags.length === 0 && (
                    <Typography variant="body2" color="text.secondary">No tags in this category.</Typography>
                  )}
                </Stack>
              </Stack>
            </Paper>
          );
        })}
      </Stack>

      <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
        <Button
          variant="contained"
          startIcon={replacing ? <CircularProgress size={16} color="inherit" /> : <EditIcon />}
          onClick={handleSave}
          disabled={saving || replacing}
          sx={{ minHeight: 44 }}
        >
          {saving || replacing ? (replacing ? "Uploading image…" : "Saving…") : "Save changes"}
        </Button>
        <Button component={Link} href="/admin/pieces" variant="outlined" sx={{ minHeight: 44 }}>
          Cancel
        </Button>
      </Stack>
    </Box>
  );
}
