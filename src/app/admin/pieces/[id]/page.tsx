"use client";

import { useEffect, useState, useCallback } from "react";
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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
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
      await updateUpholsteryPiece(piece.id, {
        title: title.trim(),
        slug: s,
        metaDescription: metaDescription.trim() || undefined,
        tagIds: allTagIds,
      });
      router.push("/admin/pieces");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
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
        <Box
          component="img"
          src={piece.thumbnailUrl || piece.publicUrl}
          alt={piece.title}
          sx={{ maxWidth: 280, width: "100%", borderRadius: 1, mb: 2, display: "block" }}
        />
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
        <Button variant="contained" startIcon={<EditIcon />} onClick={handleSave} disabled={saving} sx={{ minHeight: 44 }}>
          {saving ? <CircularProgress size={20} color="inherit" /> : "Save changes"}
        </Button>
        <Button component={Link} href="/admin/pieces" variant="outlined" sx={{ minHeight: 44 }}>
          Cancel
        </Button>
      </Stack>
    </Box>
  );
}
