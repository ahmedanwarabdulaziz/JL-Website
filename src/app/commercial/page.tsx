import { Box, Container, Typography } from "@mui/material";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CommercialHero from "@/components/CommercialHero";
import CommercialProjectExplorer from "@/components/CommercialProjectExplorer";
import CommercialIndustrySolutions from "@/components/CommercialIndustrySolutions";
import CommercialCTA from "@/components/CommercialCTA";

export const metadata = {
  title: "Commercial Services | JL Upholstery",
  description: "Exceptional upholstery value for the region's most demanding environments, from hospitality to healthcare.",
};

export default function CommercialPage() {
  return (
    <Box sx={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <Header />
      
      <main style={{ flex: 1 }}>
        <CommercialHero />
        
        <CommercialProjectExplorer />

        <CommercialIndustrySolutions />

        <CommercialCTA />
      </main>

      <Footer />
    </Box>
  );
}
