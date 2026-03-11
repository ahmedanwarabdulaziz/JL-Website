"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  Box,
  Typography,
  Stack,
  Paper,
  Chip,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  Alert,
  Button,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { TagCategory, Tag, UpholsteryPiece } from "@/lib/firestore";
import { getUpholsteryPieces, getTagCategories, getTags, deleteUpholsteryPiece } from "@/lib/firestore";

type TagsByCategory = { category: TagCategory; tags: Tag[] };

function buildTagsByCategory(categories: TagCategory[], tags: Tag[]): TagsByCategory[] {
  return categories
    .map((category) => ({
      category,
      tags: tags.filter((t) => t.categoryId === category.id),
    }))
    .filter((g) => g.tags.length > 0);
}

const GALLERY_PAGE_SIZE = 24;
const SIDEBAR_WIDTH = 220;
const GALLERY_STATE_KEY = "admin-pieces-gallery-state";

function getSavedGalleryState(): {
  selectedFilterTagIds: string[];
  showAllImages: boolean;
  visibleCount: number;
} | null {
  if (typeof window === "undefined") return null;
  try {
    const s = sessionStorage.getItem(GALLERY_STATE_KEY);
    if (!s) return null;
    const j = JSON.parse(s) as Record<string, unknown>;
    return {
      selectedFilterTagIds: Array.isArray(j.selectedFilterTagIds) ? j.selectedFilterTagIds : [],
      showAllImages: Boolean(j.showAllImages),
      visibleCount: typeof j.visibleCount === "number" ? j.visibleCount : GALLERY_PAGE_SIZE,
    };
  } catch {
    return null;
  }
}

function filterPieces(pieces: UpholsteryPiece[], selectedTagIds: string[]): UpholsteryPiece[] {
  if (selectedTagIds.length === 0) return pieces;
  return pieces.filter((p) => selectedTagIds.every((id) => p.tagIds.includes(id)));
}

function FilterSidebar({
  tagsByCategory,
  selectedFilterTagIds,
  tagIdToPieceCount,
  onToggle,
  onClear,
}: {
  tagsByCategory: TagsByCategory[];
  selectedFilterTagIds: string[];
  tagIdToPieceCount: Record<string, number>;
  onToggle: (tagId: string) => void;
  onClear: () => void;
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        flexShrink: 0,
        width: SIDEBAR_WIDTH,
        alignSelf: "flex-start",
        position: "sticky",
        top: 16,
        borderRadius: 2,
        borderColor: "divider",
        overflow: "hidden",
      }}
    >
      <Stack sx={{ py: 1.5, px: 1.5 }} spacing={1.5}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="overline" color="text.secondary" fontWeight={600} sx={{ fontSize: "0.7rem", lineHeight: 1.4 }}>
            Filters
          </Typography>
          {selectedFilterTagIds.length > 0 && (
            <Button size="small" onClick={onClear} sx={{ minWidth: 0, px: 1, fontSize: "0.75rem" }}>
              Clear
            </Button>
          )}
        </Stack>
        {tagsByCategory.map(({ category, tags: catTags }) => (
          <Box key={category.id}>
            <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: "block", mb: 0.5, fontSize: "0.7rem" }}>
              {category.name}
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={0.5} useFlexGap>
              {catTags.map((t) => {
                const selected = selectedFilterTagIds.includes(t.id);
                const count = tagIdToPieceCount[t.id] ?? 0;
                return (
                  <Chip
                    key={t.id}
                    label={`${t.label} ${count}`}
                    size="small"
                    variant={selected ? "filled" : "outlined"}
                    color={selected ? "primary" : "default"}
                    onClick={() => onToggle(t.id)}
                    sx={{
                      cursor: "pointer",
                      fontWeight: 500,
                      height: 26,
                      fontSize: "0.75rem",
                      "& .MuiChip-label": { px: 1 },
                      "&:hover": { opacity: 0.9 },
                    }}
                  />
                );
              })}
            </Stack>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}

function FilterCollapsible({
  tagsByCategory,
  selectedFilterTagIds,
  tagIdToPieceCount,
  expanded,
  onExpandChange,
  onToggle,
  onClear,
}: {
  tagsByCategory: TagsByCategory[];
  selectedFilterTagIds: string[];
  tagIdToPieceCount: Record<string, number>;
  expanded: boolean;
  onExpandChange: () => void;
  onToggle: (tagId: string) => void;
  onClear: () => void;
}) {
  return (
    <Paper variant="outlined" sx={{ borderRadius: 2, borderColor: "divider", overflow: "hidden" }}>
      <Stack
        direction="row"
        alignItems="center"
        onClick={onExpandChange}
        sx={{ px: 1.5, py: 1, cursor: "pointer", "&:hover": { bgcolor: "action.hover" } }}
      >
        <FilterListIcon fontSize="small" color="action" />
        <Typography variant="subtitle2" fontWeight={600} color="text.secondary" sx={{ flex: 1, ml: 0.5 }}>
          Filters
          {selectedFilterTagIds.length > 0 && ` (${selectedFilterTagIds.length})`}
        </Typography>
        {selectedFilterTagIds.length > 0 && (
          <Button size="small" onClick={(ev) => { ev.stopPropagation(); onClear(); }} sx={{ mr: 0.5 }}>
            Clear
          </Button>
        )}
        <IconButton size="small" aria-label={expanded ? "Collapse" : "Expand"}>
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Stack>
      <Collapse in={expanded}>
        <Stack spacing={1.5} sx={{ px: 1.5, pb: 1.5, pt: 0 }}>
          {tagsByCategory.map(({ category, tags: catTags }) => (
            <Box key={category.id}>
              <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ display: "block", mb: 0.5, fontSize: "0.7rem" }}>
                {category.name}
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={0.5} useFlexGap>
                {catTags.map((t) => {
                  const selected = selectedFilterTagIds.includes(t.id);
                  const count = tagIdToPieceCount[t.id] ?? 0;
                  return (
                    <Chip
                      key={t.id}
                      label={`${t.label} ${count}`}
                      size="small"
                      variant={selected ? "filled" : "outlined"}
                      color={selected ? "primary" : "default"}
                      onClick={() => onToggle(t.id)}
                      sx={{
                        cursor: "pointer",
                        fontWeight: 500,
                        height: 26,
                        fontSize: "0.75rem",
                        "& .MuiChip-label": { px: 1 },
                        "&:hover": { opacity: 0.9 },
                      }}
                    />
                  );
                })}
              </Stack>
            </Box>
          ))}
        </Stack>
      </Collapse>
    </Paper>
  );
}

export default function PiecesGalleryPage() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [pieces, setPieces] = useState<UpholsteryPiece[]>([]);
  const [categories, setCategories] = useState<TagCategory[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilterTagIds, setSelectedFilterTagIds] = useState<string[]>(() => getSavedGalleryState()?.selectedFilterTagIds ?? []);
  const [showAllImages, setShowAllImages] = useState(() => getSavedGalleryState()?.showAllImages ?? false);
  const [visibleCount, setVisibleCount] = useState(() => getSavedGalleryState()?.visibleCount ?? GALLERY_PAGE_SIZE);
  const [filterExpanded, setFilterExpanded] = useState(false);
  const [pieceToDelete, setPieceToDelete] = useState<UpholsteryPiece | null>(null);
  const [deleting, setDeleting] = useState(false);

  const tagsByCategory = useMemo(
    () => buildTagsByCategory(categories, tags),
    [categories, tags]
  );
  const tagIdToLabel = useMemo(() => {
    const m: Record<string, string> = {};
    tags.forEach((t) => (m[t.id] = t.label));
    return m;
  }, [tags]);
  const tagIdToPieceCount = useMemo(() => {
    const m: Record<string, number> = {};
    tags.forEach((t) => (m[t.id] = 0));
    pieces.forEach((p) => {
      p.tagIds.forEach((tagId) => {
        if (m[tagId] !== undefined) m[tagId]++;
      });
    });
    return m;
  }, [pieces, tags]);
  const filteredPieces = useMemo(() => {
    if (selectedFilterTagIds.length > 0) return filterPieces(pieces, selectedFilterTagIds);
    if (showAllImages) return pieces;
    return [];
  }, [pieces, selectedFilterTagIds, showAllImages]);
  const visiblePieces = useMemo(
    () => filteredPieces.slice(0, visibleCount),
    [filteredPieces, visibleCount]
  );
  const hasMore = filteredPieces.length > visibleCount;

  const loadData = useCallback(async () => {
    const [p, c, t] = await Promise.all([getUpholsteryPieces(), getTagCategories(), getTags()]);
    setPieces(p);
    setCategories(c);
    setTags(t);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    loadData()
      .then(() => { if (!cancelled) setLoading(false); })
      .catch((e) => {
        if (!cancelled) setError(e?.message ?? "Failed to load gallery.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [loadData]);

  useEffect(() => {
    sessionStorage.setItem(
      GALLERY_STATE_KEY,
      JSON.stringify({
        selectedFilterTagIds,
        showAllImages,
        visibleCount,
      })
    );
  }, [selectedFilterTagIds, showAllImages, visibleCount]);

  const toggleFilter = (tagId: string) => {
    setSelectedFilterTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
    setVisibleCount(GALLERY_PAGE_SIZE);
  };

  const clearFilters = () => {
    setSelectedFilterTagIds([]);
    setShowAllImages(false);
    setVisibleCount(GALLERY_PAGE_SIZE);
  };

  const loadMore = () =>
    setVisibleCount((prev) => Math.min(prev + GALLERY_PAGE_SIZE, filteredPieces.length));

  const handleConfirmDelete = async () => {
    if (!pieceToDelete) return;
    setDeleting(true);
    try {
      await deleteUpholsteryPiece(pieceToDelete.id);
      await loadData();
      setPieceToDelete(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 320 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Stack direction={{ xs: "column", md: "row" }} spacing={{ xs: 3, md: 2 }} alignItems="stretch" sx={{ minWidth: 0 }}>
      {/* Left sidebar: filters (desktop only) */}
      {isDesktop && tagsByCategory.length > 0 && (
        <FilterSidebar
          tagsByCategory={tagsByCategory}
          selectedFilterTagIds={selectedFilterTagIds}
          tagIdToPieceCount={tagIdToPieceCount}
          onToggle={toggleFilter}
          onClear={clearFilters}
        />
      )}

      {/* Main content */}
      <Stack spacing={3} sx={{ flex: 1, minWidth: 0 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
          <Box>
            <Typography
              component="h1"
              variant="h4"
              fontWeight={600}
              sx={{ fontSize: { xs: "1.35rem", md: "1.5rem" } }}
            >
              Gallery
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5, fontSize: { xs: "0.95rem", md: "1rem" } }}>
              {selectedFilterTagIds.length > 0
                ? `${filteredPieces.length} match filter`
                : showAllImages
                  ? `${pieces.length} piece${pieces.length !== 1 ? "s" : ""}`
                  : "Select tags to filter or show all"}
            </Typography>
          </Box>
          <Button
            component={Link}
            href="/admin/pieces/new"
            variant="contained"
            startIcon={<AddPhotoAlternateIcon />}
            sx={{ minHeight: 44 }}
          >
            Add piece
          </Button>
        </Stack>

        {error && (
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Mobile: collapsible filter */}
        {!isDesktop && tagsByCategory.length > 0 && (
          <FilterCollapsible
            tagsByCategory={tagsByCategory}
            selectedFilterTagIds={selectedFilterTagIds}
            tagIdToPieceCount={tagIdToPieceCount}
            expanded={filterExpanded}
            onExpandChange={() => setFilterExpanded((e) => !e)}
            onToggle={toggleFilter}
            onClear={clearFilters}
          />
        )}

        {pieces.length === 0 ? (
        <Paper
          variant="outlined"
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 2,
            borderColor: "divider",
          }}
        >
          <Typography color="text.secondary" gutterBottom>
            No pieces yet. Add your first piece to see it here.
          </Typography>
          <Button
            component={Link}
            href="/admin/pieces/new"
            variant="contained"
            startIcon={<AddPhotoAlternateIcon />}
            sx={{ mt: 2 }}
          >
            Add piece
          </Button>
        </Paper>
      ) : selectedFilterTagIds.length === 0 && !showAllImages ? (
        <Paper
          variant="outlined"
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 2,
            borderColor: "divider",
          }}
        >
          <Typography color="text.secondary" gutterBottom>
            Select one or more tags in the filter to see matching pieces, or show all images.
          </Typography>
          <Button
            variant="contained"
            onClick={() => setShowAllImages(true)}
            sx={{ mt: 2 }}
          >
            Show all images
          </Button>
        </Paper>
      ) : visiblePieces.length === 0 ? (
        <Paper
          variant="outlined"
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 2,
            borderColor: "divider",
          }}
        >
          <Typography color="text.secondary" gutterBottom>
            No pieces match the selected filters.
          </Typography>
          <Button variant="outlined" onClick={clearFilters} sx={{ mt: 2 }}>
            Clear filters
          </Button>
        </Paper>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, 1fr)",
              sm: "repeat(3, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: 2,
          }}
        >
          {visiblePieces.map((piece) => (
            <Card
              key={piece.id}
              variant="outlined"
              sx={{
                borderRadius: 2,
                overflow: "hidden",
                transition: "box-shadow 0.2s ease",
                "&:hover": { boxShadow: 2 },
                position: "relative",
              }}
            >
              <Stack
                direction="row"
                spacing={0.5}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  zIndex: 1,
                }}
              >
                <Tooltip title="Edit piece">
                  <IconButton
                    component={Link}
                    href={`/admin/pieces/${piece.id}`}
                    size="small"
                    sx={{
                      bgcolor: "background.paper",
                      boxShadow: 1,
                      "&:hover": { bgcolor: "background.paper" },
                    }}
                    aria-label={`Edit ${piece.title}`}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete piece">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setPieceToDelete(piece);
                    }}
                    sx={{
                      bgcolor: "background.paper",
                      boxShadow: 1,
                      color: "error.main",
                      "&:hover": { bgcolor: "background.paper" },
                    }}
                    aria-label={`Delete ${piece.title}`}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
              <CardMedia
                component="img"
                image={piece.thumbnailUrl || piece.publicUrl}
                alt={piece.title}
                loading="lazy"
                decoding="async"
                sx={{
                  aspectRatio: "4/3",
                  bgcolor: "action.hover",
                  objectFit: "cover",
                }}
              />
              <CardContent sx={{ py: 1.5, px: 1.5, "&:last-child": { pb: 1.5 } }}>
                <Typography variant="subtitle2" fontWeight={600} noWrap title={piece.title}>
                  {piece.title}
                </Typography>
                {piece.tagIds.length > 0 && (
                  <Stack direction="row" flexWrap="wrap" gap={0.5} sx={{ mt: 0.75 }}>
                    {piece.tagIds.slice(0, isDesktop ? 5 : 3).map((tagId) => (
                      <Chip
                        key={tagId}
                        label={tagIdToLabel[tagId] ?? tagId}
                        size="small"
                        variant="outlined"
                        sx={{ height: 22, fontSize: "0.7rem", fontWeight: 500 }}
                      />
                    ))}
                    {piece.tagIds.length > (isDesktop ? 5 : 3) && (
                      <Chip
                        label={`+${piece.tagIds.length - (isDesktop ? 5 : 3)}`}
                        size="small"
                        variant="outlined"
                        sx={{ height: 22, fontSize: "0.7rem" }}
                      />
                    )}
                  </Stack>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {hasMore && (
        <Box sx={{ display: "flex", justifyContent: "center", pt: 1 }}>
          <Button variant="outlined" onClick={loadMore} sx={{ minHeight: 44 }}>
            Load more ({filteredPieces.length - visibleCount} remaining)
          </Button>
        </Box>
      )}
      <Dialog open={pieceToDelete !== null} onClose={() => !deleting && setPieceToDelete(null)}>
        <DialogTitle>Delete piece?</DialogTitle>
        <DialogContent>
          <Typography>
            {pieceToDelete
              ? `"${pieceToDelete.title}" will be permanently deleted. This cannot be undone.`
              : ""}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 2 }}>
          <Button onClick={() => setPieceToDelete(null)} disabled={deleting}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleConfirmDelete} disabled={deleting}>
            {deleting ? <CircularProgress size={20} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
      </Stack>
    </Stack>
  );
}
