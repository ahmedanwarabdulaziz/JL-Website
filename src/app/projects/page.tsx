import Link from "next/link";
import { Box, Container, Typography, Card, CardContent, CardMedia, Stack, Chip } from "@mui/material";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getProjects, getTags } from "@/lib/firestore";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const [projects, tags] = await Promise.all([getProjects(), getTags()]);
  const tagIdToLabel: Record<string, string> = {};
  tags.forEach((t) => (tagIdToLabel[t.id] = t.label));

  return (
    <Box sx={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <Header />
      <Box component="main" sx={{ flex: 1, py: 6 }}>
        <Container maxWidth="lg">
          <Typography component="h1" variant="h4" fontWeight={600} gutterBottom>
            Projects
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            A selection of our work.
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "repeat(1, 1fr)", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
              gap: 2,
            }}
          >
            {projects.map((p) => (
              <Card
                key={p.id}
                component={Link}
                href={`/projects/${p.slug}`}
                variant="outlined"
                sx={{ textDecoration: "none", borderRadius: 2, overflow: "hidden", "&:hover": { boxShadow: 2 } }}
              >
                <CardMedia
                  component="img"
                  image={p.primaryImage.thumbnailUrl || p.primaryImage.publicUrl}
                  alt={p.title}
                  sx={{ aspectRatio: "4/3", objectFit: "cover", bgcolor: "action.hover" }}
                />
                <CardContent>
                  <Typography fontWeight={600} noWrap title={p.title}>
                    {p.title}
                  </Typography>
                  {p.tagIds?.length > 0 && (
                    <Stack direction="row" flexWrap="wrap" gap={0.5} sx={{ mt: 1 }}>
                      {p.tagIds.slice(0, 4).map((id) => (
                        <Chip key={id} label={tagIdToLabel[id] ?? id} size="small" variant="outlined" />
                      ))}
                      {p.tagIds.length > 4 && <Chip label={`+${p.tagIds.length - 4}`} size="small" variant="outlined" />}
                    </Stack>
                  )}
                </CardContent>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}

