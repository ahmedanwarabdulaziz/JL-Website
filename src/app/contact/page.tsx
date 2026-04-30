"use client";

import { Box, Container, Typography, Grid, Stack, IconButton, Card } from "@mui/material";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import PinterestIcon from '@mui/icons-material/Pinterest';
import QuotationFormInline from "@/components/QuotationFormInline";

const BRAND_ORANGE = "#f9c349";

export default function ContactPage() {
  return (
    <Box sx={{ minHeight: "100dvh", display: "flex", flexDirection: "column", bgcolor: "#fff" }}>
      <Header />
      
      {/* Hero Section */}
      <Box
        component="section"
        sx={{
          position: "relative",
          height: { xs: "auto", md: "50vh" },
          minHeight: { xs: 400, md: 400 },
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
            backgroundImage: `url(https://images.unsplash.com/photo-1593696140826-c58b021acf8b?q=80&w=2000&auto=format&fit=crop)`, // Elegant desk/contact setting
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
              Get In Touch
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
              Contact <span style={{ color: BRAND_ORANGE, fontStyle: "italic", fontWeight: 600 }}>Us</span>
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: "1rem", md: "1.25rem" },
                fontWeight: 500,
                color: "#fff",
                lineHeight: { xs: 1.5, md: 1.4 },
                fontFamily: "var(--font-heading)",
                borderLeft: `4px solid ${BRAND_ORANGE}`,
                pl: { xs: 2, md: 3 },
                py: 0.5,
                textShadow: "0 1px 10px rgba(0,0,0,0.5)",
              }}
            >
              Have any questions? To request a free quotation or to have an answer for your questions, please fill out our contact form and we’ll get back to you as fast as we can.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Main Content Areas */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: "#fff", flex: 1 }}>
        <Container maxWidth="lg" sx={{ px: { xs: 3, sm: 4, md: 6 } }}>
          <Grid container spacing={{ xs: 8, md: 10 }}>
            
            {/* Contact Details */}
            <Grid item xs={12} md={5}>
              <Typography variant="h3" sx={{ fontFamily: "var(--font-heading)", fontWeight: 600, mb: 4 }}>
                Don&apos;t Be A Stranger
              </Typography>
              <Typography sx={{ color: "text.secondary", fontSize: "1.125rem", lineHeight: 1.8, mb: 6, fontFamily: "var(--font-body)" }}>
                We are always excited to discuss new ideas, pieces, fabrics, and projects. Here&apos;s how you can reach us directly.
              </Typography>
              
              <Stack spacing={4} sx={{ mb: 6 }}>
                <Stack direction="row" spacing={3}>
                  <Box sx={{ color: BRAND_ORANGE, mt: 0.5 }}>
                    <PhoneOutlinedIcon sx={{ fontSize: 28 }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontFamily: "var(--font-heading)", fontWeight: 600, mb: 0.5 }}>Phone</Typography>
                    <Typography component="a" href="tel:+16472614116" sx={{ color: "text.secondary", textDecoration: "none", fontSize: "1.0625rem", "&:hover": { color: BRAND_ORANGE } }}>
                      +1 647 261 4116
                    </Typography>
                  </Box>
                </Stack>
                
                <Stack direction="row" spacing={3}>
                  <Box sx={{ color: BRAND_ORANGE, mt: 0.5 }}>
                    <EmailOutlinedIcon sx={{ fontSize: 28 }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontFamily: "var(--font-heading)", fontWeight: 600, mb: 0.5 }}>Email</Typography>
                    <Typography component="a" href="mailto:jl@jlupholstery.com" sx={{ color: "text.secondary", textDecoration: "none", fontSize: "1.0625rem", "&:hover": { color: BRAND_ORANGE } }}>
                      jl@jlupholstery.com
                    </Typography>
                  </Box>
                </Stack>
                
                <Stack direction="row" spacing={3}>
                  <Box sx={{ color: BRAND_ORANGE, mt: 0.5 }}>
                    <LocationOnOutlinedIcon sx={{ fontSize: 28 }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontFamily: "var(--font-heading)", fontWeight: 600, mb: 0.5 }}>Address</Typography>
                    <Typography sx={{ color: "text.secondary", fontSize: "1.0625rem" }}>
                      Milton, Ontario
                    </Typography>
                  </Box>
                </Stack>
              </Stack>

              <Typography variant="h6" sx={{ fontFamily: "var(--font-heading)", fontWeight: 600, mb: 2 }}>Follow Us On:</Typography>
              <Stack direction="row" spacing={1}>
                <IconButton component="a" href="https://www.facebook.com/jlupholstery.ca/" target="_blank" sx={{ color: "#1a1a1a", bgcolor: "rgba(0,0,0,0.03)", "&:hover": { bgcolor: BRAND_ORANGE, color: "#fff" } }}>
                  <FacebookIcon />
                </IconButton>
                <IconButton component="a" href="https://www.instagram.com/jl_upholstery/" target="_blank" sx={{ color: "#1a1a1a", bgcolor: "rgba(0,0,0,0.03)", "&:hover": { bgcolor: BRAND_ORANGE, color: "#fff" } }}>
                  <InstagramIcon />
                </IconButton>
                <IconButton component="a" href="https://www.pinterest.ca/jlupholstery2022/" target="_blank" sx={{ color: "#1a1a1a", bgcolor: "rgba(0,0,0,0.03)", "&:hover": { bgcolor: BRAND_ORANGE, color: "#fff" } }}>
                  <PinterestIcon />
                </IconButton>
              </Stack>
            </Grid>

            {/* Contact Form */}
            <Grid item xs={12} md={7}>
              <Card elevation={0} sx={{ bgcolor: "#faf9f6", borderRadius: "16px", p: { xs: 4, sm: 6 }, border: "1px solid rgba(0,0,0,0.05)" }}>
                <Typography variant="h4" sx={{ fontFamily: "var(--font-heading)", fontWeight: 600, mb: 4, textAlign: "center" }}>
                  Send A Message
                </Typography>
                <QuotationFormInline />
              </Card>
            </Grid>

          </Grid>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
