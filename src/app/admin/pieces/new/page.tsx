"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  TextField,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Stack,
  useTheme,
  useMediaQuery,
  Paper,
  Chip,
  FormControl,
  IconButton,
  LinearProgress,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useAuth } from "@/contexts/AuthContext";
import type { TagCategory, Tag } from "@/lib/firestore";
import {
  getTagCategories,
  getTags,
  slugExists,
  slugify,
  createUpholsteryPiece,
} from "@/lib/firestore";

const STEPS = ["Upload", "Name", "Tags", "Done"];

interface ImageItem {
  id: string; // local id
  file: File;
  previewUrl: string;
  title: string;
  slug: string;
  slugError: string;
  // upload result
  uploadStatus: "pending" | "uploading" | "done" | "error";
  uploadError: string;
  storageKey: string;
  publicUrl: string;
  thumbnailUrl: string;
}

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

export default function NewPiecePage() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const router = useRouter();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saveResults, setSaveResults] = useState<{ title: string; ok: boolean; msg?: string }[]>([]);

  const [items, setItems] = useState<ImageItem[]>([]);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const [categories, setCategories] = useState<TagCategory[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<Record<string, string[]>>({});
  const [tagValidationErrors, setTagValidationErrors] = useState<string[]>([]);

  // Step 1 shared meta description
  const [metaDescription, setMetaDescription] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user || !isAdmin) {
      router.replace("/login");
    }
  }, [user, isAdmin, authLoading, router]);

  const loadTagData = useCallback(async () => {
    const [cats, allTags] = await Promise.all([getTagCategories(), getTags()]);
    setCategories(cats);
    setTags(allTags);
  }, []);

  useEffect(() => {
    if (!user || !isAdmin) return;
    if (activeStep >= 2) loadTagData();
  }, [user, isAdmin, activeStep, loadTagData]);

  // ─── Drag & Drop ─────────────────────────────────────────────────────────────

  const addFiles = (files: FileList | File[]) => {
    const newItems: ImageItem[] = [];
    Array.from(files).forEach((f) => {
      if (!f.type.startsWith("image/")) return;
      const raw = f.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
      const title = raw;
      const slug = slugify(raw);
      newItems.push({
        id: makeId(),
        file: f,
        previewUrl: URL.createObjectURL(f),
        title,
        slug,
        slugError: "",
        uploadStatus: "pending",
        uploadError: "",
        storageKey: "",
        publicUrl: "",
        thumbnailUrl: "",
      });
    });
    setItems((prev) => [...prev, ...newItems]);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (e.dataTransfer.files.length > 0) addFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (dropRef.current && !dropRef.current.contains(e.relatedTarget as Node)) {
      setIsDraggingOver(false);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) addFiles(e.target.files);
    e.target.value = "";
  };

  const removeItem = (id: string) => {
    setItems((prev) => {
      const item = prev.find((x) => x.id === id);
      if (item) URL.revokeObjectURL(item.previewUrl);
      return prev.filter((x) => x.id !== id);
    });
  };

  // ─── Step 0 → 1: Upload all ───────────────────────────────────────────────

  const [uploading, setUploading] = useState(false);

  const uploadSingle = async (item: ImageItem): Promise<Partial<ImageItem>> => {
    const formData = new FormData();
    formData.append("file", item.file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Upload failed");
    return {
      uploadStatus: "done",
      storageKey: data.storageKey,
      publicUrl: data.publicUrl,
      thumbnailUrl: data.thumbnailUrl ?? "",
    };
  };

  const handleUploadAll = async () => {
    if (items.length === 0) {
      setError("Please add at least one image.");
      return;
    }
    setError("");
    setUploading(true);

    // Mark all as uploading
    setItems((prev) => prev.map((x) => ({ ...x, uploadStatus: "uploading" as const })));

    // Upload concurrently
    const results = await Promise.allSettled(items.map((item) => uploadSingle(item)));

    setItems((prev) =>
      prev.map((item, i) => {
        const r = results[i];
        if (r.status === "fulfilled") {
          return { ...item, ...r.value, uploadStatus: "done" };
        } else {
          return {
            ...item,
            uploadStatus: "error",
            uploadError: r.reason instanceof Error ? r.reason.message : "Upload failed",
          };
        }
      })
    );

    setUploading(false);

    const allOk = results.every((r) => r.status === "fulfilled");
    if (allOk) {
      setActiveStep(1);
    } else {
      setError("Some images failed to upload. Remove them and retry, or fix the errors.");
    }
  };

  // ─── Step 1: Name ────────────────────────────────────────────────────────────

  const updateItemField = (id: string, field: "title" | "slug" | "slugError", value: string) => {
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, [field]: value } : x)));
  };

  const syncSlug = (id: string, title: string) => {
    updateItemField(id, "slug", slugify(title));
  };

  const checkItemSlug = async (id: string, slug: string) => {
    if (!slug.trim()) {
      updateItemField(id, "slugError", "Slug is required");
      return;
    }
    const exists = await slugExists(slug.trim());
    updateItemField(id, "slugError", exists ? "This URL is already used" : "");
  };

  const handleNextFromName = async () => {
    setError("");
    // Validate titles
    const noTitle = items.find((x) => !x.title.trim());
    if (noTitle) {
      setError("All pieces need a title.");
      return;
    }
    // Generate slugs from title where empty
    const withSlugs = items.map((x) => ({
      ...x,
      slug: x.slug.trim() || slugify(x.title),
    }));
    setItems(withSlugs);

    // Check all slugs
    const checks = await Promise.all(
      withSlugs.map(async (x) => {
        const exists = await slugExists(x.slug);
        return { id: x.id, slug: x.slug, exists };
      })
    );
    const conflicts = checks.filter((c) => c.exists);
    if (conflicts.length > 0) {
      setItems((prev) =>
        prev.map((x) => {
          const conflict = conflicts.find((c) => c.id === x.id);
          return conflict ? { ...x, slugError: "This URL is already used" } : x;
        })
      );
      setError("Fix duplicate URL slugs before continuing.");
      return;
    }
    setActiveStep(2);
  };

  // ─── Step 2: Tags ─────────────────────────────────────────────────────────

  const tagsByCategory = categories.map((c) => ({
    category: c,
    tags: tags.filter((t) => t.categoryId === c.id),
  }));

  const handleTagChange = (
    categoryId: string,
    tagId: string,
    selected: boolean,
    selection: "single" | "multiple"
  ) => {
    setSelectedTagIds((prev) => {
      const current = prev[categoryId] ?? [];
      if (selection === "single") return { ...prev, [categoryId]: selected ? [tagId] : [] };
      if (selected) return { ...prev, [categoryId]: [...current, tagId] };
      return { ...prev, [categoryId]: current.filter((id) => id !== tagId) };
    });
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

  // ─── Save all pieces ──────────────────────────────────────────────────────

  const handleSave = async () => {
    if (!validateTags()) return;
    setError("");
    setSaving(true);
    const allTagIds = Object.values(selectedTagIds).flat();

    const results = await Promise.allSettled(
      items.map((item) =>
        createUpholsteryPiece({
          title: item.title.trim(),
          slug: item.slug.trim(),
          metaDescription: metaDescription.trim() || undefined,
          storageKey: item.storageKey,
          publicUrl: item.publicUrl,
          ...(item.thumbnailUrl ? { thumbnailUrl: item.thumbnailUrl } : {}),
          tagIds: allTagIds,
          createdBy: user?.uid,
        })
      )
    );

    setSaveResults(
      items.map((item, i) => {
        const r = results[i];
        return r.status === "fulfilled"
          ? { title: item.title, ok: true }
          : {
              title: item.title,
              ok: false,
              msg: r.reason instanceof Error ? r.reason.message : "Save failed",
            };
      })
    );
    setSaving(false);
    setActiveStep(3);
  };

  // ─── Reset ────────────────────────────────────────────────────────────────

  const resetForm = () => {
    setActiveStep(0);
    items.forEach((x) => URL.revokeObjectURL(x.previewUrl));
    setItems([]);
    setMetaDescription("");
    setSelectedTagIds({});
    setTagValidationErrors([]);
    setSaveResults([]);
    setError("");
  };

  // ─── Auth guard ───────────────────────────────────────────────────────────

  if (authLoading || !user || !isAdmin) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  const uploadedCount = items.filter((x) => x.uploadStatus === "done").length;
  const errorCount = items.filter((x) => x.uploadStatus === "error").length;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
      <Typography
        component="h1"
        variant="h5"
        fontWeight={600}
        sx={{ fontSize: { xs: "1.25rem", md: "1.5rem" } }}
      >
        Add pieces
      </Typography>

      <Stepper activeStep={activeStep} sx={{ pt: 0, pb: 2 }} alternativeLabel={!isDesktop}>
        {STEPS.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {error && <Alert severity="error" onClose={() => setError("")}>{error}</Alert>}
      {tagValidationErrors.length > 0 && (
        <Alert severity="warning">
          {tagValidationErrors.map((e) => (
            <div key={e}>{e}</div>
          ))}
        </Alert>
      )}

      {/* ── Step 0: Drop zone ── */}
      {activeStep === 0 && (
        <Stack spacing={2}>
          {/* Drop zone */}
          <FormControl fullWidth>
            <Box
              ref={dropRef}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              sx={{
                border: "2px dashed",
                borderColor: isDraggingOver ? "primary.main" : "divider",
                borderRadius: 2,
                p: { xs: 4, md: 6 },
                textAlign: "center",
                cursor: "pointer",
                bgcolor: isDraggingOver ? "action.hover" : "background.paper",
                transition: "all 0.2s ease",
                "&:hover": { borderColor: "primary.light", bgcolor: "action.hover" },
              }}
            >
              <ImageIcon sx={{ fontSize: 48, color: isDraggingOver ? "primary.main" : "text.disabled", mb: 1 }} />
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                {isDraggingOver ? "Drop images here" : "Drag & drop images here"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                or click to browse — supports multiple images at once
              </Typography>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={handleFileInput}
              />
            </Box>
          </FormControl>

          {/* Thumbnails grid */}
          {items.length > 0 && (
            <Box>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
                {items.length} image{items.length > 1 ? "s" : ""} selected
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "repeat(2, 1fr)",
                    sm: "repeat(3, 1fr)",
                    md: "repeat(4, 1fr)",
                  },
                  gap: 1.5,
                }}
              >
                {items.map((item) => (
                  <Paper
                    key={item.id}
                    variant="outlined"
                    sx={{ borderRadius: 2, overflow: "hidden", position: "relative" }}
                  >
                    <Box
                      component="img"
                      src={item.previewUrl}
                      alt={item.title}
                      sx={{
                        width: "100%",
                        aspectRatio: "4/3",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                    {/* Status overlay while uploading */}
                    {item.uploadStatus === "uploading" && (
                      <Box
                        sx={{
                          position: "absolute",
                          inset: 0,
                          bgcolor: "rgba(0,0,0,0.45)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <CircularProgress size={28} sx={{ color: "#fff" }} />
                      </Box>
                    )}
                    {item.uploadStatus === "error" && (
                      <Tooltip title={item.uploadError || "Upload failed"}>
                        <Box
                          sx={{
                            position: "absolute",
                            inset: 0,
                            bgcolor: "rgba(211,47,47,0.5)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <ErrorOutlineIcon sx={{ color: "#fff", fontSize: 32 }} />
                        </Box>
                      </Tooltip>
                    )}
                    {/* Remove button */}
                    {item.uploadStatus !== "uploading" && (
                      <IconButton
                        size="small"
                        onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}
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
                    )}
                    {/* Filename */}
                    <Box sx={{ p: 0.75, bgcolor: "background.paper" }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        noWrap
                        sx={{ display: "block", fontSize: "0.68rem" }}
                      >
                        {item.file.name}
                      </Typography>
                    </Box>
                  </Paper>
                ))}
              </Box>
            </Box>
          )}

          {/* Upload status bar */}
          {uploading && (
            <Box>
              <LinearProgress />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                Uploading {uploadedCount}/{items.length}…
              </Typography>
            </Box>
          )}
          {errorCount > 0 && !uploading && (
            <Alert severity="warning">
              {errorCount} image{errorCount > 1 ? "s" : ""} failed. Remove them and try again.
            </Alert>
          )}

          <Button
            variant="contained"
            size="large"
            fullWidth
            disabled={items.length === 0 || uploading}
            onClick={handleUploadAll}
            sx={{ minHeight: 48 }}
          >
            {uploading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              `Upload ${items.length > 0 ? items.length + " image" + (items.length > 1 ? "s" : "") : ""} & continue`
            )}
          </Button>
        </Stack>
      )}

      {/* ── Step 1: Name each piece ── */}
      {activeStep === 1 && (
        <Stack spacing={3}>
          <Alert severity="info" icon={false}>
            Each image will become its own gallery piece. Give each one a title and slug, then set
            shared tags in the next step.
          </Alert>

          <TextField
            label="Shared meta description (optional)"
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            fullWidth
            multiline
            rows={2}
            helperText="Applied to all pieces in this batch"
          />

          <Stack spacing={2}>
            {items.map((item, idx) => (
              <Paper key={item.id} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="flex-start">
                  <Box
                    component="img"
                    src={item.previewUrl}
                    alt={item.title}
                    sx={{
                      width: { xs: "100%", sm: 120 },
                      height: { xs: 160, sm: 90 },
                      objectFit: "cover",
                      borderRadius: 1,
                      flexShrink: 0,
                    }}
                  />
                  <Stack spacing={1.5} flex={1} width="100%">
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
                        #{idx + 1}
                      </Typography>
                      <TextField
                        label="Title"
                        value={item.title}
                        onChange={(e) => updateItemField(item.id, "title", e.target.value)}
                        fullWidth
                        required
                        size="small"
                        error={!item.title.trim()}
                      />
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="flex-start">
                      <TextField
                        label="URL slug"
                        value={item.slug}
                        onChange={(e) => updateItemField(item.id, "slug", e.target.value)}
                        onBlur={() => checkItemSlug(item.id, item.slug)}
                        helperText={item.slugError || "e.g. blue-velvet-sofa"}
                        error={!!item.slugError}
                        fullWidth
                        size="small"
                      />
                      <Tooltip title="Generate slug from title">
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => syncSlug(item.id, item.title)}
                          sx={{ minWidth: 80, flexShrink: 0, height: 40, mt: 0 }}
                        >
                          Auto
                        </Button>
                      </Tooltip>
                    </Stack>
                  </Stack>
                </Stack>
              </Paper>
            ))}
          </Stack>

          <Button variant="contained" size="large" fullWidth onClick={handleNextFromName} sx={{ minHeight: 48 }}>
            Next: Add tags →
          </Button>
        </Stack>
      )}

      {/* ── Step 2: Tags (shared for all) ── */}
      {activeStep === 2 && (
        <Stack spacing={3}>
          <Alert severity="info" icon={false}>
            These tags will be applied to <strong>all {items.length} piece{items.length > 1 ? "s" : ""}</strong> in
            this batch. You can edit each piece individually after saving.
          </Alert>

          {tagsByCategory.map(({ category, tags: catTags }) => {
            const selected = selectedTagIds[category.id] ?? [];
            const isSingle = category.selection === "single";
            return (
              <Paper
                key={category.id}
                variant="outlined"
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  borderColor:
                    category.type === "mandatory" && selected.length === 0
                      ? "error.light"
                      : "divider",
                  borderWidth:
                    category.type === "mandatory" && selected.length === 0 ? 1.5 : 1,
                }}
              >
                <Stack spacing={1.5}>
                  <Stack direction="row" alignItems="center" flexWrap="wrap" gap={1}>
                    <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                      {category.name}
                    </Typography>
                    {category.type === "mandatory" && (
                      <Chip label="Required" size="small" color="primary" variant="outlined" />
                    )}
                    <Chip
                      label={isSingle ? "Pick one" : "Pick one or more"}
                      size="small"
                      variant="outlined"
                      sx={{ fontWeight: 500 }}
                    />
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {catTags.length === 0
                      ? "No tags in this category yet. Add tags in Tag system first."
                      : isSingle
                      ? "Select one tag."
                      : "Select one or more tags."}
                  </Typography>
                  <Stack direction="row" flexWrap="wrap" gap={1} useFlexGap>
                    {catTags.map((t) => {
                      const isSelected = selected.includes(t.id);
                      return (
                        <Chip
                          key={t.id}
                          label={t.label}
                          onClick={() =>
                            handleTagChange(category.id, t.id, !isSelected, category.selection)
                          }
                          variant={isSelected ? "filled" : "outlined"}
                          color={isSelected ? "primary" : "default"}
                          sx={{
                            minHeight: 40,
                            fontWeight: 500,
                            cursor: "pointer",
                            "&:hover": { opacity: 0.9 },
                          }}
                        />
                      );
                    })}
                  </Stack>
                </Stack>
              </Paper>
            );
          })}

          <Button
            variant="contained"
            size="large"
            fullWidth
            disabled={saving}
            onClick={handleSave}
            sx={{ minHeight: 48, mt: 1 }}
          >
            {saving ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              `Save ${items.length} piece${items.length > 1 ? "s" : ""}`
            )}
          </Button>
        </Stack>
      )}

      {/* ── Step 3: Done ── */}
      {activeStep === 3 && (
        <Stack spacing={2} sx={{ py: 2 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            {saveResults.filter((r) => r.ok).length} of {saveResults.length} pieces saved
            successfully.
          </Typography>
          <Stack spacing={1}>
            {saveResults.map((r) => (
              <Stack key={r.title} direction="row" spacing={1} alignItems="center">
                {r.ok ? (
                  <CheckCircleIcon sx={{ color: "success.main", fontSize: 20 }} />
                ) : (
                  <ErrorOutlineIcon sx={{ color: "error.main", fontSize: 20 }} />
                )}
                <Typography variant="body2">
                  <strong>{r.title}</strong>
                  {!r.ok && r.msg && (
                    <Typography component="span" variant="caption" color="error.main" sx={{ ml: 1 }}>
                      — {r.msg}
                    </Typography>
                  )}
                </Typography>
              </Stack>
            ))}
          </Stack>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Button variant="contained" onClick={resetForm} sx={{ minHeight: 44 }}>
              Add more pieces
            </Button>
            <Button component={Link} href="/admin/pieces" variant="outlined" sx={{ minHeight: 44 }}>
              Back to gallery
            </Button>
          </Stack>
        </Stack>
      )}
    </Box>
  );
}
