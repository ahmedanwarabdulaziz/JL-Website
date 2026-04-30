"use client";

import { Box, Container, Stack, Typography } from "@mui/material";

const IMAGE_URL = "/images/01.jpeg"; 

export default function ArtistrySection() {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 10, lg: 12 },
        bgcolor: "#faf9f6",
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
          <Box sx={{ flex: 1, order: { xs: 1, md: 2 }, width: "100%", position: "relative" }}>
            {/* --- Abstract Frame Pieces (Behind Image) --- */}
            
            {/* Top Right Solid Block */}
            <Box
              sx={{
                position: "absolute",
                top: { xs: "-10px", md: "-20px" },
                right: { xs: "-10px", md: "-20px" },
                width: { xs: "80px", md: "120px" },
                height: { xs: "80px", md: "120px" },
                bgcolor: "var(--brand-orange)",
                opacity: 0.15,
                zIndex: 0,
                borderRadius: "2px",
              }}
            />

            {/* Top Left Outline Block */}
            <Box
              sx={{
                position: "absolute",
                top: { xs: "-15px", md: "-30px" },
                left: { xs: "-15px", md: "-25px" },
                width: { xs: "60px", md: "90px" },
                height: { xs: "120px", md: "180px" },
                border: "2px solid var(--brand-orange)",
                opacity: 0.2,
                zIndex: 0,
                borderRadius: "2px",
              }}
            />

            {/* Bottom Left Outline Block */}
            <Box
              sx={{
                position: "absolute",
                bottom: { xs: "-15px", md: "-30px" },
                left: { xs: "-10px", md: "-20px" },
                width: { xs: "100px", md: "160px" },
                height: { xs: "80px", md: "120px" },
                border: "3px solid var(--brand-orange)",
                opacity: 0.3,
                zIndex: 0,
                borderRadius: "2px",
              }}
            />

            {/* Bottom Right Solid Block */}
            <Box
              sx={{
                position: "absolute",
                bottom: { xs: "-20px", md: "-40px" },
                right: { xs: "20px", md: "40px" },
                width: { xs: "70px", md: "100px" },
                height: { xs: "70px", md: "100px" },
                bgcolor: "var(--brand-orange)",
                opacity: 0.1,
                zIndex: 0,
                borderRadius: "2px",
              }}
            />

            {/* Middle Left Tiny Solid Accent (In front slightly) */}
            <Box
              sx={{
                display: { xs: "none", md: "block" },
                position: "absolute",
                top: "30%",
                left: "-15px",
                width: "30px",
                height: "30px",
                bgcolor: "var(--brand-orange)",
                opacity: 0.8,
                zIndex: 2,
                borderRadius: "2px",
              }}
            />

            {/* Middle Right Solid Accent (In front) */}
            <Box
              sx={{
                display: { xs: "none", md: "block" },
                position: "absolute",
                top: "60%",
                right: "-25px",
                width: "50px",
                height: "50px",
                bgcolor: "var(--brand-orange)",
                opacity: 0.9,
                zIndex: 2,
                borderRadius: "2px",
              }}
            />
            
            {/* Top Center Outline Accent */}
            <Box
              sx={{
                display: { xs: "none", md: "block" },
                position: "absolute",
                top: "-15px",
                left: "40%",
                width: "80px",
                height: "40px",
                border: "2px solid var(--brand-orange)",
                opacity: 0.4,
                zIndex: 0,
                borderRadius: "2px",
              }}
            />

            <Box
              sx={{
                position: "relative",
                width: "100%",
                paddingTop: "120%", // 5:6 aspect ratio
                borderRadius: "2px",
                overflow: "hidden",
                boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
                zIndex: 1,
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
