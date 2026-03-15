"use client";

import { Box, Container, Typography, Grid, Chip } from "@mui/material";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";

const AREAS_SERVED = [
  "Milton",
  "Brampton",
  "Oakville",
  "Mississauga",
  "Burlington",
  "Georgetown",
  "Guelph",
  "The Greater Toronto Area (GTA)",
];

export default function RegionalReach() {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 10, lg: 12 },
        bgcolor: "#111111", // Dark, elegant background
        color: "#fff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative background element */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "50%",
          height: "100%",
          backgroundImage: "radial-gradient(circle at top right, rgba(255,255,255,0.05) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="lg" sx={{ px: { xs: 3, sm: 4, md: 6 }, position: "relative", zIndex: 1 }}>
        <Grid container spacing={{ xs: 6, md: 10 }} alignItems="center">
          {/* Left Column: Text */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
              <LocalShippingOutlinedIcon sx={{ color: "var(--brand-orange)", fontSize: 28 }} />
              <Typography
                variant="overline"
                sx={{
                  color: "var(--brand-orange)",
                  letterSpacing: "0.15em",
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              >
                Regional Reach
              </Typography>
            </Box>

            <Typography
              component="h2"
              sx={{
                fontFamily: "var(--font-heading)",
                fontWeight: 600,
                fontSize: { xs: "2.25rem", sm: "2.75rem", md: "3rem" },
                letterSpacing: "0.01em",
                lineHeight: 1.2,
                mb: 3,
                color: "#ffffff",
              }}
            >
              Professional Logistics for a Wide <span style={{ color: "var(--brand-orange)", fontStyle: "italic" }}>Reputation.</span>
            </Typography>

            <Typography
              sx={{
                color: "rgba(255, 255, 255, 0.7)",
                fontSize: { xs: "1.0625rem", md: "1.125rem" },
                fontFamily: "var(--font-body)",
                lineHeight: 1.7,
                mb: 4,
                maxWidth: 500,
              }}
            >
              We offer competitive pickup and delivery services across the region, allowing our specialized Milton workshop to serve the most discerning clients seamlessly.
            </Typography>
            
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, p: 3, bgcolor: "rgba(255,255,255,0.03)", borderRadius: 2, border: "1px solid rgba(255,255,255,0.05)" }}>
              <LocationOnOutlinedIcon sx={{ color: "var(--brand-orange)", mt: 0.5 }} />
              <Box>
                 <Typography variant="h6" sx={{ fontFamily: "var(--font-heading)", fontWeight: 600, mb: 1 }}>
                   Headquartered in Milton
                 </Typography>
                 <Typography sx={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.9375rem", lineHeight: 1.6 }}>
                   Our master workshop is centrally located to provide efficient, safe transit for your most valuable pieces anywhere in the GTA.
                 </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Right Column: Areas Served */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: { xs: 4, sm: 5 },
                bgcolor: "rgba(255, 255, 255, 0.02)",
                borderRadius: 4,
                border: "1px solid rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(10px)",
                boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: 600,
                  mb: 3,
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                Areas We Serve
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                {AREAS_SERVED.map((area) => (
                  <Chip
                    key={area}
                    label={area}
                    icon={<LocationOnOutlinedIcon fontSize="small" />}
                    sx={{
                      bgcolor: "transparent",
                      color: "rgba(255, 255, 255, 0.8)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      borderRadius: "8px",
                      py: 2.5,
                      px: 0.5,
                      fontFamily: "var(--font-body)",
                      fontSize: "0.9375rem",
                      fontWeight: 500,
                      transition: "all 0.3s ease",
                      "& .MuiChip-icon": {
                        color: "var(--brand-orange)",
                      },
                      "&:hover": {
                        bgcolor: "rgba(255, 255, 255, 0.05)",
                        borderColor: "rgba(255, 255, 255, 0.4)",
                        transform: "translateY(-2px)",
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
