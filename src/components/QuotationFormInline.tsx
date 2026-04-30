"use client";

import { useState, useRef, useCallback } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Alert,
  InputAdornment,
  LinearProgress,
  Paper,
  IconButton,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import DescriptionIcon from "@mui/icons-material/Description";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorIcon from "@mui/icons-material/Error";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ReplayIcon from "@mui/icons-material/Replay";
import { sendGAEvent } from "@next/third-parties/google";
import { compressImage } from "@/lib/image-compress";

const BRAND_ORANGE = "#f9c349";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_IMAGES = 7;

type Errors = { name?: string; phone?: string; email?: string; description?: string; file?: string };

type ImageUpload = {
  id: string;
  file: File;
  status: "compressing" | "uploading" | "done" | "error";
  progress: number;
  publicUrl?: string;
  errorMsg?: string;
};

function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

async function uploadImageDirect(
  file: File,
  sessionId: string,
  fileIndex: number,
  onProgress: (status: ImageUpload["status"], progress: number) => void
): Promise<string> {
  onProgress("compressing", 10);
  const compressed = await compressImage(file);
  onProgress("compressing", 40);

  onProgress("uploading", 50);
  const presignRes = await fetch("/api/quotation/presign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, fileIndex }),
  });
  if (!presignRes.ok) {
    const err = (await presignRes.json()) as { error?: string };
    throw new Error(err.error ?? "Failed to get upload URL");
  }
  const { uploadUrl, publicUrl } = (await presignRes.json()) as {
    uploadUrl: string;
    publicUrl: string;
  };
  onProgress("uploading", 60);

  const uploadRes = await fetch(uploadUrl, {
    method: "PUT",
    body: compressed,
    headers: { "Content-Type": "image/webp" },
  });
  if (!uploadRes.ok) {
    throw new Error("Upload to storage failed");
  }
  onProgress("done", 100);

  return publicUrl;
}

async function uploadWithRetry(
  file: File,
  sessionId: string,
  fileIndex: number,
  onProgress: (status: ImageUpload["status"], progress: number) => void
): Promise<string> {
  const delays = [0, 1500, 3000];
  let lastErr: Error | null = null;
  for (let attempt = 0; attempt < delays.length; attempt++) {
    try {
      if (attempt > 0) await new Promise((r) => setTimeout(r, delays[attempt]));
      return await uploadImageDirect(file, sessionId, fileIndex, onProgress);
    } catch (err) {
      lastErr = err instanceof Error ? err : new Error(String(err));
      onProgress("uploading", 0);
    }
  }
  throw lastErr ?? new Error("Upload failed after retries");
}

export default function QuotationFormInline() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<ImageUpload[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const sessionIdRef = useRef(generateSessionId());
  const fileIndexRef = useRef(0);

  const allImagesReady = images.length === 0 || images.every((img) => img.status === "done");
  const hasErrors = images.some((img) => img.status === "error");

  const validate = (): boolean => {
    const e: Errors = {};
    if (!name.trim()) e.name = "Name is required.";
    else if (name.trim().length < 2) e.name = "Name must be at least 2 characters.";
    if (!phone.trim()) e.phone = "Phone is required.";
    else if (!/^[\d\s\-\+\(\)]{8,20}$/.test(phone.trim())) e.phone = "Enter a valid phone number.";
    if (!email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email address.";
    if (!description.trim()) e.description = "Description is required.";
    else if (description.trim().length < 10) e.description = "Please provide at least 10 characters.";
    if (images.some((img) => img.status === "error")) e.file = "Some photos failed to upload. Please retry or remove them.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const resetForm = () => {
    setName("");
    setPhone("");
    setEmail("");
    setDescription("");
    setImages([]);
    setErrors({});
    setSubmitError("");
    setSuccess(false);
    sessionIdRef.current = generateSessionId();
    fileIndexRef.current = 0;
  };

  const startUpload = useCallback(
    (file: File) => {
      const id = `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const idx = fileIndexRef.current++;
      const entry: ImageUpload = { id, file, status: "compressing", progress: 0 };

      setImages((prev) => [...prev, entry]);

      uploadWithRetry(file, sessionIdRef.current, idx, (status, progress) => {
        setImages((prev) =>
          prev.map((img) => (img.id === id ? { ...img, status, progress } : img))
        );
      })
        .then((publicUrl) => {
          setImages((prev) =>
            prev.map((img) => (img.id === id ? { ...img, status: "done", progress: 100, publicUrl } : img))
          );
        })
        .catch((err) => {
          setImages((prev) =>
            prev.map((img) =>
              img.id === id ? { ...img, status: "error", progress: 0, errorMsg: err?.message ?? "Upload failed" } : img
            )
          );
        });
    },
    []
  );

  const retryUpload = useCallback(
    (imageId: string) => {
      setImages((prev) => {
        const target = prev.find((img) => img.id === imageId);
        if (!target) return prev;
        const idx = fileIndexRef.current++;

        uploadWithRetry(target.file, sessionIdRef.current, idx, (status, progress) => {
          setImages((p) =>
            p.map((img) => (img.id === imageId ? { ...img, status, progress } : img))
          );
        })
          .then((publicUrl) => {
            setImages((p) =>
              p.map((img) =>
                img.id === imageId ? { ...img, status: "done", progress: 100, publicUrl } : img
              )
            );
          })
          .catch((err) => {
            setImages((p) =>
              p.map((img) =>
                img.id === imageId ? { ...img, status: "error", progress: 0, errorMsg: err?.message ?? "Upload failed" } : img
              )
            );
          });

        return prev.map((img) =>
          img.id === imageId ? { ...img, status: "compressing", progress: 0, errorMsg: undefined } : img
        );
      });
    },
    []
  );

  const removeImage = useCallback((imageId: string) => {
    setImages((prev) => prev.filter((img) => img.id !== imageId));
  }, []);

  const handleFilesSelected = (fileList: FileList | null) => {
    if (!fileList) return;
    const newFiles = Array.from(fileList);
    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) return;

    const toAdd = newFiles.slice(0, remaining);
    for (const f of toAdd) {
      if (f.size > MAX_FILE_SIZE) {
        setErrors((prev) => ({ ...prev, file: `"${f.name}" exceeds 10MB.` }));
        continue;
      }
      if (!f.type.startsWith("image/")) {
        setErrors((prev) => ({ ...prev, file: `"${f.name}" is not an image.` }));
        continue;
      }
      startUpload(f);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    if (!validate()) return;

    setSubmitting(true);
    try {
      const imageUrls = images
        .filter((img) => img.status === "done" && img.publicUrl)
        .map((img) => img.publicUrl!);

      const res = await fetch("/api/quotation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          description: description.trim(),
          imageUrls,
        }),
      });
      const data = (await res.json()) as { success?: boolean; error?: string };

      if (!res.ok) {
        setSubmitError(data.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      setSuccess(true);
      sendGAEvent("event", "generate_lead", {
        lead_type: "contact_page",
        page_source: window.location.pathname,
        value: 100,
        currency: "CAD",
      });
      (window as any).clarity?.("set", "action", "submitted_contact_form");
    } catch {
      setSubmitError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Success state ── */
  if (success) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <CheckCircleOutlineIcon sx={{ fontSize: 64, color: BRAND_ORANGE, mb: 2 }} />
        <Typography variant="h6" fontWeight={700} sx={{ fontFamily: "var(--font-heading)", mb: 1 }}>
          Message Sent!
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Thank you! We&apos;ve received your request and sent a confirmation to your email. We&apos;ll get back to you soon.
        </Typography>
        <Button
          variant="outlined"
          onClick={resetForm}
          sx={{ borderColor: BRAND_ORANGE, color: BRAND_ORANGE, "&:hover": { bgcolor: BRAND_ORANGE, color: "#fff", borderColor: BRAND_ORANGE } }}
        >
          Send Another Message
        </Button>
      </Box>
    );
  }

  /* ── Idle form ── */
  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      {submitError && (
        <Alert severity="error" onClose={() => setSubmitError("")} sx={{ mb: 2 }}>
          {submitError}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Name"
        value={name}
        onChange={(e) => { setName(e.target.value); setErrors((prev) => ({ ...prev, name: undefined })); }}
        error={!!errors.name}
        helperText={errors.name}
        required
        margin="normal"
        slotProps={{ input: { startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: "action.active" }} /></InputAdornment> } }}
        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5, bgcolor: "#fff" } }}
      />
      <TextField
        fullWidth
        label="Phone"
        value={phone}
        onChange={(e) => { setPhone(e.target.value); setErrors((prev) => ({ ...prev, phone: undefined })); }}
        error={!!errors.phone}
        helperText={errors.phone}
        required
        margin="normal"
        slotProps={{ input: { startAdornment: <InputAdornment position="start"><PhoneIcon sx={{ color: "action.active" }} /></InputAdornment> } }}
        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5, bgcolor: "#fff" } }}
      />
      <TextField
        fullWidth
        label="Email"
        type="email"
        value={email}
        onChange={(e) => { setEmail(e.target.value); setErrors((prev) => ({ ...prev, email: undefined })); }}
        error={!!errors.email}
        helperText={errors.email}
        required
        margin="normal"
        slotProps={{ input: { startAdornment: <InputAdornment position="start"><EmailIcon sx={{ color: "action.active" }} /></InputAdornment> } }}
        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5, bgcolor: "#fff" } }}
      />
      <TextField
        fullWidth
        label="Brief description"
        value={description}
        onChange={(e) => { setDescription(e.target.value); setErrors((prev) => ({ ...prev, description: undefined })); }}
        error={!!errors.description}
        helperText={errors.description}
        required
        multiline
        rows={4}
        margin="normal"
        placeholder="Describe your project or what you need..."
        slotProps={{ input: { startAdornment: <InputAdornment position="start"><DescriptionIcon sx={{ color: "action.active" }} /></InputAdornment> } }}
        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5, alignItems: "flex-start", bgcolor: "#fff" } }}
      />

      {/* File attachments with upload-as-you-go */}
      <Box sx={{ mt: 2, mb: 1 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Attach up to {MAX_IMAGES} photos (optional, max 10MB each). On mobile you can take a photo.
        </Typography>
        <Button
          component="label"
          variant="outlined"
          startIcon={<AttachFileIcon />}
          disabled={images.length >= MAX_IMAGES}
          sx={{ borderRadius: 1.5, borderColor: "divider", color: "text.secondary", textTransform: "none" }}
        >
          Add photos ({images.length}/{MAX_IMAGES})
          <input
            type="file"
            hidden
            accept="image/*"
            multiple
            onChange={(e) => {
              handleFilesSelected(e.target.files);
              e.target.value = "";
            }}
          />
        </Button>

        {/* Per-image upload status */}
        {images.length > 0 && (
          <Box sx={{ mt: 1.5, display: "flex", flexDirection: "column", gap: 1 }}>
            {images.map((img) => (
              <Paper
                key={img.id}
                variant="outlined"
                sx={{
                  px: 1.5,
                  py: 1,
                  borderRadius: 1.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  borderColor:
                    img.status === "done" ? "success.main" : img.status === "error" ? "error.main" : "divider",
                }}
              >
                {img.status === "done" && <CheckCircleIcon sx={{ color: "success.main", fontSize: 20 }} />}
                {img.status === "error" && <ErrorIcon sx={{ color: "error.main", fontSize: 20 }} />}
                {(img.status === "compressing" || img.status === "uploading") && (
                  <CircularProgress size={18} sx={{ color: BRAND_ORANGE }} />
                )}

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" noWrap sx={{ fontWeight: 500 }}>
                    {img.file.name}
                  </Typography>
                  {img.status === "compressing" && (
                    <Typography variant="caption" color="text.secondary">Compressing…</Typography>
                  )}
                  {img.status === "uploading" && (
                    <LinearProgress
                      variant="determinate"
                      value={img.progress}
                      sx={{ height: 4, borderRadius: 2, mt: 0.5, "& .MuiLinearProgress-bar": { bgcolor: BRAND_ORANGE } }}
                    />
                  )}
                  {img.status === "done" && (
                    <Typography variant="caption" color="success.main">Uploaded</Typography>
                  )}
                  {img.status === "error" && (
                    <Typography variant="caption" color="error">{img.errorMsg ?? "Failed"}</Typography>
                  )}
                </Box>

                {img.status === "error" && (
                  <IconButton size="small" onClick={() => retryUpload(img.id)} sx={{ color: BRAND_ORANGE }}>
                    <ReplayIcon fontSize="small" />
                  </IconButton>
                )}
                <IconButton size="small" onClick={() => removeImage(img.id)} sx={{ color: "text.disabled" }}>
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Paper>
            ))}
          </Box>
        )}

        {errors.file && (
          <Typography variant="caption" color="error" sx={{ display: "block", mt: 0.5 }}>
            {errors.file}
          </Typography>
        )}
      </Box>

      <Button
        type="submit"
        variant="contained"
        fullWidth
        size="large"
        disabled={submitting || !allImagesReady || hasErrors}
        sx={{
          mt: 3,
          minHeight: 52,
          bgcolor: "#1a1a1a",
          color: "#fff",
          fontWeight: 600,
          letterSpacing: "0.05em",
          borderRadius: "30px",
          textTransform: "none",
          fontSize: "1rem",
          "&:hover": { bgcolor: BRAND_ORANGE, color: "#fff" },
        }}
      >
        {submitting ? (
          <CircularProgress size={24} color="inherit" />
        ) : !allImagesReady ? (
          "Uploading photos…"
        ) : (
          "Send Request"
        )}
      </Button>
    </Box>
  );
}
