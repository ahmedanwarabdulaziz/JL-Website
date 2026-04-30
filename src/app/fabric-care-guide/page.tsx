"use client";

import { Box, Container, Typography, Grid, Stack, Button, Card, CardContent, Divider } from "@mui/material";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import CleanHandsOutlinedIcon from '@mui/icons-material/CleanHandsOutlined';
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined';
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import { useQuotationModal } from "@/contexts/QuotationModalContext";
import React from 'react';

const BRAND_ORANGE = "#f9c349";

const careFundamentals = [
  { text: "Immediate action prevents stain penetration and setting", icon: <CleanHandsOutlinedIcon /> },
  { text: "Gentle techniques preserve protective treatments", icon: <WaterDropOutlinedIcon /> },
  { text: "Appropriate solutions maintain fabric integrity", icon: <ScienceOutlinedIcon /> },
  { text: "Thorough rinsing prevents residue buildup", icon: <ShieldOutlinedIcon /> },
  { text: "Complete drying prevents moisture-related issues", icon: <VerifiedUserOutlinedIcon /> }
];

const brandTechnologies = [
  {
    title: "Crypton",
    desc: "Crypton represents the pinnacle of fabric protection with its patented barrier system that's built into the fabric during manufacturing. This comprehensive treatment provides unmatched resistance against liquids, bacteria, odors, and stains while remaining completely invisible. The protection cannot wash out or wear away, making it perfect for healthcare, hospitality, and family environments."
  },
  {
    title: "Alta",
    desc: "Alta uses water-based, high-performance technology to repel water and oil-based stains. Alta's finishes are tailored to a variety of specific environments including residential, workplace, hospitality, healthcare and more. Alta's permanent technology can endure spot cleaning, commercial laundering and dry cleaning."
  },
  {
    title: "Fibreguard",
    desc: "Fibreguard creates molecular-level protection around individual fabric fibers, forming an invisible barrier that repels stains while maintaining the fabric's original texture and breathability. This advanced treatment enhances soil release properties, making cleaning easier while providing long-lasting protection that withstands multiple cleaning cycles."
  },
  {
    title: "Endurepel",
    desc: "Endurepel offers two specialized formulations - Shield and Armour - designed for different performance requirements. Shield provides fluorocarbon-free protection with superior water and stain beading properties, while Armour delivers enhanced antimicrobial and anti-mildew protection for coated products. Both formulations offer exceptional moisture and odor resistance."
  }
];

export default function FabricCareGuidePage() {
  const { openQuotationModal } = useQuotationModal();

  return (
    <Box sx={{ minHeight: "100dvh", display: "flex", flexDirection: "column", bgcolor: "#fff" }}>
      <Header />
      
      {/* Hero Section */}
      <Box
        component="section"
        sx={{
          position: "relative",
          height: { xs: "auto", md: "70vh" },
          minHeight: { xs: 500, md: 500 },
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
            backgroundImage: `url(https://images.unsplash.com/photo-1581539250439-c9668bd640f8?q=80&w=2000&auto=format&fit=crop)`, // Cleaning / Fresh linen aesthetic
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
            background: "linear-gradient(to left, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.2) 100%)",
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
              ml: { md: 'auto' }, // push to right slightly to be different and elegant
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
              Cleanable Performance
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
              Fabric Care <span style={{ color: BRAND_ORANGE, fontStyle: "italic", fontWeight: 600 }}>Solutions</span>
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: "1rem", md: "1.125rem" },
                color: "rgba(255, 255, 255, 0.85)",
                mb: 0,
                lineHeight: 1.7,
                fontFamily: "var(--font-body)",
                textShadow: "0 1px 8px rgba(0,0,0,0.5)",
              }}
            >
              Understanding proper care techniques for performance fabrics ensures optimal longevity and sustained protective properties. Our comprehensive care guide addresses premier fabric treatment technologies, each engineered with distinct protective characteristics requiring specialized care protocols.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Main Content Areas */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: "#fff", flex: 1 }}>
        <Container maxWidth="lg" sx={{ px: { xs: 3, sm: 4, md: 6 } }}>
          <Stack spacing={{ xs: 8, md: 12 }}>
            
            {/* The Science & Fundamentals */}
            <Grid container spacing={8} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="h3" sx={{ fontFamily: "var(--font-heading)", fontWeight: 600, mb: 3 }}>
                  The Science Behind Performance Fabric Care
                </Typography>
                <Typography sx={{ color: "text.secondary", fontSize: "1.125rem", lineHeight: 1.8, mb: 4 }}>
                  Performance fabrics incorporate advanced treatment technologies that create protective barriers at the molecular level. These treatments provide exceptional resistance to stains, moisture, and soiling while preserving the fabric&apos;s aesthetic and tactile qualities. Proper care techniques preserve these engineered properties, ensuring your investment continues delivering superior performance.
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card elevation={0} sx={{ bgcolor: "#faf9f6", borderRadius: "16px", p: { xs: 3, md: 5 }, border: "1px solid rgba(0,0,0,0.05)" }}>
                  <Typography variant="h5" sx={{ fontFamily: "var(--font-heading)", fontWeight: 600, mb: 4 }}>
                    Essential Care Fundamentals
                  </Typography>
                  <Stack spacing={3}>
                    {careFundamentals.map((item, idx) => (
                      <Stack direction="row" spacing={2} alignItems="center" key={idx}>
                        <Box sx={{ color: BRAND_ORANGE, display: "flex" }}>{item.icon}</Box>
                        <Typography sx={{ fontFamily: "var(--font-body)", fontSize: "1.0625rem", color: "#1a1a1a" }}>
                          {item.text}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Card>
              </Grid>
            </Grid>

            <Divider />

            {/* Brands */}
            <Box>
              <Typography variant="h3" textAlign="center" sx={{ fontFamily: "var(--font-heading)", fontWeight: 600, mb: 8 }}>
                Treatment Technologies
              </Typography>
              <Grid container spacing={4}>
                {brandTechnologies.map((brand, idx) => (
                  <Grid item xs={12} md={6} key={idx}>
                    <Card 
                      elevation={0}
                      sx={{ 
                        height: "100%",
                        p: { xs: 4, md: 5 },
                        border: "1px solid rgba(0,0,0,0.08)",
                        borderRadius: "16px",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          borderColor: "rgba(249, 195, 73, 0.4)",
                          boxShadow: "0 10px 40px rgba(0,0,0,0.04)",
                        }
                      }}
                    >
                      <Typography variant="h4" sx={{ fontFamily: "var(--font-heading)", fontWeight: 600, color: BRAND_ORANGE, mb: 3 }}>
                        {brand.title}
                      </Typography>
                      <Typography sx={{ color: "text.secondary", fontSize: "1.0625rem", lineHeight: 1.8 }}>
                        {brand.desc}
                      </Typography>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
            
          </Stack>
        </Container>
      </Box>

      {/* Trust / Final Notes Section */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: "#faf9f6" }}>
        <Container maxWidth="lg" sx={{ px: { xs: 3, sm: 4, md: 6 }, textAlign: "center" }}>
          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
               <Typography variant="h5" sx={{ fontFamily: "var(--font-heading)", fontWeight: 600, mb: 2 }}>
                  Why Choose Professional Fabric Care?
               </Typography>
               <Typography sx={{ color: "text.secondary", lineHeight: 1.8, maxWidth: "500px", mx: "auto" }}>
                  Investing in proper fabric care extends the life of your performance textiles while maintaining their engineered benefits. Our comprehensive approach ensures you get maximum value from your fabric investment while preserving the advanced protection features that make these treatments exceptional.
               </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
               <Typography variant="h5" sx={{ fontFamily: "var(--font-heading)", fontWeight: 600, mb: 2 }}>
                  Expert Support Available
               </Typography>
               <Typography sx={{ color: "text.secondary", lineHeight: 1.8, maxWidth: "500px", mx: "auto" }}>
                  For complex cleaning challenges or specialized applications, our fabric care experts are available to provide personalized guidance and professional recommendations tailored to your specific needs and fabric types.
               </Typography>
            </Grid>
          </Grid>
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
