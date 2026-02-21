"use client";

import { useEffect, useState, useCallback } from "react";
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
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Radio,
  RadioGroup,
  Checkbox,
  Alert,
  Stack,
  useTheme,
  useMediaQuery,
} from "@mui/material";
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

export default function NewPiecePage() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const router = useRouter();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [storageKey, setStorageKey] = useState("");
  const [publicUrl, setPublicUrl] = useState("");

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [slugError, setSlugError] = useState("");

  const [categories, setCategories] = useState<TagCategory[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<Record<string, string[]>>({});
  const [tagValidationErrors, setTagValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    if (authLoading) return;
    if (!user || !isAdmin) {
      router.replace("/login");
      return;
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setError("");
    if (f && f.type.startsWith("image/")) {
      setFile(f);
      setPreviewUrl(URL.createObjectURL(f));
    } else if (f) {
      setError("Please choose an image file.");
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setStorageKey(data.storageKey);
      setPublicUrl(data.publicUrl);
      setActiveStep(1);
      if (!title) setTitle(file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "));
      if (!slug) setSlug(slugify(file.name.replace(/\.[^.]+$/, "")));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const syncSlugFromTitle = () => {
    const s = slugify(title);
    setSlug(s);
  };

  const checkSlug = async () => {
    if (!slug.trim()) {
      setSlugError("Slug is required");
      return;
    }
    const exists = await slugExists(slug.trim());
    setSlugError(exists ? "This URL is already used" : "");
  };

  const handleNextFromName = () => {
    setError("");
    setSlugError("");
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    const s = (slug.trim() || slugify(title)).trim();
    setSlug(s);
    slugExists(s).then((exists) => {
      if (exists) setSlugError("This URL is already used");
      else setActiveStep(2);
    });
  };

  const tagsByCategory = categories.map((c) => ({
    category: c,
    tags: tags.filter((t) => t.categoryId === c.id),
  }));

  const handleTagChange = (categoryId: string, tagId: string, selected: boolean, selection: "single" | "multiple") => {
    setSelectedTagIds((prev) => {
      const current = prev[categoryId] ?? [];
      if (selection === "single") {
        return { ...prev, [categoryId]: selected ? [tagId] : [] };
      }
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

  const handleSave = async () => {
    if (!validateTags()) return;
    const s = slug.trim() || slugify(title);
    const exists = await slugExists(s);
    if (exists) {
      setSlugError("This URL is already used");
      return;
    }
    setError("");
    setSaving(true);
    try {
      const allTagIds = Object.values(selectedTagIds).flat();
      await createUpholsteryPiece({
        title: title.trim(),
        slug: s,
        metaDescription: metaDescription.trim() || undefined,
        storageKey,
        publicUrl,
        tagIds: allTagIds,
        createdBy: user?.uid,
      });
      setActiveStep(3);
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

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
      <Typography
        component="h1"
        variant="h5"
        fontWeight={600}
        sx={{ fontSize: { xs: "1.25rem", md: "1.5rem" } }}
      >
        Add piece
      </Typography>

      <Stepper
        activeStep={activeStep}
        sx={{ pt: 0, pb: 2 }}
        alternativeLabel={!isDesktop}
      >
          {STEPS.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && <Alert severity="error" onClose={() => setError("")}>{error}</Alert>}
        {slugError && <Alert severity="warning">{slugError}</Alert>}
        {tagValidationErrors.length > 0 && (
          <Alert severity="warning">
            {tagValidationErrors.map((e) => (
              <div key={e}>{e}</div>
            ))}
          </Alert>
        )}

        {/* Step 0: Upload */}
        {activeStep === 0 && (
          <Stack spacing={2}>
            <FormControl fullWidth>
              <FormLabel>Image</FormLabel>
              <Button
                component="label"
                variant="outlined"
                fullWidth
                sx={{ minHeight: 52, mt: 0.5 }}
              >
                Choose image
                <input type="file" accept="image/*" hidden onChange={handleFileChange} />
              </Button>
            </FormControl>
            {previewUrl && (
              <Box sx={{ textAlign: "center" }}>
                <Box
                  component="img"
                  src={previewUrl}
                  alt="Preview"
                  sx={{ maxWidth: "100%", maxHeight: 240, objectFit: "contain", borderRadius: 1 }}
                />
              </Box>
            )}
            <Button
              variant="contained"
              size="large"
              fullWidth
              disabled={!file || uploading}
              onClick={handleUpload}
              sx={{ minHeight: 48 }}
            >
              {uploading ? <CircularProgress size={24} color="inherit" /> : "Upload & continue"}
            </Button>
          </Stack>
        )}

        {/* Step 1: Name */}
        {activeStep === 1 && (
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
              helperText="Used in the page URL (e.g. /upholstery/blue-velvet-sofa)"
              fullWidth
              slotProps={{ input: { style: { minHeight: 44 } } }}
            />
            <Button variant="outlined" size="small" onClick={syncSlugFromTitle} sx={{ alignSelf: "flex-start" }}>
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
            <Button variant="contained" size="large" fullWidth onClick={handleNextFromName} sx={{ minHeight: 48 }}>
              Next: Add tags
            </Button>
          </Stack>
        )}

        {/* Step 2: Tags */}
        {activeStep === 2 && (
          <Stack spacing={3}>
            {tagsByCategory.map(({ category, tags: catTags }) => (
              <FormControl key={category.id} component="fieldset" required={category.type === "mandatory"}>
                <FormLabel component="legend">
                  {category.name} {category.type === "mandatory" && "*"}
                </FormLabel>
                {category.selection === "single" ? (
                  <RadioGroup
                    value={(selectedTagIds[category.id] ?? [])[0] ?? ""}
                    onChange={(_, v) => handleTagChange(category.id, v, true, "single")}
                    sx={{ flexDirection: "row", flexWrap: "wrap", gap: 0.5 }}
                  >
                    {catTags.map((t) => (
                      <FormControlLabel
                        key={t.id}
                        value={t.id}
                        control={<Radio />}
                        label={t.label}
                        sx={{ minHeight: 44 }}
                      />
                    ))}
                  </RadioGroup>
                ) : (
                  <FormGroup row sx={{ gap: 0.5 }}>
                    {catTags.map((t) => (
                      <FormControlLabel
                        key={t.id}
                        control={
                          <Checkbox
                            checked={(selectedTagIds[category.id] ?? []).includes(t.id)}
                            onChange={(e) => handleTagChange(category.id, t.id, e.target.checked, "multiple")}
                          />
                        }
                        label={t.label}
                        sx={{ minHeight: 44 }}
                      />
                    ))}
                  </FormGroup>
                )}
              </FormControl>
            ))}
            <Button
              variant="contained"
              size="large"
              fullWidth
              disabled={saving}
              onClick={handleSave}
              sx={{ minHeight: 48 }}
            >
              {saving ? <CircularProgress size={24} color="inherit" /> : "Save piece"}
            </Button>
          </Stack>
        )}

        {/* Step 3: Done */}
        {activeStep === 3 && (
          <Stack spacing={2} sx={{ py: 2 }}>
            <Typography color="text.secondary">Piece saved. You can add another or go back to admin.</Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap">
              <Button component={Link} href="/admin/pieces/new" variant="contained" sx={{ minHeight: 44 }}>
                Add another
              </Button>
              <Button component={Link} href="/admin" variant="outlined" sx={{ minHeight: 44 }}>
                Back to admin
              </Button>
            </Stack>
          </Stack>
        )}
    </Box>
  );
}
