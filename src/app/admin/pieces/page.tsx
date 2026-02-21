"use client";

import { useEffect, useState, useMemo } from "react";
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
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import type { TagCategory, Tag, UpholsteryPiece } from "@/lib/firestore";
import { getUpholsteryPieces, getTagCategories, getTags } from "@/lib/firestore";

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

function filterPieces(pieces: UpholsteryPiece[], selectedTagIds: string[]): UpholsteryPiece[] {
  if (selectedTagIds.length === 0) return pieces;
  return pieces.filter((p) => selectedTagIds.every((id) => p.tagIds.includes(id)));
}

export default function PiecesGalleryPage() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [pieces, setPieces] = useState<UpholsteryPiece[]>([]);
  const [categories, setCategories] = useState<TagCategory[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilterTagIds, setSelectedFilterTagIds] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(GALLERY_PAGE_SIZE);
  const [filterExpanded, setFilterExpanded] = useState(false);

  const tagsByCategory = useMemo(
    () => buildTagsByCategory(categories, tags),
    [categories, tags]
  );
  const tagIdToLabel = useMemo(() => {
    const m: Record<string, string> = {};
    tags.forEach((t) => (m[t.id] = t.label));
    return m;
  }, [tags]);
  const filteredPieces = useMemo(
    () => filterPieces(pieces, selectedFilterTagIds),
    [pieces, selectedFilterTagIds]
  );
  const visiblePieces = useMemo(
    () => filteredPieces.slice(0, visibleCount),
    [filteredPieces, visibleCount]
  );
  const hasMore = filteredPieces.length > visibleCount;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    Promise.all([getUpholsteryPieces(), getTagCategories(), getTags()])
      .then(([p, c, t]) => {
        if (!cancelled) {
          setPieces(p);
          setCategories(c);
          setTags(t);
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e?.message ?? "Failed to load gallery.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const toggleFilter = (tagId: string) => {
    setSelectedFilterTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
    setVisibleCount(GALLERY_PAGE_SIZE);
  };

  const clearFilters = () => {
    setSelectedFilterTagIds([]);
    setVisibleCount(GALLERY_PAGE_SIZE);
  };

  const loadMore = () =>
    setVisibleCount((prev) => Math.min(prev + GALLERY_PAGE_SIZE, filteredPieces.length));

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 320 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Stack spacing={3}>
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
              : `${pieces.length} piece${pieces.length !== 1 ? "s" : ""} · select tags to view`}
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

      {tagsByCategory.length > 0 && (
        <Paper
          variant="outlined"
          sx={{
            borderRadius: 2,
            borderColor: "divider",
            overflow: "hidden",
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            onClick={() => setFilterExpanded((e) => !e)}
            sx={{
              px: 2,
              py: 1.5,
              cursor: "pointer",
              "&:hover": { bgcolor: "action.hover" },
            }}
          >
            <FilterListIcon fontSize="small" color="action" />
            <Typography variant="subtitle2" fontWeight={600} color="text.secondary" sx={{ flex: 1 }}>
              Filter by tags
              {selectedFilterTagIds.length > 0 && ` (${selectedFilterTagIds.length} selected)`}
            </Typography>
            {selectedFilterTagIds.length > 0 && (
              <Button size="small" onClick={(ev) => { ev.stopPropagation(); clearFilters(); }} sx={{ mr: 0.5 }}>
                Clear
              </Button>
            )}
            <IconButton size="small" aria-label={filterExpanded ? "Collapse" : "Expand"}>
              {filterExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Stack>
          <Collapse in={filterExpanded}>
            <Stack spacing={2} sx={{ px: 2, pb: 2, pt: 0 }}>
              {tagsByCategory.map(({ category, tags: catTags }) => (
                <Stack key={category.id} spacing={0.75}>
                  <Typography variant="caption" fontWeight={600} color="text.secondary">
                    {category.name}
                  </Typography>
                  <Stack direction="row" flexWrap="wrap" gap={1} useFlexGap>
                    {catTags.map((t) => {
                      const selected = selectedFilterTagIds.includes(t.id);
                      return (
                        <Chip
                          key={t.id}
                          label={t.label}
                          size="small"
                          variant={selected ? "filled" : "outlined"}
                          color={selected ? "primary" : "default"}
                          onClick={() => toggleFilter(t.id)}
                          sx={{
                            cursor: "pointer",
                            fontWeight: 500,
                            "&:hover": { opacity: 0.9 },
                          }}
                        />
                      );
                    })}
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </Collapse>
        </Paper>
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
      ) : selectedFilterTagIds.length === 0 ? (
        <Paper
          variant="outlined"
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 2,
            borderColor: "divider",
          }}
        >
          <Typography color="text.secondary">
            Select one or more tags above to view matching pieces. Images load only for your filtered results.
          </Typography>
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
              md: "repeat(3, 1fr)",
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
              }}
            >
              <CardMedia
                component="img"
                image={piece.publicUrl}
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
    </Stack>
  );
}
