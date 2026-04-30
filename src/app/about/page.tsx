"use client";

import { Box, Container, Stack, Typography, Grid, Button } from "@mui/material";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DiamondOutlinedIcon from '@mui/icons-material/DiamondOutlined';
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined';
import DesignServicesOutlinedIcon from '@mui/icons-material/DesignServicesOutlined';
import { useQuotationModal } from "@/contexts/QuotationModalContext";

const BRAND_ORANGE = "#f9c349";

export default function AboutPage() {
  const { openQuotationModal } = useQuotationModal();

  return (
    <Box sx={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
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
        {/* Background Image with Parallax-like static positioning or subtle zoom */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=2000&auto=format&fit=crop)`, // Elegant furniture living room
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
            background: "linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.2) 100%)",
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
              Over 30 Years of Experience
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
              Bringing Furniture <span style={{ color: BRAND_ORANGE, fontStyle: "italic", fontWeight: 600 }}>Value</span>
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
              We believe everyone has the right to a well-furnished life. We all have memories and stories that are tied to our favorite pieces of furniture.
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
              We’re JL Upholstery, a family-owned custom upholstery company located in Milton, Ontario. We’re proud of our hand craft. Every piece of furniture is as unique as the person who requests it, so we will always work with you to find a perfect solution. Our goal is to give outstanding service and ensure the best customer experience. We look forward to working with you.
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
                Request Quotation
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Why Us Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: "#fff" }}>
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
              Why Choose Us
            </Typography>
            <Typography
              sx={{
                color: "text.secondary",
                fontSize: { xs: "1rem", sm: "1.125rem" },
                maxWidth: "800px",
                mx: "auto",
                fontFamily: "var(--font-body)",
                lineHeight: 1.8,
              }}
            >
              High Quality Custom Upholstery Services specializes in custom re-upholstery. Our mission is to remain true to the essence of each piece while incorporating and combining our creativity, passion and expertise with your vision. Give the furniture you love a second chance at life.
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 4, md: 6 }}>
            {/* Aspect 1 */}
            <Grid item xs={12} md={4}>
              <Stack alignItems="center" textAlign="center" spacing={3}>
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
                  }}
                >
                  <DiamondOutlinedIcon sx={{ fontSize: 40 }} />
                </Box>
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: "var(--font-heading)",
                      fontWeight: 600,
                      mb: 1.5,
                      color: "#1a1a1a",
                    }}
                  >
                    Aesthetically Pleasing
                  </Typography>
                  <Typography
                    sx={{
                      color: "text.secondary",
                      lineHeight: 1.7,
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    Our products are functional, aesthetically pleasing and of high quality that suit your requirements.
                  </Typography>
                </Box>
              </Stack>
            </Grid>

            {/* Aspect 2 */}
            <Grid item xs={12} md={4}>
              <Stack alignItems="center" textAlign="center" spacing={3}>
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
                  }}
                >
                  <SavingsOutlinedIcon sx={{ fontSize: 40 }} />
                </Box>
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: "var(--font-heading)",
                      fontWeight: 600,
                      mb: 1.5,
                      color: "#1a1a1a",
                    }}
                  >
                    Pocket-Friendly
                  </Typography>
                  <Typography
                    sx={{
                      color: "text.secondary",
                      lineHeight: 1.7,
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    From contemporary to traditional, we can help you find the right style at the price you can afford.
                  </Typography>
                </Box>
              </Stack>
            </Grid>

            {/* Aspect 3 */}
            <Grid item xs={12} md={4}>
              <Stack alignItems="center" textAlign="center" spacing={3}>
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
                  }}
                >
                  <DesignServicesOutlinedIcon sx={{ fontSize: 40 }} />
                </Box>
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: "var(--font-heading)",
                      fontWeight: 600,
                      mb: 1.5,
                      color: "#1a1a1a",
                    }}
                  >
                    Personalized Service
                  </Typography>
                  <Typography
                    sx={{
                      color: "text.secondary",
                      lineHeight: 1.7,
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    Our personalized solutions and attention to detail are the cornerstones of our company.
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
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
