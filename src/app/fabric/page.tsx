"use client";

import { Box, Container, Typography, Grid, Stack, Button, Card, CardContent } from "@mui/material";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ColorLensOutlinedIcon from '@mui/icons-material/ColorLensOutlined';
import WavesOutlinedIcon from '@mui/icons-material/WavesOutlined';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import HandymanOutlinedIcon from '@mui/icons-material/HandymanOutlined';
import { useQuotationModal } from "@/contexts/QuotationModalContext";
import Link from "next/link";
import React from 'react';

const BRAND_ORANGE = "#f9c349";

const fabricTypes = [
  {
    title: "Stain Resistant Fabric",
    icon: <ColorLensOutlinedIcon sx={{ fontSize: 40 }} />,
    desc: "Stain resistant fabric for all of life's crazy messes. Pets & kids friendly, those fabrics are fade-resistant, easy to clean and extremely durable making them safe for your home and the environment."
  },
  {
    title: "Extremely Durable Vinyl",
    icon: <HandymanOutlinedIcon sx={{ fontSize: 40 }} />,
    desc: "We carry heavy-duty commercial grade Vinyl with Anti-Bacterial, Mildew, Oil, Sulfide and Stain Resistant Finish & with Abrasion of 1.5-2+ Million double rubs."
  },
  {
    title: "Outdoor Fabrics",
    icon: <WbSunnyOutlinedIcon sx={{ fontSize: 40 }} />,
    desc: "Fade, Mildew and Stain resistant with a warranty that starts from 5 years to lifetime. Between 4000 options of high quality Outdoor fabrics, you will definitely find what you are looking for."
  }
];

export default function FabricPage() {
  const { openQuotationModal } = useQuotationModal();

  return (
    <Box sx={{ minHeight: "100dvh", display: "flex", flexDirection: "column", bgcolor: "#fff" }}>
      <Header />
      
      {/* Hero Section */}
      <Box
        component="section"
        sx={{
          position: "relative",
          height: { xs: "auto", md: "85vh" },
          minHeight: { xs: 600, md: 600 },
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
            backgroundImage: `url(https://images.unsplash.com/photo-1549492423-400259a2e574?q=80&w=2000&auto=format&fit=crop)`, // Elegant fabric / texture
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
            background: "linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.2) 100%)",
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
              Top Quality Material
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
              Fabric is Our <span style={{ color: BRAND_ORANGE, fontStyle: "italic", fontWeight: 600 }}>Specialty</span>
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: "1rem", md: "1.25rem" },
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
              Over 25,000 options of material available. You can book your appointment to choose the fabric once you get a quote.
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: "0.9375rem", md: "1.125rem" },
                color: "rgba(255, 255, 255, 0.85)",
                mb: 5,
                lineHeight: 1.7,
                maxWidth: 750,
                fontFamily: "var(--font-body)",
                textShadow: "0 1px 8px rgba(0,0,0,0.5)",
              }}
            >
              Whether you are looking for designer fabrics, upholstery fabric, waterproof fabric, scratch-proof vinyl fabric, or specialty marine material; we have it all. Our fabric consultants have the knowledge, creativity & experience to help you select the perfect fabrics for your needs.
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ xs: "stretch", sm: "center" }}>
              <Button
                variant="contained"
                size="large"
                onClick={openQuotationModal}
                sx={{
                  bgcolor: BRAND_ORANGE,
                  color: "#fff",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  px: { xs: 3, md: 4 },
                  py: { xs: 1.5, md: 2 },
                  fontSize: { xs: "0.875rem", md: "0.9375rem" },
                  borderRadius: "30px",
                  "&:hover": { bgcolor: "#dfb042" },
                }}
              >
                Request Your Quote Now
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Fabric Types Grid */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: "#fff", flex: 1 }}>
        <Container maxWidth="lg" sx={{ px: { xs: 3, sm: 4, md: 6 } }}>
          <Box sx={{ textAlign: "center", mb: { xs: 6, md: 8 } }}>
            <Typography
              component="h2"
              sx={{
                fontFamily: "var(--font-heading)",
                fontWeight: 600,
                color: "#1a1a1a",
                fontSize: { xs: "2rem", sm: "2.5rem" },
                letterSpacing: "0.01em",
                mb: 2,
              }}
            >
              Top Quality Categories
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {fabricTypes.map((fabric, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card 
                  elevation={0}
                  sx={{ 
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    border: "1px solid rgba(0,0,0,0.08)",
                    borderRadius: "16px",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      borderColor: "rgba(249, 195, 73, 0.4)",
                      boxShadow: "0 10px 40px rgba(0,0,0,0.04)",
                      transform: "translateY(-4px)"
                    }
                  }}
                >
                  <CardContent sx={{ p: { xs: 4, md: 5 }, flexGrow: 1, textAlign: "center" }}>
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "rgba(249, 195, 73, 0.1)",
                        color: "var(--brand-orange)",
                        mx: "auto",
                        mb: 4,
                      }}
                    >
                      {fabric.icon}
                    </Box>
                    <Typography 
                      variant="h5" 
                      component="h3" 
                      sx={{ 
                        fontFamily: "var(--font-heading)", 
                        fontWeight: 600,
                        color: "#1a1a1a",
                        mb: 2
                      }}
                    >
                      {fabric.title}
                    </Typography>
                    <Typography 
                      sx={{ 
                        color: "text.secondary", 
                        fontFamily: "var(--font-body)",
                        lineHeight: 1.7
                      }}
                    >
                      {fabric.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Fabric Care CTA/Suppliers Section */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: "#faf9f6" }}>
        <Container maxWidth="lg" sx={{ px: { xs: 3, sm: 4, md: 6 } }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={6} alignItems="center">
            <Box sx={{ flex: 1 }}>
              <Typography
                component="h2"
                sx={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: 600,
                  color: "#1a1a1a",
                  fontSize: { xs: "2rem", sm: "2.5rem" },
                  mb: 3,
                }}
              >
                Our Suppliers & Fabric Care
              </Typography>
              <Typography
                sx={{
                  color: "text.secondary",
                  fontSize: "1.125rem",
                  fontFamily: "var(--font-body)",
                  lineHeight: 1.8,
                  mb: 4,
                }}
              >
                To make your online fabric selection experience easier, we separated our fabric suppliers based on price range into Regular & Premium. Feel free to browse through our selected Material suppliers. Additionally, explore our specialized Fabric Care Guide for maintaining performance fabrics.
              </Typography>
              <Button
                component={Link}
                href="/fabric-care-guide"
                variant="outlined"
                size="large"
                sx={{
                  minHeight: 56,
                  color: "#1a1a1a",
                  borderColor: "rgba(0,0,0,0.1)",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  fontSize: "0.875rem",
                  borderRadius: "30px",
                  "&:hover": { 
                    borderColor: "rgba(0,0,0,0.3)",
                    bgcolor: "transparent"
                  },
                }}
              >
                View Fabric Care Guide
              </Button>
            </Box>
            <Box sx={{ flex: 1, position: "relative" }}>
              <Box
                sx={{
                  width: "100%",
                  paddingTop: "75%",
                  backgroundImage: `url(https://images.unsplash.com/photo-1544457070-4cd773b4d71e?q=80&w=2000&auto=format&fit=crop)`, // Suppliers/Fabric swatch image
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: "16px",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                }}
              />
            </Box>
          </Stack>
        </Container>
      </Box>

      {/* Global CTA Section */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: "#fff", color: "#1a1a1a", borderTop: "1px solid rgba(0,0,0,0.05)" }}>
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
            Ready to upgrade your furniture?
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
