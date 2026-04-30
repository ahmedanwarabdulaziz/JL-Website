"use client";

import { Box, Container, Typography, Stack, Button } from "@mui/material";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import TrustBar from "@/components/TrustBar";
import { useQuotationModal } from "@/contexts/QuotationModalContext";
import ArtistrySection from "@/components/ArtistrySection";
import ProjectExplorer from "@/components/ProjectExplorer";
import RegionalReach from "@/components/RegionalReach";

const BRAND_ORANGE = "#f9c349";

export default function HomePage() {
  const { openQuotationModal } = useQuotationModal();

  return (
    <Box sx={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <Header />
      <HeroSection />
      <TrustBar />
      <ArtistrySection />
      <ProjectExplorer />
      <RegionalReach />

      {/* CTA */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: "#fdf8f4", color: "#1a1a1a", borderTop: "1px solid rgba(0,0,0,0.05)" }}>
        <Container maxWidth="md" sx={{ px: 3, textAlign: "center" }}>
          <Typography
            variant="h4"
            sx={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 600,
              color: "#1a1a1a",
              fontSize: { xs: "2rem", md: "2.5rem" },
              letterSpacing: "0.01em",
              mb: 1,
            }}
          >
            Ready to transform your space?
          </Typography>
          <Typography sx={{ color: "rgba(0,0,0,0.7)", fontSize: "1.125rem", fontFamily: "var(--font-body)", mt: 1.5, mb: 4 }}>
            Get a quotation or speak with our masterful team today.
          </Typography>
          <Button
            onClick={openQuotationModal}
            variant="contained"
            size="large"
            disableElevation
            sx={{
              minHeight: 56,
              minWidth: 200,
              bgcolor: BRAND_ORANGE,
              color: "#fff",
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              fontSize: "0.875rem",
              borderRadius: "30px",
              "&:hover": { bgcolor: "#dfb042" },
            }}
          >
            Request quotation
          </Button>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
