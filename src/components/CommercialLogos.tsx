"use client";

import Link from "next/link";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import ChairOutlinedIcon from "@mui/icons-material/ChairOutlined";
import DeckOutlinedIcon from "@mui/icons-material/DeckOutlined";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import { useQuotationModal } from "@/contexts/QuotationModalContext";

const BRAND_ORANGE = "#f9c349";

const SQUARE_LOGOS = [
  "1.png",
  "11.png",
  "2.png",
  "3.png",
  "top-10.png",
  "top-4.png",
  "top-5.png",
  "top-7.png",
  "top-8.png",
  "top-9.png",
].map((file) => ({
  src: `/images/commercial logos/Square logos/${file}`,
  shape: "square" as const,
}));

const RECTANGLE_LOGOS = [
  "1.png",
  "10.png",
  "12.png",
  "13.png",
  "14.png",
  "3.png",
  "5.png",
  "6.png",
  "7.png",
  "top-11.png",
  "top-15.png",
  "top-2.png",
  "top-4.png",
  "top-8.png",
  "top-9.png",
].map((file) => ({
  src: `/images/commercial logos/rectangle  logos/${file}`,
  shape: "rectangle" as const,
}));

const ALL_LOGOS = [...RECTANGLE_LOGOS, ...SQUARE_LOGOS];
const FEATURED_LOGOS = ALL_LOGOS.filter((logo) => logo.src.toLowerCase().includes("/top-") && !logo.src.includes("top-11"));
const STANDARD_LOGOS = ALL_LOGOS.filter((logo) => !logo.src.toLowerCase().includes("/top-") || logo.src.includes("top-11"));
const FEATURED_RECTANGLE_LOGOS = [
  ...FEATURED_LOGOS.filter((logo) => logo.shape === "rectangle"),
  ...ALL_LOGOS.filter((logo) => logo.src.includes("top-11")),
];
const FEATURED_SQUARE_LOGOS = FEATURED_LOGOS.filter((logo) => logo.shape === "square");
const STANDARD_SPLIT_INDEX = Math.ceil(STANDARD_LOGOS.length / 2);
const STANDARD_ROW_ONE = STANDARD_LOGOS.slice(0, STANDARD_SPLIT_INDEX);
const STANDARD_ROW_TWO = STANDARD_LOGOS.slice(STANDARD_SPLIT_INDEX);

const STATS = [
  { value: "30+", label: "Years of Family Craft" },
  { value: "5,000+", label: "Clients Served" },
  { value: "Indoor + Outdoor", label: "Commercial Settings" },
  { value: "All Styles", label: "Furniture Expertise" },
];

const PROOF_POINTS = [
  { icon: ApartmentOutlinedIcon, label: "Hospitality, office, healthcare, retail" },
  { icon: ChairOutlinedIcon, label: "Booths, banquettes, lounge seating, casegoods" },
  { icon: DeckOutlinedIcon, label: "Interior and exterior furniture programs" },
];

export default function CommercialLogos() {
  const { openQuotationModal } = useQuotationModal();

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 9, md: 12, lg: 14 },
        color: "#fff",
        position: "relative",
        overflow: "hidden",
        background:
          "radial-gradient(circle at top left, rgba(249,195,73,0.16) 0%, rgba(249,195,73,0) 30%), linear-gradient(180deg, #171717 0%, #101010 100%)",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "120px 120px",
          maskImage: "linear-gradient(180deg, rgba(0,0,0,0.5), rgba(0,0,0,0))",
          pointerEvents: "none",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: "10%",
          width: { xs: 160, md: 260 },
          height: { xs: 160, md: 260 },
          borderRadius: "50%",
          bgcolor: "rgba(249,195,73,0.08)",
          filter: "blur(20px)",
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="xl" sx={{ maxWidth: 1320, px: { xs: 3, sm: 4, md: 6 }, position: "relative", zIndex: 1 }}>
        <Stack spacing={{ xs: 7, md: 8 }}>
          <Stack direction={{ xs: "column", lg: "row" }} spacing={{ xs: 5, md: 6, lg: 8 }} alignItems="stretch">
            <Box sx={{ flex: 1.1, maxWidth: { lg: 700 } }}>
              <Typography
                variant="overline"
                sx={{
                  color: BRAND_ORANGE,
                  letterSpacing: "0.18em",
                  fontWeight: 700,
                  display: "block",
                  mb: 2,
                }}
              >
                Trusted In Homes And Commercial Spaces
              </Typography>

              <Typography
                component="h2"
                sx={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: 600,
                  color: "#fff",
                  fontSize: { xs: "2.35rem", sm: "2.85rem", md: "3.5rem" },
                  lineHeight: 1.12,
                  letterSpacing: "0.01em",
                  maxWidth: 760,
                }}
              >
                30+ years of trusted upholstery for <span style={{ color: BRAND_ORANGE, fontStyle: "italic" }}>homes, hospitality,</span> and high-traffic spaces.
              </Typography>

              <Typography
                sx={{
                  mt: 3,
                  color: "rgba(255,255,255,0.74)",
                  fontSize: { xs: "1rem", md: "1.125rem" },
                  lineHeight: 1.8,
                  maxWidth: 680,
                }}
              >
                JL Upholstery has served more than 5,000 customers across indoor and outdoor environments, from cherished residential furniture to recognized commercial settings. Our work is built for every furniture category, every design language, and every client who wants lasting quality.
              </Typography>

              <Stack spacing={1.5} sx={{ mt: 4 }}>
                {PROOF_POINTS.map(({ icon: Icon, label }) => (
                  <Stack key={label} direction="row" spacing={1.5} alignItems="center">
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "rgba(249,195,73,0.12)",
                        color: BRAND_ORANGE,
                        flexShrink: 0,
                      }}
                    >
                      <Icon sx={{ fontSize: 18 }} />
                    </Box>
                    <Typography sx={{ color: "rgba(255,255,255,0.78)", fontSize: { xs: "0.95rem", md: "1rem" } }}>{label}</Typography>
                  </Stack>
                ))}
              </Stack>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 4.5 }}>
                <Button
                  onClick={openQuotationModal}
                  variant="contained"
                  size="large"
                  disableElevation
                  sx={{
                    minHeight: 56,
                    px: 4,
                    bgcolor: BRAND_ORANGE,
                    color: "#181818",
                    fontWeight: 700,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    borderRadius: "999px",
                    boxShadow: "0 16px 32px rgba(249,195,73,0.18)",
                    "&:hover": {
                      bgcolor: "#dfb042",
                      boxShadow: "0 20px 36px rgba(249,195,73,0.24)",
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  Request a Commercial Quote
                </Button>

                <Button
                  component={Link}
                  href="/commercial"
                  variant="outlined"
                  size="large"
                  endIcon={<ArrowForwardRoundedIcon />}
                  sx={{
                    minHeight: 56,
                    px: 4,
                    borderColor: "rgba(255,255,255,0.18)",
                    color: "#fff",
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    borderRadius: "999px",
                    "&:hover": {
                      borderColor: "rgba(255,255,255,0.34)",
                      bgcolor: "rgba(255,255,255,0.04)",
                    },
                  }}
                >
                  Explore Commercial Work
                </Button>
              </Stack>
            </Box>

            <Box sx={{ flex: 0.9 }}>
              <Box
                sx={{
                  height: "100%",
                  minHeight: { xs: "auto", lg: 420 },
                  p: { xs: 3, sm: 4, md: 4.5 },
                  borderRadius: { xs: 4, md: 5 },
                  bgcolor: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: "0 24px 60px rgba(0,0,0,0.24)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 3 }}>
                  <VerifiedOutlinedIcon sx={{ color: BRAND_ORANGE, fontSize: 20 }} />
                  <Typography sx={{ color: "rgba(255,255,255,0.82)", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", fontSize: "0.8rem" }}>
                    Trusted Reputation
                  </Typography>
                </Stack>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
                    gap: 2,
                  }}
                >
                  {STATS.map((stat) => (
                    <Box
                      key={stat.label}
                      sx={{
                        p: { xs: 2.5, md: 3 },
                        borderRadius: 3,
                        bgcolor: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: "var(--font-heading)",
                          color: "#fff",
                          fontWeight: 600,
                          fontSize: { xs: "1.65rem", md: "2rem" },
                          lineHeight: 1.1,
                          mb: 0.75,
                        }}
                      >
                        {stat.value}
                      </Typography>
                      <Typography sx={{ color: "rgba(255,255,255,0.62)", fontSize: "0.86rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                        {stat.label}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <Box
                  sx={{
                    mt: 3,
                    p: 3,
                    borderRadius: 3,
                    background: "linear-gradient(135deg, rgba(249,195,73,0.12) 0%, rgba(249,195,73,0.04) 100%)",
                    border: "1px solid rgba(249,195,73,0.16)",
                  }}
                >
                  <Typography
                    sx={{
                      color: "#fff",
                      fontFamily: "var(--font-heading)",
                      fontSize: { xs: "1.1rem", md: "1.3rem" },
                      lineHeight: 1.4,
                      mb: 1,
                    }}
                  >
                    Trusted by homeowners, designers, and businesses across hospitality, healthcare, office, retail, and specialty environments.
                  </Typography>
                  <Typography sx={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.7, fontSize: "0.95rem" }}>
                    Every logo here reflects high expectations and repeat confidence, while the same care and craftsmanship also guide the residential pieces entrusted to our workshop.
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Stack>

          <Box
            sx={{
              p: { xs: 2.5, sm: 3.5, md: 4.5 },
              borderRadius: { xs: 4, md: 5 },
              bgcolor: "#f7f4ee",
              border: "1px solid rgba(0,0,0,0.06)",
              boxShadow: "0 28px 70px rgba(0,0,0,0.18)",
            }}
          >
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", md: "center" }}
              sx={{ mb: 3.5 }}
            >
              <Box>
                <Typography
                  variant="overline"
                  sx={{
                    color: "rgba(26,26,26,0.56)",
                    letterSpacing: "0.15em",
                    fontWeight: 700,
                    display: "block",
                    mb: 0.5,
                  }}
                >
                  Selected Client Portfolio
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "var(--font-heading)",
                    color: "#1a1a1a",
                    fontWeight: 600,
                    fontSize: { xs: "1.55rem", md: "2rem" },
                    lineHeight: 1.2,
                  }}
                >
                  Recognized names. Long-term relationships. Proven commercial trust.
                </Typography>
              </Box>

              <Typography
                sx={{
                  color: "rgba(26,26,26,0.62)",
                  maxWidth: 420,
                  lineHeight: 1.7,
                  fontSize: "0.95rem",
                }}
              >
                A curated selection of organizations and businesses that have trusted JL Upholstery with seating, restoration, and commercial furniture work.
              </Typography>
            </Stack>

            <Stack spacing={{ xs: 3.5, md: 4.5 }}>
              <Box
                sx={{
                  p: { xs: 2.5, md: 3.5 },
                  borderRadius: 4,
                  bgcolor: "#111111",
                  color: "#fff",
                  overflow: "hidden",
                  position: "relative",
                  boxShadow: "0 22px 48px rgba(17,17,17,0.18)",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "radial-gradient(circle at top left, rgba(249,195,73,0.18), transparent 32%), linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0))",
                    pointerEvents: "none",
                  }}
                />

                <Stack
                  direction={{ xs: "column", md: "row" }}
                  spacing={2}
                  justifyContent="space-between"
                  alignItems={{ xs: "flex-start", md: "center" }}
                  sx={{ position: "relative", zIndex: 1, mb: 3 }}
                >
                  <Box>
                    <Typography
                      variant="overline"
                      sx={{
                        color: BRAND_ORANGE,
                        letterSpacing: "0.18em",
                        fontWeight: 700,
                        display: "block",
                        mb: 0.5,
                      }}
                    >
                      Signature Clients
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "var(--font-heading)",
                        fontWeight: 600,
                        fontSize: { xs: "1.4rem", md: "1.85rem" },
                        lineHeight: 1.2,
                      }}
                    >
                      Spotlight brands that lead the first impression.
                    </Typography>
                  </Box>

                  <Typography
                    sx={{
                      maxWidth: 420,
                      color: "rgba(255,255,255,0.68)",
                      lineHeight: 1.7,
                      fontSize: "0.95rem",
                    }}
                  >
                    Your top-tier commercial relationships now sit in a more editorial, premium composition instead of a standard grid.
                  </Typography>
                </Stack>

                <Stack spacing={{ xs: 2, md: 2.5 }} sx={{ position: "relative", zIndex: 1 }}>
                  <Stack spacing={{ xs: 2, md: 2.5 }}>
                    {[FEATURED_RECTANGLE_LOGOS, FEATURED_SQUARE_LOGOS].map((row, rowIndex) => {
                      const isRectangleRow = rowIndex === 0;

                      return (
                        <Box
                          key={isRectangleRow ? "rectangle-row" : "square-row"}
                          sx={{
                            display: "grid",
                            gridTemplateColumns: {
                              xs: "repeat(2, minmax(0, 1fr))",
                              md: `repeat(${Math.max(row.length, 1)}, minmax(0, 1fr))`,
                            },
                            gap: { xs: 2, md: 2.25 },
                          }}
                        >
                          {row.map((logo, index) => {
                            const rotate = isRectangleRow
                              ? index % 2 === 0
                                ? -1.25
                                : 1.25
                              : index % 3 === 0
                                ? -1
                                : index % 3 === 1
                                  ? 1
                                  : -0.5;

                            return (
                              <Box
                                key={`${logo.src}-${index}`}
                                sx={{
                                  gridColumn: {
                                    xs: logo.shape === "rectangle" ? "span 2" : "span 1",
                                    md: "span 1",
                                  },
                                  minHeight: {
                                    xs: logo.shape === "rectangle" ? 104 : 122,
                                    md: logo.shape === "rectangle" ? 124 : 148,
                                  },
                                  p: { xs: 2.25, md: 2.5 },
                                  borderRadius: 4,
                                  position: "relative",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  bgcolor: "#ffffff",
                                  border: "1px solid rgba(249,195,73,0.24)",
                                  boxShadow: "0 18px 34px rgba(0,0,0,0.18)",
                                  transform: { xs: "none", md: `rotate(${rotate}deg)` },
                                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                  "&:hover": {
                                    transform: { xs: "translateY(-2px)", md: `translateY(-6px) rotate(${rotate}deg)` },
                                    boxShadow: "0 24px 40px rgba(0,0,0,0.22)",
                                  },
                                  "&::before": {
                                    content: '""',
                                    position: "absolute",
                                    inset: 0,
                                    borderRadius: "inherit",
                                    padding: "1px",
                                    background: "linear-gradient(135deg, rgba(249,195,73,0.82), rgba(249,195,73,0.08))",
                                    WebkitMask:
                                      "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                                    WebkitMaskComposite: "xor",
                                    pointerEvents: "none",
                                  },
                                }}
                              >
                                <Box
                                  component="img"
                                  src={logo.src}
                                  alt={`Signature commercial client logo ${index + 1}`}
                                  sx={{
                                    width: "100%",
                                    height: "100%",
                                    maxWidth: logo.shape === "rectangle" ? "92%" : "86%",
                                    maxHeight: logo.shape === "rectangle" ? { xs: 68, md: 82 } : { xs: 96, md: 116 },
                                    objectFit: "contain",
                                  }}
                                />
                              </Box>
                            );
                          })}
                        </Box>
                      );
                    })}
                  </Stack>
                </Stack>
              </Box>

              <Box
                sx={{
                  p: { xs: 2.5, md: 3 },
                  borderRadius: 4,
                  bgcolor: "rgba(255,255,255,0.72)",
                  border: "1px solid rgba(0,0,0,0.06)",
                  overflow: "hidden",
                  position: "relative",
                  "&:hover .logo-marquee": {
                    animationPlayState: "paused",
                  },
                }}
              >
                <Typography
                  variant="overline"
                  sx={{
                    color: "rgba(26,26,26,0.56)",
                    letterSpacing: "0.15em",
                    fontWeight: 700,
                    display: "block",
                    mb: 2,
                  }}
                >
                  Broader Client Roster
                </Typography>

                <Stack spacing={1.5}>
                  {[
                    { items: STANDARD_ROW_ONE, duration: { xs: "34s", md: "42s" }, reverse: false },
                    { items: STANDARD_ROW_TWO, duration: { xs: "38s", md: "48s" }, reverse: true },
                  ].map((row, rowIndex) => (
                    <Box
                      key={rowIndex}
                      sx={{
                        overflow: "hidden",
                        maskImage: "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)",
                        WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)",
                      }}
                    >
                      <Box
                        className="logo-marquee"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: { xs: 1.25, md: 1.5 },
                          width: "max-content",
                          animation: `${row.reverse ? "commercialMarqueeReverse" : "commercialMarquee"} ${row.duration.xs} linear infinite`,
                          "@media (min-width:900px)": {
                            animation: `${row.reverse ? "commercialMarqueeReverse" : "commercialMarquee"} ${row.duration.md} linear infinite`,
                          },
                          "@keyframes commercialMarquee": {
                            from: { transform: "translateX(0)" },
                            to: { transform: "translateX(calc(-50% - 0.75rem))" },
                          },
                          "@keyframes commercialMarqueeReverse": {
                            from: { transform: "translateX(calc(-50% - 0.75rem))" },
                            to: { transform: "translateX(0)" },
                          },
                        }}
                      >
                        {[...row.items, ...row.items].map((logo, index) => {
                          const isRectangle = logo.shape === "rectangle";

                          return (
                            <Box
                              key={`${logo.src}-${rowIndex}-${index}`}
                              sx={{
                                flex: "0 0 auto",
                                minWidth: isRectangle ? { xs: 190, md: 260 } : { xs: 102, md: 128 },
                                minHeight: isRectangle ? { xs: 88, md: 108 } : { xs: 66, md: 82 },
                                px: { xs: 1.6, md: 2.25 },
                                py: { xs: 1.25, md: 1.75 },
                                borderRadius: 999,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                bgcolor: "rgba(255,255,255,0.8)",
                                border: "1px solid rgba(0,0,0,0.05)",
                                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.92)",
                              }}
                            >
                              <Box
                                component="img"
                                src={logo.src}
                                alt={`Commercial client logo ${index + 1}`}
                                sx={{
                                  width: "100%",
                                  height: "100%",
                                  maxWidth: isRectangle ? "92%" : "78%",
                                  maxHeight: isRectangle ? { xs: 64, md: 80 } : { xs: 54, md: 66 },
                                  objectFit: "contain",
                                  opacity: 0.92,
                                  transform: logo.src.includes("top-11") ? "scale(1.65)" : "none",
                                  transformOrigin: "center",
                                }}
                              />
                            </Box>
                          );
                        })}
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
