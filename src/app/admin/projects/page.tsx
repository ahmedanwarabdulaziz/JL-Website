"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { Project } from "@/lib/firestore";
import { deleteProject, getProjects } from "@/lib/firestore";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminProjectsPage() {
  const router = useRouter();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState(false);

  const sorted = useMemo(() => projects, [projects]);

  useEffect(() => {
    if (authLoading) return;
    if (!user || !isAdmin) {
      router.replace("/login");
      return;
    }
  }, [user, isAdmin, authLoading, router]);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const p = await getProjects();
      setProjects(p);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || !isAdmin) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isAdmin]);

  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;
    setDeleting(true);
    try {
      const keys = projectToDelete.uploadedStorageKeys ?? [];
      if (keys.length > 0) {
        const res = await fetch("/api/projects/cleanup-r2", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ keys }),
        });
        if (!res.ok) throw new Error("Failed to remove project images");
      }
      await deleteProject(projectToDelete.id);
      await load();
      setProjectToDelete(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed.");
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

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 320 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Stack spacing={2.5}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
        <Box>
          <Typography component="h1" variant="h5" fontWeight={600} sx={{ fontSize: { xs: "1.25rem", md: "1.5rem" } }}>
            Projects
          </Typography>
          <Typography color="text.secondary">
            {sorted.length} project{sorted.length !== 1 ? "s" : ""}
          </Typography>
        </Box>
        <Button component={Link} href="/admin/projects/new" variant="contained" startIcon={<AddIcon />} sx={{ minHeight: 44 }}>
          Add project
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {sorted.length === 0 ? (
        <Box sx={{ py: 6, textAlign: "center" }}>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            No projects yet.
          </Typography>
          <Button component={Link} href="/admin/projects/new" variant="contained" startIcon={<AddIcon />}>
            Add your first project
          </Button>
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
              md: "repeat(2, 1fr)",
            },
            gap: 2,
          }}
        >
          {sorted.map((p) => (
            <Card key={p.id} variant="outlined" sx={{ borderRadius: 2, overflow: "hidden", position: "relative" }}>
              <Stack direction="row" spacing={0.5} sx={{ position: "absolute", top: 8, right: 8, zIndex: 1 }}>
                <Tooltip title="Edit project">
                  <IconButton
                    component={Link}
                    href={`/admin/projects/${p.id}`}
                    size="small"
                    sx={{ bgcolor: "background.paper", boxShadow: 1, "&:hover": { bgcolor: "background.paper" } }}
                    aria-label={`Edit ${p.title}`}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete project">
                  <IconButton
                    size="small"
                    onClick={() => setProjectToDelete(p)}
                    sx={{
                      bgcolor: "background.paper",
                      boxShadow: 1,
                      color: "error.main",
                      "&:hover": { bgcolor: "background.paper" },
                    }}
                    aria-label={`Delete ${p.title}`}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>

              <CardMedia
                component="img"
                image={p.primaryImage.thumbnailUrl || p.primaryImage.publicUrl}
                alt={p.title}
                sx={{ aspectRatio: "4/3", objectFit: "cover", bgcolor: "action.hover" }}
              />
              <CardContent sx={{ py: 1.5 }}>
                <Typography fontWeight={600} noWrap title={p.title}>
                  {p.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap title={p.slug}>
                  /projects/{p.slug}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {p.pieceIds?.length ?? 0} piece{(p.pieceIds?.length ?? 0) !== 1 ? "s" : ""}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <Dialog open={projectToDelete !== null} onClose={() => !deleting && setProjectToDelete(null)}>
        <DialogTitle>Delete project?</DialogTitle>
        <DialogContent>
          <Typography>
            {projectToDelete ? `"${projectToDelete.title}" will be permanently deleted. This cannot be undone.` : ""}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 2 }}>
          <Button onClick={() => setProjectToDelete(null)} disabled={deleting}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleConfirmDelete} disabled={deleting}>
            {deleting ? <CircularProgress size={20} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}

