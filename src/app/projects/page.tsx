import { Box } from "@mui/material";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProjectExplorerInteractive, { type PortfolioItem } from "@/components/ProjectExplorerInteractive";
import ComingSoonOverlay from "@/components/ComingSoonOverlay";
import { getUpholsteryPieces, getTags, getTagCategories } from "@/lib/firestore";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Project Explorer | JL Upholstery",
  description: "Browse our 30-year portfolio of master upholstery restorations across the Greater Toronto Area.",
};

export default async function ProjectsPage() {
  const [pieces, tags, categories] = await Promise.all([
    getUpholsteryPieces(),
    getTags(),
    getTagCategories(),
  ]);

  const pieceItems: PortfolioItem[] = pieces.map(p => ({
    id: p.id,
    type: "piece" as const,
    title: p.title,
    slug: `/projects/piece/${p.slug}`,
    primaryImage: p.publicUrl,
    beforeImages: [], 
    tagIds: p.tagIds || [],
  }));

  return (
    <Box sx={{ minHeight: "100dvh", display: "flex", flexDirection: "column", bgcolor: "#fafafa" }}>
      <Header />
      <ComingSoonOverlay />
      
      <Box component="main" sx={{ flex: 1, pointerEvents: "none", opacity: 0.5 }}>
        <ProjectExplorerInteractive 
          initialItems={pieceItems} 
          initialTags={tags} 
          initialCategories={categories} 
        />
      </Box>

      <Footer />
    </Box>
  );
}
