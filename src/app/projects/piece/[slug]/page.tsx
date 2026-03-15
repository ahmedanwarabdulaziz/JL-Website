import { notFound } from "next/navigation";
import Link from "next/link";
import { Box, Container, Typography, Stack, Chip, Paper, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getUpholsteryPieceBySlug, getTags } from "@/lib/firestore";

export const dynamic = "force-dynamic";

export default async function PieceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [piece, tags] = await Promise.all([getUpholsteryPieceBySlug(slug), getTags()]);
  if (!piece) return notFound();

  const tagIdToLabel: Record<string, string> = {};
  tags.forEach((t) => (tagIdToLabel[t.id] = t.label));

  return (
    <Box sx={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <Header />
      <Box component="main" sx={{ flex: 1, py: 6 }}>
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <Button component={Link} href="/projects" startIcon={<ArrowBackIcon />} variant="outlined" sx={{ alignSelf: "flex-start" }}>
              Back to Project Explorer
            </Button>
            
            <Typography component="h1" variant="h4" fontWeight={600}>
              {piece.title}
            </Typography>
            
            {piece.metaDescription && (
              <Typography color="text.secondary">{piece.metaDescription}</Typography>
            )}

            <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
              <Box
                component="img"
                src={piece.publicUrl}
                alt={piece.title}
                sx={{ width: "100%", maxHeight: { xs: 400, md: 600 }, objectFit: "contain", bgcolor: "action.hover" }}
              />
            </Paper>

            {piece.tagIds?.length > 0 && (
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {piece.tagIds.map((id) => (
                  <Chip key={id} label={tagIdToLabel[id] ?? id} variant="outlined" />
                ))}
              </Stack>
            )}
          </Stack>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}
