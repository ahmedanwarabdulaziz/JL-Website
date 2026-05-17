"use client";

import { Box, Container, Typography, Grid, Chip } from "@mui/material";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PublicIcon from "@mui/icons-material/Public";
import Script from "next/script";

// ── Visual: broad coverage zones (no hard city boundaries) ──────────────────
const COVERAGE_ZONES = [
  { label: "Halton Region", note: "Milton, Burlington, Oakville, Georgetown" },
  { label: "Peel Region", note: "Mississauga, Brampton, Caledon" },
  { label: "Greater Toronto Area", note: "All 905 & 416 communities" },
  { label: "Hamilton–Niagara Corridor", note: "Hamilton to Niagara Falls & beyond" },
  { label: "Wellington County", note: "Guelph, Fergus, Elora & surrounding" },
  { label: "& Surrounding Areas", note: "If you're unsure, just ask — we likely reach you" },
];

// ── SEO: every city name injected as visible-but-subtle prose ───────────────
const SEO_CITIES_LINE =
  "Milton, Brampton, Oakville, Mississauga, Burlington, Georgetown, Guelph, Hamilton, Stoney Creek, Ancaster, Dundas, Grimsby, Beamsville, Niagara Falls, St. Catharines, Thorold, Welland, Port Colborne, Kitchener, Waterloo, Cambridge, Fergus, Elora, Etobicoke, Scarborough, North York, Markham, Vaughan, and all communities in between.";

// ── JSON-LD structured data for Google's areaServed ────────────────────────
const AREA_SERVED_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "JL Upholstery",
  areaServed: [
    "Milton", "Brampton", "Oakville", "Mississauga", "Burlington", "Georgetown",
    "Guelph", "Hamilton", "Stoney Creek", "Ancaster", "Dundas", "Grimsby",
    "Beamsville", "Niagara Falls", "St. Catharines", "Thorold", "Welland",
    "Port Colborne", "Kitchener", "Waterloo", "Cambridge", "Fergus", "Elora",
    "Etobicoke", "Scarborough", "North York", "Markham", "Vaughan",
    "Greater Toronto Area", "Halton Region", "Peel Region", "Wellington County",
  ],
};

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
      {/* JSON-LD structured data — invisible to users, indexed by Google */}
      <Script
        id="regional-reach-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(AREA_SERVED_SCHEMA) }}
        strategy="afterInteractive"
      />

      {/* Background accent */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "50%",
          height: "100%",
          backgroundImage:
            "radial-gradient(circle at top right, rgba(255,255,255,0.05) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="lg" sx={{ px: { xs: 3, sm: 4, md: 6 }, position: "relative", zIndex: 1 }}>
        <Grid container spacing={{ xs: 4, md: 6 }} alignItems="start">
          {/* ── LEFT COLUMN ──────────────────────────────────────────────── */}
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
              Professional Logistics for a Wider{" "}
              <span style={{ color: "var(--brand-orange)", fontStyle: "italic" }}>
                Service Region.
              </span>
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
              Our Milton workshop is your central hub — but our reach extends well beyond any
              single city. We coordinate professional pickup &amp; delivery across a wide regional
              footprint, from the GTA and Halton all the way to Niagara, Wellington, and the
              communities in between.
            </Typography>

            {/* HQ card */}
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 2,
                p: 2.5,
                bgcolor: "rgba(255,255,255,0.03)",
                borderRadius: 2,
                border: "1px solid rgba(255,255,255,0.05)",
                mb: 3,
              }}
            >
              <LocationOnOutlinedIcon sx={{ color: "var(--brand-orange)", mt: 0.5 }} />
              <Box>
                <Typography
                  variant="h6"
                  sx={{ fontFamily: "var(--font-heading)", fontWeight: 600, mb: 1 }}
                >
                  Headquartered in Milton
                </Typography>
                <Typography
                  sx={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.9375rem", lineHeight: 1.6 }}
                >
                  We plan routes efficiently across Halton, Peel, the GTA, Guelph, and the
                  Niagara corridor from one central workshop.
                </Typography>
              </Box>
            </Box>

            {/* "Not sure?" nudge */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                p: 2,
                bgcolor: "rgba(249,195,73,0.07)",
                borderRadius: 2,
                border: "1px solid rgba(249,195,73,0.2)",
              }}
            >
              <PublicIcon sx={{ color: "var(--brand-orange)", flexShrink: 0 }} />
              <Typography
                sx={{
                  color: "rgba(255,255,255,0.85)",
                  fontSize: "0.9rem",
                  fontFamily: "var(--font-body)",
                  lineHeight: 1.55,
                }}
              >
                <strong style={{ color: "var(--brand-orange)" }}>Not sure if we reach you?</strong>{" "}
                Just ask — our coverage is broad and we accommodate clients across southern Ontario.
              </Typography>
            </Box>
          </Grid>

          {/* ── RIGHT COLUMN ─────────────────────────────────────────────── */}
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
              {/* Header row */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  justifyContent: "space-between",
                  alignItems: { xs: "flex-start", sm: "end" },
                  gap: 2,
                  mb: 2.5,
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
                    Coverage Zones
                  </Typography>
                  <Typography
                    sx={{
                      color: "rgba(255, 255, 255, 0.65)",
                      fontSize: "0.95rem",
                      lineHeight: 1.65,
                    }}
                  >
                    We work across these broader regions — not limited to specific cities.
                    If your community sits near any of these zones, we can serve you.
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
                  Southern Ontario
                </Typography>
              </Box>

              {/* Zone chips */}
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.25, mb: 3 }}>
                {COVERAGE_ZONES.map((zone) => (
                  <Box key={zone.label}>
                    <Chip
                      label={zone.label}
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
                        fontWeight: 600,
                        transition: "all 0.3s ease",
                        "& .MuiChip-icon": { color: "var(--brand-orange)" },
                        "&:hover": {
                          bgcolor: "rgba(249,195,73,0.08)",
                          borderColor: "rgba(249,195,73,0.4)",
                          transform: "translateY(-2px)",
                        },
                      }}
                    />
                    {/* Tooltip-style sub-label below each chip — subtle, not cluttered */}
                  </Box>
                ))}
              </Box>

              {/* ── SEO CITY NAMES — visible prose, intentionally subtle ── */}
              <Box
                sx={{
                  p: 2,
                  bgcolor: "rgba(255,255,255,0.02)",
                  borderRadius: 2,
                  border: "1px solid rgba(255,255,255,0.04)",
                  mb: 2.5,
                }}
              >
                <Typography
                  sx={{
                    color: "rgba(255,255,255,0.35)",
                    fontSize: "0.78rem",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    mb: 0.75,
                    fontFamily: "var(--font-body)",
                  }}
                >
                  Communities we commonly serve
                </Typography>
                <Typography
                  sx={{
                    color: "rgba(255,255,255,0.55)",
                    fontSize: "0.83rem",
                    lineHeight: 1.7,
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {SEO_CITIES_LINE}
                </Typography>
              </Box>

              {/* Map */}
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
                  title="JL Upholstery regional service area map — serving Milton, Brampton, Oakville, Mississauga, Burlington, Guelph, Hamilton, Niagara Falls and all of southern Ontario"
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
                    Regional Pickup &amp; Delivery Coverage
                  </Typography>
                  <Typography
                    sx={{
                      color: "rgba(255,255,255,0.7)",
                      fontSize: "0.84rem",
                      lineHeight: 1.55,
                    }}
                  >
                    Serving southern Ontario — from the GTA and Halton to Niagara Falls, Guelph,
                    and everywhere in between.
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
