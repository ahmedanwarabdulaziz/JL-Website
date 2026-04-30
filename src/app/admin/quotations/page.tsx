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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  IconButton,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Tooltip,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import EmailIcon from "@mui/icons-material/Email";
import ReplayIcon from "@mui/icons-material/Replay";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import type { QuotationRequest, QuotationRequestStatus } from "@/lib/firestore";
import { getQuotationRequests, updateQuotationRequest, deleteQuotationRequest } from "@/lib/firestore";

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

const statusColor: Record<string, "default" | "primary" | "success" | "warning" | "error"> = {
  new: "primary",
  replied: "success",
  closed: "default",
};

export default function AdminQuotationsPage() {
  const [requests, setRequests] = useState<QuotationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [resendingId, setResendingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

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

  const handleResendEmail = async (id: string) => {
    setResendingId(id);
    try {
      const res = await fetch("/api/quotation/resend-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quotationId: id }),
      });
      const data = await res.json();
      if (res.ok) {
        setRequests((prev) =>
          prev.map((r) => (r.id === id ? { ...r, emailSent: true } : r))
        );
      } else {
        setError(data.error ?? "Failed to resend email.");
      }
    } catch {
      setError("Network error. Could not resend email.");
    } finally {
      setResendingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const selectedRequest = requests.find((r) => r.id === deleteId);
      const urls = selectedRequest ? getImageUrls(selectedRequest) : [];

      if (urls.length > 0) {
        const res = await fetch("/api/quotation/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ urls }),
        });
        
        if (!res.ok) {
          const data = await res.json();
          console.error("Failed to delete images from cloud:", data.error);
          // Proceed to delete the document anyway so it doesn't get stuck
        }
      }

      await deleteQuotationRequest(deleteId);
      
      setRequests((prev) => prev.filter((r) => r.id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete quotation.");
    } finally {
      setDeleting(false);
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
        View and manage quotation requests. Click a row to open details and images.
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
        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, overflowX: "auto" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "action.hover" }}>
                <TableCell sx={{ fontWeight: 700, width: 56 }}></TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Contact</TableCell>
                <TableCell sx={{ fontWeight: 700, maxWidth: 200 }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700, minWidth: 140 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map((r) => {
                const urls = getImageUrls(r);
                const thumb = urls[0];
                return (
                  <TableRow
                    key={r.id}
                    hover
                    onClick={() => openDetail(r.id)}
                    sx={{ cursor: "pointer", "&:last-child td": { borderBottom: 0 } }}
                  >
                    {/* Thumbnail */}
                    <TableCell sx={{ pr: 0 }}>
                      {thumb ? (
                        <Avatar
                          variant="rounded"
                          src={thumb}
                          imgProps={{ referrerPolicy: "no-referrer" }}
                          sx={{ width: 40, height: 40 }}
                        />
                      ) : (
                        <Avatar variant="rounded" sx={{ width: 40, height: 40, bgcolor: "action.hover" }}>
                          <ImageIcon sx={{ color: "action.disabled", fontSize: 22 }} />
                        </Avatar>
                      )}
                    </TableCell>

                    {/* Contact Info */}
                    <TableCell>
                      <Typography variant="body2" fontWeight={600} noWrap>
                        {r.name}
                      </Typography>
                      {r.email && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <Typography variant="caption" color="text.secondary" noWrap>
                            {r.email}
                          </Typography>
                          {(r as any).emailSent === false ? (
                            <Tooltip title="Email failed to send">
                              <ErrorIcon color="error" sx={{ fontSize: 14 }} />
                            </Tooltip>
                          ) : (
                            <Tooltip title="Email sent successfully">
                              <CheckCircleIcon color="success" sx={{ fontSize: 14 }} />
                            </Tooltip>
                          )}
                        </Box>
                      )}
                      {r.phone && (
                        <Typography variant="caption" color="text.secondary" display="block" noWrap>
                          {r.phone}
                        </Typography>
                      )}
                    </TableCell>

                    {/* Description */}
                    <TableCell sx={{ maxWidth: 200 }}>
                      <Tooltip title={r.description || "—"} arrow placement="top">
                        <Typography variant="body2" noWrap>
                          {r.description || "—"}
                        </Typography>
                      </Tooltip>
                    </TableCell>

                    {/* Date */}
                    <TableCell>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {formatDate(r.createdAt)}
                      </Typography>
                    </TableCell>



                    {/* Status chip */}
                    <TableCell>
                      <FormControl size="small" sx={{ minWidth: 100 }} disabled={updatingId === r.id}>
                        <Select
                          value={r.status}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => handleStatusChange(e, r.id)}
                          sx={{ fontSize: "0.8125rem", ".MuiSelect-select": { py: 0.75 } }}
                        >
                          <MenuItem value="new">New</MenuItem>
                          <MenuItem value="replied">Replied</MenuItem>
                          <MenuItem value="closed">Closed</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>

                    {/* Actions */}
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        {(r as any).emailSent === false && (
                          <Button
                            size="small"
                            variant="outlined"
                            color="warning"
                            startIcon={resendingId === r.id ? <CircularProgress size={14} /> : <ReplayIcon />}
                            disabled={resendingId === r.id}
                            onClick={(e) => { e.stopPropagation(); handleResendEmail(r.id); }}
                            sx={{ textTransform: "none", whiteSpace: "nowrap" }}
                          >
                            Resend
                          </Button>
                        )}
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={(e) => { e.stopPropagation(); setDeleteId(r.id); }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
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
              <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="body2" color="text.secondary">Email status:</Typography>
                {(selected as any).emailSent === false ? (
                  <>
                    <Chip size="small" label="Not sent" color="error" icon={<EmailIcon />} />
                    <Button
                      size="small"
                      variant="contained"
                      color="warning"
                      startIcon={resendingId === selected.id ? <CircularProgress size={14} /> : <ReplayIcon />}
                      disabled={resendingId === selected.id}
                      onClick={() => handleResendEmail(selected.id)}
                      sx={{ textTransform: "none" }}
                    >
                      Resend Email
                    </Button>
                  </>
                ) : (
                  <Chip size="small" label="Sent" color="success" icon={<EmailIcon />} />
                )}
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

      {/* Delete confirmation dialog */}
      <Dialog
        open={!!deleteId}
        onClose={() => !deleting && setDeleteId(null)}
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle>Delete Quotation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this quotation? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteId(null)} disabled={deleting}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={16} /> : <DeleteIcon />}
          >
            {deleting ? "Deleting…" : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

