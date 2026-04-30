import { notFound } from "next/navigation";
import Link from "next/link";
import { Box, Container, Typography, Stack, Chip, Paper, Button } from "@mui/material";
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
        <Container maxWidth="md">
          <Stack spacing={2.5}>
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
                sx={{ width: "100%", maxHeight: { xs: 360, md: 520 }, objectFit: "cover", bgcolor: "action.hover" }}
              />
            </Paper>

            {piece.tagIds?.length > 0 && (
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {piece.tagIds.map((id) => (
                  <Chip key={id} label={tagIdToLabel[id] ?? id} variant="outlined" />
                ))}
              </Stack>
            )}

            <Button component={Link} href="/gallery" variant="outlined" sx={{ alignSelf: "flex-start" }}>
              Back to gallery
            </Button>
          </Stack>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}
