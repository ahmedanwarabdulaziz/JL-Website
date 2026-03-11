import { notFound } from "next/navigation";
import Link from "next/link";
import { Box, Container, Typography, Stack, Chip, Paper } from "@mui/material";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BeforeAfterViewer from "@/components/BeforeAfterViewer";
import { getProjectBySlug, getTags, getUpholsteryPieces } from "@/lib/firestore";

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [project, tags, pieces] = await Promise.all([getProjectBySlug(slug), getTags(), getUpholsteryPieces()]);
  if (!project) return notFound();

  const tagIdToLabel: Record<string, string> = {};
  tags.forEach((t) => (tagIdToLabel[t.id] = t.label));
  const piecesById: Record<string, { title: string; image: string; slug: string }> = {};
  pieces.forEach((p) => (piecesById[p.id] = { title: p.title, image: p.thumbnailUrl || p.publicUrl, slug: p.slug }));

  return (
    <Box sx={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <Header />
      <Box component="main" sx={{ flex: 1, py: 6 }}>
        <Container maxWidth="lg">
          <Stack spacing={2.5}>
            <Typography component="h1" variant="h4" fontWeight={600}>
              {project.title}
            </Typography>
            {project.metaDescription && (
              <Typography color="text.secondary">{project.metaDescription}</Typography>
            )}

            <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
              <Box
                component="img"
                src={project.primaryImage.publicUrl}
                alt={project.title}
                sx={{ width: "100%", maxHeight: { xs: 360, md: 520 }, objectFit: "cover", bgcolor: "action.hover" }}
              />
            </Paper>

            {project.tagIds?.length > 0 && (
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {project.tagIds.map((id) => (
                  <Chip key={id} label={tagIdToLabel[id] ?? id} variant="outlined" />
                ))}
              </Stack>
            )}

            {(project.beforeImages?.length || project.afterImages?.length) ? (
              <BeforeAfterViewer beforeImages={project.beforeImages ?? []} afterImages={project.afterImages ?? []} />
            ) : null}

            {project.pieceIds?.length > 0 && (
              <Stack spacing={1.5}>
                <Typography variant="h6" fontWeight={600}>
                  Pieces in this project
                </Typography>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(3, 1fr)", md: "repeat(4, 1fr)" },
                    gap: 2,
                  }}
                >
                  {project.pieceIds.map((id) => {
                    const p = piecesById[id];
                    if (!p) return null;
                    return (
                      <Paper
                        key={id}
                        component={Link}
                        href={`/gallery/${p.slug}`}
                        variant="outlined"
                        sx={{
                          borderRadius: 2,
                          overflow: "hidden",
                          textDecoration: "none",
                          color: "inherit",
                          transition: "box-shadow 0.2s ease",
                          "&:hover": { boxShadow: 2 },
                        }}
                      >
                        <Box
                          component="img"
                          src={p.image}
                          alt={p.title}
                          sx={{ width: "100%", aspectRatio: "4/3", objectFit: "cover" }}
                        />
                        <Box sx={{ p: 1.25 }}>
                          <Typography fontWeight={600} noWrap title={p.title}>
                            {p.title}
                          </Typography>
                        </Box>
                      </Paper>
                    );
                  })}
                </Box>
              </Stack>
            )}
          </Stack>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}

