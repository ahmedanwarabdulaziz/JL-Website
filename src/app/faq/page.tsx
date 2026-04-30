"use client";

import { Box, Container, Typography, Button, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useQuotationModal } from "@/contexts/QuotationModalContext";
import React from 'react';

const BRAND_ORANGE = "#f9c349";

const faqs = [
  {
    q: "Is my furniture worth upholstering?",
    a: "In most cases it will be. If it has a good frame, is constructional sturdy, has lasted for over 10 years, and is comfortable, then reupholstering is a good choice. It may also be of sentimental value or a family heirloom."
  },
  {
    q: "Is it cheaper to buy new furniture?",
    a: "You get what you pay for! Reupholster can cost as much as moderately priced new furniture. When comparing, make sure they are of similar quality and that the fabric is of a comparable quality. It is doubtful that you will find a new piece of similar quality to your old piece and if you do, the cost would be far greater than reupholstering. Beware of cheap new and sometimes offshore furniture. It is cheap because the fabric and the construction are cheap. Within a very short time you may well regret buying it."
  },
  {
    q: "Can we bring our own fabric & do you supply fabrics?",
    a: "For Quality purpose we mostly don't accept material provided by customers. We have a large selection (more than 25,000 options) of basic to highly decorative designer fabric, leather and vinyl samples from leading fabric mills."
  },
  {
    q: "What is involved in reupholstering my furniture?",
    a: "Briefly; we remove old covering. We check the frame for motion and stability and if necessary, replace worn joints or repair them. We inspect springs, webbing, etc. and replace if required. We trace, cut and sew fabric components and apply these to your frame. We add finishing trims and finally the finished product is inspected for quality and workmanship. If any additional costs are incurred, you will be notified of your possible options and pricing."
  },
  {
    q: "If you find broken framework, do you repair it?",
    a: "Yes. Not only does the frame give support to the inner parts of a chair and covering, but to the person sitting on it. A broken frame can cause injury to the person sitting on the chair. It is important that the frame is structurally sound. Before any upholstery work is done, we check the frame very carefully and notify you if a repair is needed."
  },
  {
    q: "Do you do in-site upholstery visits?",
    a: "No, we do not. Currently, we do not plan to add this service in the future. All work is done on-site at our workshop. This means you will need to either drop off your items to us, or book in our curbside delivery services for a fee."
  },
  {
    q: "Is your shop open to the public?",
    a: "Our work by appointment only, we do offer a curbside pickup and drop off service, and we continue to offer our exceptional products and customer service."
  },
  {
    q: "Do you hold spots for your clients in your schedule?",
    a: "All spots are only held when a deposit is made."
  },
  {
    q: "What is your return policy?",
    a: "Once completed furniture leaves our workshop the sale is final. As we do 100% custom and unique work this must be a rule for our business. We ask everyone to inspect items when picking up, as that is the time to ask questions. If a client would like a change made, or additional work completed, this will be done with a new estimate."
  },
  {
    q: "Do you offer pickup & delivery services?",
    a: "Yes, we do it for very reasonable rates."
  },
  {
    q: "Do you give quotes over the phone?",
    a: "No. We cannot give you a quote over the phone. Unless we look at the piece/pieces. Get in touch to get a free quote."
  },
  {
    q: "Do you change foam or down filling?",
    a: "If your cushions are removable and have a zipper, we can change it for you. We provide top quality, high density, commercial grade foam & down filled cushions. Dacron wrap is a fibre wrap also used to bring back the new look and comfort of an older cushion."
  }
];

export default function FAQPage() {
  const { openQuotationModal } = useQuotationModal();

  return (
    <Box sx={{ minHeight: "100dvh", display: "flex", flexDirection: "column", bgcolor: "#fff" }}>
      <Header />
      
      {/* Hero Section */}
      <Box
        component="section"
        sx={{
          position: "relative",
          height: { xs: "auto", md: "60vh" },
          minHeight: { xs: 450, md: 450 },
          py: { xs: 12, md: 0 },
          display: "flex",
          alignItems: "center",
          color: "#fff",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=2000&auto=format&fit=crop)`, // Cozy interior / study
            backgroundSize: "cover",
            backgroundPosition: "center",
            animation: "kenburns 20s infinite alternate ease-in-out",
            "@keyframes kenburns": {
              "0%": { transform: "scale(1)" },
              "100%": { transform: "scale(1.05)" },
            },
          }}
        />

        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 60%, rgba(0,0,0,0.2) 100%)",
          }}
        />
        
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
              Knowledge Base
            </Typography>

            <Typography
              component="h1"
              sx={{
                fontFamily: "var(--font-heading)",
                fontWeight: 700,
                fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.5rem" },
                lineHeight: { xs: 1.15, md: 1.1 },
                letterSpacing: "-0.02em",
                mb: 3,
                textShadow: "0 2px 20px rgba(0,0,0,0.5)",
              }}
            >
              Frequently Asked <span style={{ color: BRAND_ORANGE, fontStyle: "italic", fontWeight: 600 }}>Questions</span>
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: "1rem", md: "1.25rem" },
                fontWeight: 500,
                color: "#fff",
                lineHeight: { xs: 1.5, md: 1.4 },
                mb: 0,
                fontFamily: "var(--font-heading)",
                borderLeft: `4px solid ${BRAND_ORANGE}`,
                pl: { xs: 2, md: 3 },
                py: 0.5,
                textShadow: "0 1px 10px rgba(0,0,0,0.5)",
              }}
            >
              We have the answers. Learn more about our process, materials, policies, and what you can expect when choosing JL Upholstery.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Accordion List */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: "#fff", flex: 1 }}>
        <Container maxWidth="md">
          <Box sx={{ mb: { xs: 8, md: 10 } }}>
            {faqs.map((faq, index) => (
              <Accordion 
                key={index} 
                elevation={0}
                sx={{
                  bgcolor: "transparent",
                  borderBottom: "1px solid rgba(0,0,0,0.1)",
                  "&:before": { display: "none" },
                  "&.Mui-expanded": { margin: 0 }
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: BRAND_ORANGE }} />}
                  sx={{
                    px: 0,
                    py: 1.5,
                    "& .MuiAccordionSummary-content": { my: 1.5 }
                  }}
                >
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontFamily: "var(--font-heading)", 
                      fontWeight: 600, 
                      color: "#1a1a1a",
                      fontSize: { xs: "1.125rem", md: "1.25rem" }
                    }}
                  >
                    {faq.q}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 0, pb: 4, pt: 0 }}>
                  <Typography 
                    sx={{ 
                      color: "text.secondary", 
                      fontSize: "1.0625rem", 
                      lineHeight: 1.8, 
                      fontFamily: "var(--font-body)" 
                    }}
                  >
                    {faq.a}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Global CTA Section */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: "#faf9f6", color: "#1a1a1a", borderTop: "1px solid rgba(0,0,0,0.05)" }}>
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
            Have a question we missed?
          </Typography>
          <Typography sx={{ color: "rgba(0,0,0,0.7)", fontSize: "1.125rem", fontFamily: "var(--font-body)", mt: 1.5, mb: 4 }}>
            Get in touch with us to request a quote and have all your questions answered.
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
