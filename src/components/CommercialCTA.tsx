"use client";

import { Box, Container, Typography, Button, Paper } from "@mui/material";
import { useQuotationModal } from "@/contexts/QuotationModalContext";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const BRAND_ORANGE = "#fe812b";

export default function CommercialCTA() {
  const { openQuotationModal } = useQuotationModal();

  return (
    <Box component="section" sx={{ py: { xs: 8, md: 12 }, bgcolor: "#fff", position: "relative" }}>
      <Container maxWidth="md">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 8 },
            textAlign: "center",
            borderRadius: 4,
            bgcolor: "#1a1a1a",
            color: "#fff",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
          }}
        >
          {/* Subtle Background Accent */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "50%",
              height: "100%",
              background: `radial-gradient(circle at top right, rgba(254, 129, 43, 0.15) 0%, transparent 70%)`,
              pointerEvents: "none",
            }}
          />

          <Typography
            variant="overline"
            sx={{
              color: BRAND_ORANGE,
              letterSpacing: "0.15em",
              fontWeight: 700,
              display: "block",
              mb: 2,
              textTransform: "uppercase",
              position: "relative",
              zIndex: 1,
            }}
          >
            The JL Standard
          </Typography>

          <Typography
            component="h2"
            sx={{
              fontFamily: "var(--font-heading)",
              fontWeight: 600,
              fontSize: { xs: "2rem", md: "2.75rem" },
              mb: 4,
              lineHeight: 1.2,
              position: "relative",
              zIndex: 1,
            }}
          >
            Built on a Foundation of <span style={{ color: BRAND_ORANGE, fontStyle: "italic" }}>Trust.</span>
          </Typography>

          <Typography
            sx={{
              color: "rgba(255,255,255,0.8)",
              fontSize: { xs: "1rem", md: "1.125rem" },
              lineHeight: 1.8,
              fontFamily: "var(--font-body)",
              mb: 5,
              mx: "auto",
              position: "relative",
              zIndex: 1,
            }}
          >
            Every renowned commercial space is built on a foundation of trust and professional standards. Whether you are updating a boutique cafe or managing a regional healthcare facility, JL Upholstery provides the stylish, budget-friendly solutions your project deserves. With our 30-year legacy and the specialized &quot;mind for the art&quot; led by Ahmed, we ensure your commercial furniture is an asset that performs as beautifully as it looks. We handle the heavy lifting with professional pickup and delivery across the GTA, so you can focus on running your business while we restore your environment.
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "center", position: "relative", zIndex: 1 }}>
            <Button
              variant="contained"
              onClick={openQuotationModal}
              size="large"
              endIcon={<CheckCircleOutlineIcon />}
              sx={{
                bgcolor: BRAND_ORANGE,
                color: "#fff",
                py: 2,
                px: 5,
                fontSize: "1.125rem",
                fontWeight: 600,
                borderRadius: 2,
                boxShadow: "0 4px 14px rgba(254, 129, 43, 0.4)",
                "&:hover": {
                  bgcolor: "#e56a15",
                  boxShadow: "0 6px 20px rgba(254, 129, 43, 0.6)",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Start Your Commercial Quote
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
