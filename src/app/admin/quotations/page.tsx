"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Chip,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import type { QuotationRequest, QuotationRequestStatus } from "@/lib/firestore";
import { getQuotationRequests, updateQuotationRequest } from "@/lib/firestore";

function formatDate(ts: { toDate?: () => Date } | null): string {
  if (!ts || typeof (ts as { toDate?: () => Date }).toDate !== "function") return "—";
  const d = (ts as { toDate: () => Date }).toDate();
  return d.toLocaleDateString(undefined, { dateStyle: "short" }) + " " + d.toLocaleTimeString(undefined, { timeStyle: "short" });
}

function getImageUrls(r: QuotationRequest): string[] {
  if (r.fileUrls?.length) return r.fileUrls;
  if (r.fileUrl) return [r.fileUrl];
  return [];
}

export default function AdminQuotationsPage() {
  const [requests, setRequests] = useState<QuotationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getQuotationRequests()
      .then((data) => {
        if (!cancelled) setRequests(data);
      })
      .catch((e) => {
        if (!cancelled) setError(e?.message ?? "Failed to load quotations.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleStatusChange = async (e: { target: { value: unknown } }, id: string) => {
    const status = e.target.value as QuotationRequestStatus;
    setUpdatingId(id);
    try {
      await updateQuotationRequest(id, { status });
      setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const selected = openId ? requests.find((r) => r.id === openId) : null;
  const imageUrls = selected ? getImageUrls(selected) : [];
  const currentImage = imageUrls[lightboxIndex] ?? null;

  const openDetail = (id: string) => {
    setOpenId(id);
    setLightboxIndex(0);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 320 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography component="h1" variant="h4" fontWeight={600} gutterBottom sx={{ fontSize: { xs: "1.35rem", md: "1.5rem" } }}>
        Quotations
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        View and manage quotation requests. Click a card to open details and images.
      </Typography>

      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {requests.length === 0 ? (
        <Paper variant="outlined" sx={{ p: 4, textAlign: "center", borderRadius: 2 }}>
          <Typography color="text.secondary">
            No quotation requests yet. Requests from the website form will appear here.
          </Typography>
        </Paper>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 2,
          }}
        >
          {requests.map((r) => {
            const urls = getImageUrls(r);
            const thumb = urls[0];
            return (
              <Card key={r.id} variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
                <CardActionArea onClick={() => openDetail(r.id)}>
                  {thumb ? (
                    <CardMedia
                      component="img"
                      image={thumb}
                      referrerPolicy="no-referrer"
                      sx={{ height: 160, bgcolor: "action.hover", objectFit: "cover" }}
                    />
                  ) : (
                    <CardMedia
                      component="div"
                      sx={{ height: 160, bgcolor: "action.hover", display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      <ImageIcon sx={{ fontSize: 56, color: "action.disabled" }} />
                    </CardMedia>
                  )}
                  <CardContent sx={{ "&:last-child": { pb: 2 } }}>
                    <Typography variant="subtitle1" fontWeight={600} noWrap>
                      {r.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {r.email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {r.phone}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }} noWrap title={r.description}>
                      {r.description || "—"}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 1.5, flexWrap: "wrap", gap: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(r.createdAt)}
                      </Typography>
                      <Chip size="small" label={r.status} sx={{ textTransform: "capitalize" }} />
                    </Box>
                  </CardContent>
                </CardActionArea>
                <Box sx={{ px: 2, pb: 2, pt: 0 }}>
                  <FormControl size="small" fullWidth disabled={updatingId === r.id}>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={r.status}
                      label="Status"
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => handleStatusChange(e, r.id)}
                    >
                      <MenuItem value="new">New</MenuItem>
                      <MenuItem value="replied">Replied</MenuItem>
                      <MenuItem value="closed">Closed</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Card>
            );
          })}
        </Box>
      )}

      <Dialog
        open={!!selected}
        onClose={() => setOpenId(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        {selected && (
          <>
            <DialogTitle>
              {selected.name} · {formatDate(selected.createdAt)}
            </DialogTitle>
            <DialogContent dividers>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Email</Typography>
                <Typography component="a" href={`mailto:${selected.email}`}>{selected.email}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Phone</Typography>
                <Typography>{selected.phone}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Description</Typography>
                <Typography>{selected.description || "—"}</Typography>
              </Box>
              {imageUrls.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>Image(s)</Typography>
                  <Box sx={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 280, bgcolor: "action.hover", borderRadius: 2, overflow: "hidden" }}>
                    <Box component="img" src={currentImage!} alt="" referrerPolicy="no-referrer" sx={{ maxWidth: "100%", maxHeight: 400, objectFit: "contain" }} />
                    {imageUrls.length > 1 && (
                      <>
                        <IconButton
                          size="large"
                          onClick={() => setLightboxIndex((i) => (i <= 0 ? imageUrls.length - 1 : i - 1))}
                          sx={{ position: "absolute", left: 8, bgcolor: "rgba(255,255,255,0.9)", "&:hover": { bgcolor: "background.paper" } }}
                        >
                          <ChevronLeft />
                        </IconButton>
                        <IconButton
                          size="large"
                          onClick={() => setLightboxIndex((i) => (i >= imageUrls.length - 1 ? 0 : i + 1))}
                          sx={{ position: "absolute", right: 8, bgcolor: "rgba(255,255,255,0.9)", "&:hover": { bgcolor: "background.paper" } }}
                        >
                          <ChevronRight />
                        </IconButton>
                        <Typography variant="caption" sx={{ position: "absolute", bottom: 8, bgcolor: "rgba(0,0,0,0.5)", color: "white", px: 1, borderRadius: 1 }}>
                          {lightboxIndex + 1} / {imageUrls.length}
                        </Typography>
                      </>
                    )}
                  </Box>
                </Box>
              )}
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
}
