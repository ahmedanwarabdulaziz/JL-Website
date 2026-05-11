"use client";

import { Box, Container, Typography, Grid, Chip } from "@mui/material";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";

const PRIMARY_CITIES = [
  "Milton",
  "Brampton",
  "Oakville",
  "Mississauga",
  "Burlington",
  "Georgetown",
  "Guelph",
  "The Greater Toronto Area (GTA)",
];

const GOOGLE_MAP_CENTER = "43.2557,-79.8711";
const GOOGLE_MAP_ZOOM = 8;

export default function RegionalReach() {
  const mapsEmbedApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY;
  const mapSrc = mapsEmbedApiKey
    ? `https://www.google.com/maps/embed/v1/view?key=${mapsEmbedApiKey}&center=${GOOGLE_MAP_CENTER}&zoom=${GOOGLE_MAP_ZOOM}&maptype=roadmap`
    : `https://www.google.com/maps?output=embed&ll=${GOOGLE_MAP_CENTER}&z=${GOOGLE_MAP_ZOOM}`;

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 6, md: 8, lg: 9 },
        bgcolor: "#111111",
        color: "#fff",
        position: "relative",
        overflow: "hidden",
      }}
    >
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
        <Grid container spacing={{ xs: 4, md: 6 }} alignItems="start">
          <Grid item xs={12} md={4.5}>
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
                fontSize: { xs: "2rem", sm: "2.35rem", md: "2.7rem" },
                letterSpacing: "0.01em",
                lineHeight: 1.2,
                mb: 2.25,
                color: "#ffffff",
              }}
            >
              Professional Logistics for a Wider <span style={{ color: "var(--brand-orange)", fontStyle: "italic" }}>Service Region.</span>
            </Typography>

            <Typography
              sx={{
                color: "rgba(255, 255, 255, 0.7)",
                fontSize: { xs: "1rem", md: "1.0625rem" },
                fontFamily: "var(--font-body)",
                lineHeight: 1.7,
                mb: 3,
                maxWidth: 480,
              }}
            >
              Our Milton workshop is positioned to support pickup and delivery across a broader regional footprint, not just a few isolated cities. This lets us present our service area clearly while leaving room for nearby communities between Niagara Falls, the GTA, and Guelph.
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 2,
                p: 2.5,
                bgcolor: "rgba(255,255,255,0.03)",
                borderRadius: 2,
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <LocationOnOutlinedIcon sx={{ color: "var(--brand-orange)", mt: 0.5 }} />
              <Box>
                <Typography variant="h6" sx={{ fontFamily: "var(--font-heading)", fontWeight: 600, mb: 1 }}>
                  Headquartered in Milton
                </Typography>
                <Typography sx={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.9375rem", lineHeight: 1.6 }}>
                  We plan routes efficiently across Halton, Peel, the GTA, Guelph, and the Niagara corridor from one central workshop.
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={7.5}>
            <Box
              sx={{
                p: { xs: 3, sm: 3.5, md: 4 },
                bgcolor: "rgba(255, 255, 255, 0.02)",
                borderRadius: 4,
                border: "1px solid rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(10px)",
                boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  justifyContent: "space-between",
                  alignItems: { xs: "flex-start", sm: "end" },
                  gap: 2,
                  mb: 2,
                }}
              >
                <Box sx={{ maxWidth: 520 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: "var(--font-heading)",
                      fontWeight: 600,
                      mb: 1,
                      color: "#ffffff",
                    }}
                  >
                    Primary Service Areas
                  </Typography>
                  <Typography
                    sx={{
                      color: "rgba(255, 255, 255, 0.65)",
                      fontSize: "0.95rem",
                      lineHeight: 1.65,
                    }}
                  >
                    Our primary service areas include the cities below, along with nearby communities across the broader Niagara-to-Guelph corridor.
                  </Typography>
                </Box>

                <Typography
                  sx={{
                    color: "rgba(255, 255, 255, 0.5)",
                    fontSize: "0.8rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                  }}
                >
                  Milton to Niagara
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1.25,
                  mb: 2,
                }}
              >
                {PRIMARY_CITIES.map((area) => (
                  <Chip
                    key={area}
                    label={area}
                    icon={<LocationOnOutlinedIcon fontSize="small" />}
                    sx={{
                      bgcolor: "transparent",
                      color: "rgba(255, 255, 255, 0.82)",
                      border: "1px solid rgba(255, 255, 255, 0.18)",
                      borderRadius: "8px",
                      py: 2,
                      px: 0.25,
                      fontFamily: "var(--font-body)",
                      fontSize: "0.88rem",
                      fontWeight: 500,
                      transition: "all 0.3s ease",
                      "& .MuiChip-icon": {
                        color: "var(--brand-orange)",
                      },
                      "&:hover": {
                        bgcolor: "rgba(255, 255, 255, 0.05)",
                        borderColor: "rgba(255, 255, 255, 0.38)",
                        transform: "translateY(-2px)",
                      },
                    }}
                  />
                ))}
              </Box>

              <Box
                sx={{
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: 3,
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  boxShadow: "0 24px 48px rgba(0,0,0,0.28)",
                  minHeight: { xs: 250, md: 285 },
                }}
              >
                <Box
                  component="iframe"
                  title="JL Upholstery regional service area map"
                  src={mapSrc}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  sx={{
                    border: 0,
                    width: "100%",
                    height: { xs: 250, md: 285 },
                    display: "block",
                    filter: "grayscale(0.15) contrast(1.04) saturate(0.9)",
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    left: 14,
                    right: 14,
                    bottom: 14,
                    p: 1.35,
                    borderRadius: 2.5,
                    bgcolor: "rgba(17, 17, 17, 0.84)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <Typography
                    sx={{
                      color: "#ffffff",
                      fontFamily: "var(--font-heading)",
                      fontWeight: 600,
                      fontSize: "0.98rem",
                      mb: 0.35,
                    }}
                  >
                    Regional Pickup & Delivery Coverage
                  </Typography>
                  <Typography
                    sx={{
                      color: "rgba(255,255,255,0.7)",
                      fontSize: "0.84rem",
                      lineHeight: 1.55,
                    }}
                  >
                    A wider view that includes Milton, the GTA, Guelph, Niagara Falls, and the communities between them.
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
