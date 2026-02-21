"use client";

import { Container, Typography, Box, Button } from "@mui/material";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useQuotationModal } from "@/contexts/QuotationModalContext";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";

const BRAND_ORANGE = "#fe812b";

export default function ContactPage() {
  const { openQuotationModal } = useQuotationModal();

  return (
    <Box sx={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <Header />
      <Box component="main" sx={{ flex: 1, py: 6 }}>
        <Container maxWidth="md" sx={{ px: 3 }}>
          <Typography
            component="h1"
            variant="h4"
            sx={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 600, color: "#1a1a1a", mb: 2 }}
          >
            Contact us
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Get in touch for a free quotation or to discuss your project.
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<RequestQuoteIcon />}
            onClick={openQuotationModal}
            sx={{
              bgcolor: BRAND_ORANGE,
              "&:hover": { bgcolor: "#e67324" },
              minHeight: 52,
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            Request a quotation
          </Button>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}
