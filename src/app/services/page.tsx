"use client";

import { Box, Container, Typography, Grid, Stack, Button, Card, CardContent } from "@mui/material";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WeekendOutlinedIcon from '@mui/icons-material/WeekendOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useQuotationModal } from "@/contexts/QuotationModalContext";
import Link from "next/link";
import React from 'react';

const BRAND_ORANGE = "#f9c349";

const services = [
  {
    num: "01",
    title: "Residential Reupholstery",
    icon: <WeekendOutlinedIcon sx={{ fontSize: 40 }} />,
    image: "/images/01.jpeg",
    items: [
      "Chairs, Sofas & Sectionals",
      "Benches & Ottomans",
      "Teak & Antique furniture",
      "Bar stools & Dining chairs",
      "Headboards and many more…"
    ],
    desc: ""
  },
  {
    num: "02",
    title: "Commercial Reupholstery",
    icon: <StorefrontOutlinedIcon sx={{ fontSize: 40 }} />,
    image: "/images/02.jpeg",
    items: [
      "Chiropractic & massage tables",
      "Dental chairs",
      "Coffee shops & restaurants",
      "Hotels and motels furniture",
      "Students apartments",
      "Malls & shopping centers",
      "Hospitals & clinics",
      "Community centers & Gyms"
    ],
    desc: ""
  },
  {
    num: "03",
    title: "Supplies",
    icon: <Inventory2OutlinedIcon sx={{ fontSize: 40 }} />,
    image: "/images/03.jpeg",
    items: [
      "Foam requests & replacements",
      "Fabric & material requests",
      "Dacron, webbing & felt",
      "Special-ordered tools"
    ],
    desc: "Contact us for your different material requests, foam orders, and more! We also offer foam replacement for your existing cushions."
  },
  {
    num: "04",
    title: "Custom",
    icon: <AutoAwesomeOutlinedIcon sx={{ fontSize: 40 }} />,
    image: "/images/04.jpeg",
    items: [
      "Pillows & accent pillows",
      "Window seat & Bench cushions",
      "Kitchen nooks cushions",
      "Trailor's cushions",
      "Outdoor cushions and pillows",
      "Wall headboards"
    ],
    desc: "From pillows to headboards, we do it all!"
  },
  {
    num: "05",
    title: "Curb Side Pickup & Delivery",
    icon: <LocalShippingOutlinedIcon sx={{ fontSize: 40 }} />,
    image: "/images/new.jpeg",
    items: [
      "Curbside pickup & delivery",
      "Reasonable rates",
    ],
    desc: "Let the Classic Touch family help you! We don't deliver any piece until we are sure you'll love it!"
  }
];

export default function ServicesPage() {
  const { openQuotationModal } = useQuotationModal();

  return (
    <Box sx={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <Header />
      
      {/* Hero Section */}
      <Box
        component="section"
        sx={{
          position: "relative",
          height: { xs: "auto", md: "80vh" },
          minHeight: { xs: 500, md: 500 },
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
            backgroundImage: `url(https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2000&auto=format&fit=crop)`,
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
              Leading Company
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
              Our Custom <br/> <span style={{ color: BRAND_ORANGE, fontStyle: "italic", fontWeight: 600 }}>Reupholstery Services</span>
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: "1rem", md: "1.375rem" },
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
              Our wonderful team has been working with and reupholstering fine furniture for the last 30 years.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Services Grid */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: "#fff", flex: 1 }}>
        <Container maxWidth="lg" sx={{ px: { xs: 3, sm: 4, md: 6 } }}>
          <Grid container spacing={4}>
            {services.map((service, index) => (
              <Grid item xs={12} md={index === 4 ? 12 : 6} lg={index === 4 ? 6 : 6} key={service.num} sx={index === 4 ? { mx: "auto" } : {}}>
                <Card 
                  elevation={0}
                  sx={{ 
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    border: "1px solid rgba(0,0,0,0.08)",
                    borderRadius: "16px",
                    transition: "all 0.3s ease",
                    position: "relative",
                    overflow: "hidden",
                    "&:hover": {
                      borderColor: "rgba(249, 195, 73, 0.4)",
                      boxShadow: "0 10px 40px rgba(0,0,0,0.04)",
                      transform: "translateY(-4px)"
                    }
                  }}
                >
                  <Box 
                    sx={{
                      height: 240,
                      width: "100%",
                      backgroundImage: `url('${service.image}')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      position: "relative",
                      borderBottom: "1px solid rgba(0,0,0,0.05)",
                    }}
                  />
                  
                  <Box 
                    sx={{
                      position: "absolute",
                      top: 140, // overlap image and content slightly
                      right: 10,
                      fontSize: "120px",
                      fontWeight: 800,
                      color: "rgba(255, 255, 255, 0.2)",
                      lineHeight: 1,
                      fontFamily: "var(--font-heading)",
                      pointerEvents: "none",
                      zIndex: 1
                    }}
                  >
                    {service.num}
                  </Box>
                  
                  <CardContent sx={{ p: { xs: 4, md: 5 }, flexGrow: 1, zIndex: 2, bgcolor: "#fff" }}>
                    <Stack direction="row" spacing={3} alignItems="center" mb={4} sx={{ position: "relative", zIndex: 3 }}>
                      <Box
                        sx={{
                          width: 64,
                          height: 64,
                          borderRadius: "12px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor: "rgba(249, 195, 73, 0.1)",
                          color: "var(--brand-orange)",
                          boxShadow: "0 4px 20px rgba(249, 195, 73, 0.2)",
                        }}
                      >
                        {service.icon}
                      </Box>
                      <Typography 
                        variant="h5" 
                        component="h2" 
                        sx={{ 
                          fontFamily: "var(--font-heading)", 
                          fontWeight: 600,
                          color: "#1a1a1a"
                        }}
                      >
                        {service.title}
                      </Typography>
                    </Stack>

                    {service.desc && (
                      <Typography 
                        sx={{ 
                          color: "text.secondary", 
                          mb: 3, 
                          fontFamily: "var(--font-body)",
                          lineHeight: 1.7
                        }}
                      >
                        {service.desc}
                      </Typography>
                    )}

                    <Box component="ul" sx={{ m: 0, p: 0, listStyle: "none" }}>
                      {service.items.map((item, i) => (
                        <Box 
                          component="li" 
                          key={i} 
                          sx={{ 
                            display: "flex", 
                            alignItems: "flex-start", 
                            mb: 1.5,
                            "&:last-child": { mb: 0 }
                          }}
                        >
                          <Box 
                            sx={{ 
                              minWidth: 20, 
                              display: "inline-block", 
                              color: "var(--brand-orange)",
                              mr: 1.5,
                              mt: 0.5
                            }}
                          >
                            <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "currentColor" }} />
                          </Box>
                          <Typography 
                            sx={{ 
                              color: "text.secondary",
                              fontFamily: "var(--font-body)",
                              lineHeight: 1.6
                            }}
                          >
                            {item}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
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
            Ready to get started?
          </Typography>
          <Typography sx={{ color: "rgba(0,0,0,0.7)", fontSize: "1.125rem", fontFamily: "var(--font-body)", mt: 1.5, mb: 4 }}>
            Contact us today for a free estimate or take a look at our work gallery.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
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
            <Button
              component={Link}
              href="/projects"
              variant="outlined"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{
                minHeight: 56,
                minWidth: 200,
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
              View Gallery
            </Button>
          </Stack>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
