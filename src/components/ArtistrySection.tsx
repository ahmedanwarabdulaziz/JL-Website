"use client";

import { Box, Container, Stack, Typography } from "@mui/material";

const IMAGE_URL = "https://images.unsplash.com/photo-1581428585489-3ea5951509a2?q=80&w=2574&auto=format&fit=crop"; 

export default function ArtistrySection() {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 10, lg: 12 },
        bgcolor: "#fff",
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 3, sm: 4, md: 6 } }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 6, md: 8, lg: 10 }}
          alignItems="center"
        >
          {/* Text Content */}
          <Box sx={{ flex: 1, order: { xs: 2, md: 1 } }}>
            <Typography
              component="h2"
              sx={{
                fontFamily: "var(--font-heading)",
                fontWeight: 600,
                color: "#1a1a1a",
                fontSize: { xs: "2.25rem", sm: "2.75rem", md: "3.25rem" },
                letterSpacing: "0.01em",
                lineHeight: 1.15,
                mb: 4,
              }}
            >
              Artistry Driven by <span style={{ color: "var(--brand-orange)", fontStyle: "italic" }}>Expertise</span>
            </Typography>

            <Typography
              sx={{
                color: "text.secondary",
                fontSize: { xs: "1rem", sm: "1.0625rem", md: "1.125rem" },
                lineHeight: 1.8,
                letterSpacing: "0.01em",
                fontFamily: "var(--font-body)",
                mb: 3,
                fontWeight: 400,
              }}
            >
              At JL Upholstery, the value we bring is more than skin deep. Every project in our workshop is guided by a specialized &quot;mind for the art&quot;—led by Ahmed, whose background ensures that every aesthetic transformation is supported by master-level structural integrity.
            </Typography>

            <Typography
              sx={{
                color: "text.secondary",
                fontSize: { xs: "1rem", sm: "1.0625rem", md: "1.125rem" },
                lineHeight: 1.8,
                letterSpacing: "0.01em",
                fontFamily: "var(--font-body)",
                fontWeight: 400,
              }}
            >
              We don&apos;t just re-cover; we re-engineer for longevity. By combining 30 years of family tradition with a technical eye for detail, we ensure your furniture remains a beautiful, functional centerpiece for the next generation.
            </Typography>
          </Box>

          {/* Image Content */}
          <Box sx={{ flex: 1, order: { xs: 1, md: 2 }, width: "100%" }}>
            <Box
              sx={{
                position: "relative",
                width: "100%",
                paddingTop: "120%", // 5:6 aspect ratio
                borderRadius: "2px",
                overflow: "hidden",
                boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `url('${IMAGE_URL}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    inset: 0,
                    background: "rgba(0,0,0,0.05)",
                  }
                }}
              />
            </Box>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
