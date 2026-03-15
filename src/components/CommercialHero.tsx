"use client";

import { Box, Container, Typography, Stack, Button } from "@mui/material";
import Link from "next/link";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import CollectionsIcon from "@mui/icons-material/Collections";
import { useQuotationModal } from "@/contexts/QuotationModalContext";

const HERO_BG = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2000&auto=format&fit=crop";
const BRAND_ORANGE = "#fe812b";

export default function CommercialHero() {
  const { openQuotationModal } = useQuotationModal();

  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        height: { xs: "auto", md: "90vh" },
        minHeight: { xs: 600, md: 600 },
        py: { xs: 12, md: 0 },
        display: "flex",
        alignItems: "center",
        color: "#fff",
        overflow: "hidden",
      }}
    >
      {/* Background Image with Parallax-like static positioning or subtle zoom */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${HERO_BG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          animation: "kenburns 20s infinite alternate ease-in-out",
          "@keyframes kenburns": {
            "0%": { transform: "scale(1)" },
            "100%": { transform: "scale(1.05)" },
          },
        }}
      />

      {/* Overlays for readability */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.2) 100%)",
        }}
      />
      
      {/* Subtle texture overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.03' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1, px: { xs: 3, md: 6 } }}>
        <Box
          sx={{
            maxWidth: 800,
            p: { xs: 3, md: 5 },
            bgcolor: "rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(12px)",
            borderRadius: 4,
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
          }}
        >
          <Typography
            variant="overline"
            sx={{
              color: BRAND_ORANGE,
              letterSpacing: "0.2em",
              fontWeight: 700,
              display: "block",
              mb: 2,
              textTransform: "uppercase",
              fontSize: { xs: "0.75rem", md: "0.875rem" }
            }}
          >
            JL Upholstery Commercial
          </Typography>

          <Typography
            component="h1"
            sx={{
              fontFamily: "var(--font-heading)",
              fontWeight: 700,
              fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.5rem", lg: "5rem" },
              lineHeight: { xs: 1.15, md: 1.1 },
              letterSpacing: "-0.02em",
              mb: 3,
              textShadow: "0 2px 20px rgba(0,0,0,0.5)",
            }}
          >
            Exceptional Value for the Region’s Most <span style={{ color: BRAND_ORANGE, fontStyle: "italic", fontWeight: 600 }}>Demanding Environments.</span>
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: "1rem", md: "1.375rem" },
              fontWeight: 500,
              color: "#fff",
              lineHeight: { xs: 1.5, md: 1.4 },
              mb: 3,
              fontFamily: "var(--font-heading)",
              borderLeft: `4px solid ${BRAND_ORANGE}`,
              pl: { xs: 2, md: 3 },
              py: 0.5,
              textShadow: "0 1px 10px rgba(0,0,0,0.5)",
            }}
          >
            Are you a business owner looking to reupholster your facility with a budget-friendly, stylish approach that never compromises on quality?
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: "0.9375rem", md: "1.125rem" },
              color: "rgba(255, 255, 255, 0.85)",
              mb: 5,
              lineHeight: 1.7,
              maxWidth: 700,
              fontFamily: "var(--font-body)",
              textShadow: "0 1px 8px rgba(0,0,0,0.5)",
            }}
          >
            At JL Upholstery, we have spent 30 years building a wide reputation for excellence across the GTA. From hospitality to healthcare, we provide professional seating solutions that combine designer aesthetics with a &quot;mind for the art&quot;—ensuring your furniture is structurally engineered for high-traffic longevity.
          </Typography>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ xs: "stretch", sm: "center" }}>
            <Button
              variant="contained"
              size="large"
              onClick={openQuotationModal}
              startIcon={<RequestQuoteIcon />}
              sx={{
                bgcolor: BRAND_ORANGE,
                color: "#fff",
                fontWeight: 600,
                letterSpacing: "0.05em",
                px: { xs: 3, md: 4 },
                py: { xs: 1.5, md: 2 },
                fontSize: { xs: "0.875rem", md: "0.9375rem" },
                borderRadius: "30px",
                "&:hover": { bgcolor: "#e67324" },
              }}
            >
              Start Your Commercial Quote
            </Button>
            
            <Button
              component={Link}
              href="/gallery?category=commercial"
              variant="outlined"
              size="large"
              startIcon={<CollectionsIcon />}
              sx={{
                color: "#fff",
                borderColor: "rgba(255,255,255,0.5)",
                fontWeight: 600,
                letterSpacing: "0.05em",
                px: { xs: 3, md: 4 },
                py: { xs: 1.5, md: 2 },
                fontSize: { xs: "0.875rem", md: "0.9375rem" },
                borderRadius: "30px",
                backdropFilter: "blur(4px)",
                "&:hover": { borderColor: "#fff", bgcolor: "rgba(255,255,255,0.1)" },
              }}
            >
              Explore Regional Database
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
