"use client";

import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Alert,
  InputAdornment,
  Chip,
  LinearProgress,
  Paper,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import DescriptionIcon from "@mui/icons-material/Description";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import IconButton from "@mui/material/IconButton";

const ReCAPTCHA = dynamic(() => import("react-google-recaptcha"), { ssr: false });

const BRAND_ORANGE = "#fe812b";
const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB per file
const MAX_IMAGES = 7;

type Errors = { name?: string; phone?: string; email?: string; description?: string; file?: string; robot?: string };

type SubmitPhase = "idle" | "saving" | "uploading" | "done";

export default function QuotationModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [robotChecked, setRobotChecked] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitPhase, setSubmitPhase] = useState<SubmitPhase>("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const recaptchaRef = useRef<{ getValue: () => string | null; reset: () => void } | null>(null);

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
    if (files.length > MAX_IMAGES) e.file = `Maximum ${MAX_IMAGES} images.`;
    else if (files.some((f) => f.size > MAX_FILE_SIZE)) e.file = "Each file must be under 10MB.";
    if (!RECAPTCHA_SITE_KEY && !robotChecked) e.robot = "Please confirm you're not a robot.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    if (!validate()) return;

    let recaptchaToken = "";
    if (RECAPTCHA_SITE_KEY && recaptchaRef.current) {
      recaptchaToken = recaptchaRef.current.getValue() ?? "";
      if (!recaptchaToken) {
        setErrors((prev) => ({ ...prev, robot: "Please complete the \"I'm not a robot\" check." }));
        return;
      }
    }

    setSubmitting(true);
    setSubmitPhase("saving");
    try {
      const formData = new FormData();
      formData.set("name", name.trim());
      formData.set("phone", phone.trim());
      formData.set("email", email.trim());
      formData.set("description", description.trim());
      if (recaptchaToken) formData.set("recaptchaToken", recaptchaToken);
      if (files.length === 0) formData.set("noFiles", "true");

      const res = await fetch("/api/quotation", { method: "POST", body: formData });
      const data = (await res.json()) as { success?: boolean; quotationId?: string; error?: string };

      if (!res.ok) {
        setSubmitError(data.error ?? "Something went wrong. Please try again.");
        setSubmitPhase("idle");
        return;
      }

      const quotationId = data.quotationId;
      if (!quotationId) {
        setSubmitError("Invalid response from server. Please try again.");
        setSubmitPhase("idle");
        return;
      }

      const totalFiles = files.length;
      if (totalFiles === 0) {
        setSubmitPhase("done");
        setSuccess(true);
        setTimeout(() => handleClose(), 2500);
        return;
      }

      setSubmitPhase("uploading");
      setUploadProgress(0);

      const uploadForm = new FormData();
      uploadForm.set("quotationId", quotationId);
      uploadForm.set("name", name.trim());
      uploadForm.set("phone", phone.trim());
      uploadForm.set("email", email.trim());
      uploadForm.set("description", description.trim());
      files.forEach((f) => uploadForm.append("files", f));

      const UPLOAD_TIMEOUT_MS = 120000;
      const FALLBACK_INTERVAL_MS = 400;
      const FALLBACK_MAX = 85;

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        let fallbackProgress = 0;
        const fallbackTimer = setInterval(() => {
          if (fallbackProgress < FALLBACK_MAX) {
            fallbackProgress = Math.min(FALLBACK_MAX, fallbackProgress + 2);
            setUploadProgress((p) => (p >= 100 ? p : Math.max(p, fallbackProgress)));
          }
        }, FALLBACK_INTERVAL_MS);

        const cleanup = () => {
          clearInterval(fallbackTimer);
          clearTimeout(timeoutId);
        };

        const timeoutId = setTimeout(() => {
          cleanup();
          xhr.abort();
          reject(new Error("Upload is taking too long. Please check your connection and try again."));
        }, UPLOAD_TIMEOUT_MS);

        xhr.upload.addEventListener("progress", (ev) => {
          if (ev.lengthComputable && ev.total > 0) {
            setUploadProgress(Math.round((ev.loaded / ev.total) * 100));
          }
        });
        xhr.addEventListener("load", () => {
          cleanup();
          if (xhr.status >= 200 && xhr.status < 300) resolve();
          else reject(new Error((JSON.parse(xhr.responseText || "{}") as { error?: string }).error ?? "Upload failed"));
        });
        xhr.addEventListener("error", () => {
          cleanup();
          reject(new Error("Network error. Please check your connection and try again."));
        });
        xhr.addEventListener("abort", () => {
          cleanup();
          reject(new Error("Upload was cancelled or timed out."));
        });
        xhr.open("POST", "/api/quotation/upload");
        xhr.send(uploadForm);
      }).then(
        () => {
          setUploadProgress(100);
          setSubmitPhase("done");
          setSuccess(true);
          setTimeout(() => handleClose(), 2500);
        },
        (err: Error) => {
          setSubmitError(err?.message ?? "Failed to upload photos. Please try again.");
          setSubmitPhase("idle");
        }
      );
    } catch {
      setSubmitError("Network error. Please try again.");
      setSubmitPhase("idle");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (submitting) return;
    setName("");
    setPhone("");
    setEmail("");
    setDescription("");
    setFiles([]);
    setRobotChecked(false);
    setErrors({});
    setSuccess(false);
    setSubmitError("");
    setSubmitPhase("idle");
    setUploadProgress(0);
    recaptchaRef.current?.reset();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: "0 24px 48px rgba(0,0,0,0.12)",
          overflow: "hidden",
        },
      }}
      sx={{ "& .MuiBackdrop-root": { bgcolor: "rgba(0,0,0,0.5)" } }}
    >
      <Box sx={{ borderTop: "4px solid", borderColor: BRAND_ORANGE }} />
      <DialogTitle sx={{ pb: 0, pt: 2, px: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 600, color: "#1a1a1a" }}>
            Request a quotation
          </Typography>
          <IconButton aria-label="Close" onClick={handleClose} size="small" sx={{ color: "text.secondary" }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ px: 3, pt: 2, pb: 1 }}>
        {success ? (
          <Alert severity="success" sx={{ mt: 1 }}>
            Thank you! We&apos;ve received your request and sent a confirmation to your email. We&apos;ll get back to you soon.
          </Alert>
        ) : submitPhase === "saving" || submitPhase === "uploading" ? (
          <Paper variant="outlined" sx={{ p: 3, mt: 1, borderRadius: 2, textAlign: "center" }}>
            {submitPhase === "saving" ? (
              <>
                <CircularProgress size={40} sx={{ color: BRAND_ORANGE, mb: 2 }} />
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Sending your request...
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  One moment.
                </Typography>
              </>
            ) : (
              <>
                <CloudUploadIcon sx={{ fontSize: 48, color: BRAND_ORANGE, mb: 2 }} />
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Uploading your photos
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {files.length} photo{files.length !== 1 ? "s" : ""}
                  {uploadProgress > 0 ? ` · ${uploadProgress}%` : " · Please wait…"}
                </Typography>
                <LinearProgress
                  variant={uploadProgress > 0 ? "determinate" : "indeterminate"}
                  value={uploadProgress}
                  sx={{ height: 8, borderRadius: 4, bgcolor: "action.hover", "& .MuiLinearProgress-bar": { borderRadius: 4, bgcolor: BRAND_ORANGE } }}
                />
              </>
            )}
          </Paper>
        ) : (
          <Box component="form" id="quotation-form" onSubmit={handleSubmit} noValidate>
            {submitError && (
              <Alert severity="error" onClose={() => setSubmitError("")} sx={{ mb: 2 }}>
                {submitError}
              </Alert>
            )}
            <TextField
              fullWidth
              label="Name"
              value={name}
              onChange={(e) => { setName(e.target.value); setErrors((e) => ({ ...e, name: undefined })); }}
              error={!!errors.name}
              helperText={errors.name}
              required
              margin="normal"
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: "action.active" }} /></InputAdornment> } }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
            />
            <TextField
              fullWidth
              label="Phone"
              value={phone}
              onChange={(e) => { setPhone(e.target.value); setErrors((e) => ({ ...e, phone: undefined })); }}
              error={!!errors.phone}
              helperText={errors.phone}
              required
              margin="normal"
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><PhoneIcon sx={{ color: "action.active" }} /></InputAdornment> } }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors((e) => ({ ...e, email: undefined })); }}
              error={!!errors.email}
              helperText={errors.email}
              required
              margin="normal"
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><EmailIcon sx={{ color: "action.active" }} /></InputAdornment> } }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
            />
            <TextField
              fullWidth
              label="Brief description"
              value={description}
              onChange={(e) => { setDescription(e.target.value); setErrors((e) => ({ ...e, description: undefined })); }}
              error={!!errors.description}
              helperText={errors.description}
              required
              multiline
              rows={4}
              margin="normal"
              placeholder="Describe your project or what you need..."
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><DescriptionIcon sx={{ color: "action.active" }} /></InputAdornment> } }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5, alignItems: "flex-start" } }}
            />
            <Box sx={{ mt: 2, mb: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Attach up to {MAX_IMAGES} photos (optional, max 10MB each). On mobile you can take a photo.
              </Typography>
              <Button
                component="label"
                variant="outlined"
                startIcon={<AttachFileIcon />}
                disabled={files.length >= MAX_IMAGES}
                sx={{ borderRadius: 1.5, borderColor: "divider", color: "text.secondary" }}
              >
                Add photos ({files.length}/{MAX_IMAGES})
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const list = Array.from(e.target.files ?? []);
                    setFiles((prev) => {
                      const next = [...prev, ...list].slice(0, MAX_IMAGES);
                      return next;
                    });
                    setErrors((prev) => ({ ...prev, file: undefined }));
                    e.target.value = "";
                  }}
                />
              </Button>
              {files.length > 0 && (
                <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {files.map((f, i) => (
                    <Chip
                      key={`${f.name}-${i}`}
                      size="small"
                      label={f.name}
                      onDelete={() => setFiles((prev) => prev.filter((_, j) => j !== i))}
                      sx={{ maxWidth: 180 }}
                    />
                  ))}
                </Box>
              )}
              {errors.file && <Typography variant="caption" color="error" sx={{ display: "block", mt: 0.5 }}>{errors.file}</Typography>}
            </Box>
            {RECAPTCHA_SITE_KEY ? (
              <Box sx={{ mt: 2, "& .grecaptcha-badge": { visibility: "visible" } }}>
                <ReCAPTCHA ref={recaptchaRef} sitekey={RECAPTCHA_SITE_KEY} theme="light" onChange={() => setErrors((e) => ({ ...e, robot: undefined }))} />
                {errors.robot && <Typography variant="caption" color="error" sx={{ display: "block", mt: 0.5 }}>{errors.robot}</Typography>}
              </Box>
            ) : (
              <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 1 }}>
                <input
                  type="checkbox"
                  id="robot-check"
                  checked={robotChecked}
                  onChange={(e) => { setRobotChecked(e.target.checked); setErrors((e) => ({ ...e, robot: undefined })); }}
                  style={{ width: 18, height: 18, accentColor: BRAND_ORANGE }}
                />
                <label htmlFor="robot-check" style={{ cursor: "pointer", fontSize: 14, color: "rgba(0,0,0,0.7)" }}>
                  I&apos;m not a robot
                </label>
                {errors.robot && <Typography variant="caption" color="error" sx={{ ml: 1 }}>{errors.robot}</Typography>}
              </Box>
            )}
          </Box>
        )}
      </DialogContent>
      {!success && (
        <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
          <Button onClick={handleClose} disabled={submitting} sx={{ color: "text.secondary" }}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="quotation-form"
            variant="contained"
            disabled={submitting}
            sx={{
              bgcolor: BRAND_ORANGE,
              "&:hover": { bgcolor: "#e67324" },
              minWidth: 120,
            }}
          >
            {submitting ? <CircularProgress size={24} color="inherit" /> : "Send request"}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}
