import type { Metadata } from "next";
import Link from "next/link";
import { Box, Button, Card, CardContent, Chip, Container, Divider, Grid, Stack, Typography } from "@mui/material";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FABRIC_CARE_BRANDS, FABRIC_CARE_PRINCIPLES, FABRIC_CARE_VIDEOS } from "@/lib/fabric-care";

const BRAND_ORANGE = "#f9c349";
const FEATURED_BRANDS = FABRIC_CARE_BRANDS.slice(0, 3);

export const metadata: Metadata = {
  title: "Fabric Maintenance Library",
  description:
    "Source-backed cleaning and maintenance guidance for Alta, Crypton, Endurepel, FibreGuard, and other performance upholstery fabrics.",
};

export default function FabricCareGuidePage() {
  return (
    <Box sx={{ minHeight: "100dvh", display: "flex", flexDirection: "column", bgcolor: "#fff" }}>
      <Header />

      <Box
        component="section"
        sx={{
          position: "relative",
          overflow: "hidden",
          color: "#fff",
          background:
            "radial-gradient(circle at top left, rgba(249,195,73,0.18) 0%, rgba(249,195,73,0) 28%), linear-gradient(180deg, #171717 0%, #111111 100%)",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "120px 120px",
            maskImage: "linear-gradient(180deg, rgba(0,0,0,0.8), rgba(0,0,0,0.15))",
            pointerEvents: "none",
          }}
        />

        <Container maxWidth="xl" sx={{ maxWidth: 1320, px: { xs: 3, sm: 4, md: 6 }, py: { xs: 10, md: 13 } }}>
          <Grid container spacing={{ xs: 6, md: 8 }} alignItems="center">
            <Grid item xs={12} lg={6.5}>
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
                Fabric Maintenance Library
              </Typography>

              <Typography
                component="h1"
                sx={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: 600,
                  fontSize: { xs: "2.6rem", sm: "3.4rem", md: "4.6rem" },
                  lineHeight: 1.08,
                  letterSpacing: "-0.02em",
                  maxWidth: 860,
                }}
              >
                Professional fabric care, organized by brand and built to be easy to follow.
              </Typography>

              <Typography
                sx={{
                  mt: 3,
                  maxWidth: 760,
                  color: "rgba(255,255,255,0.76)",
                  fontSize: { xs: "1rem", md: "1.125rem" },
                  lineHeight: 1.8,
                }}
              >
                This library combines official cleaning guidance, JL workshop notes, and video demonstrations for the upholstery finishes clients ask
                about most often. Start with the page that matches your fabric, then confirm the exact cleaning code before you clean.
              </Typography>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 4.5 }}>
                <Button
                  component={Link}
                  href="#brand-library"
                  variant="contained"
                  size="large"
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
                    "&:hover": { bgcolor: "#dfb042" },
                  }}
                >
                  Explore Brands
                </Button>

                <Button
                  component={Link}
                  href="/contact"
                  variant="outlined"
                  size="large"
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
                  Ask About Your Fabric
                </Button>
              </Stack>
            </Grid>

            <Grid item xs={12} lg={5.5}>
              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={7}>
                  <Box
                    sx={{
                      position: "relative",
                      minHeight: { xs: 320, sm: 440 },
                      borderRadius: 5,
                      overflow: "hidden",
                      border: "1px solid rgba(255,255,255,0.12)",
                      boxShadow: "0 24px 60px rgba(0,0,0,0.24)",
                      backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.04), rgba(0,0,0,0.6)), url(${FEATURED_BRANDS[0].images.hero})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <Box sx={{ position: "absolute", inset: 0, p: 3, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                      <Chip label={FEATURED_BRANDS[0].shortName} sx={{ alignSelf: "flex-start", bgcolor: "rgba(255,255,255,0.9)", fontWeight: 700 }} />
                      <Box>
                        <Typography sx={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "1.7rem", mb: 1 }}>
                          {FEATURED_BRANDS[0].images.note}
                        </Typography>
                        <Typography sx={{ color: "rgba(255,255,255,0.74)", lineHeight: 1.7 }}>{FEATURED_BRANDS[0].summary}</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={5}>
                  <Stack spacing={2.5} sx={{ height: "100%" }}>
                    {FEATURED_BRANDS.slice(1).map((brand) => (
                      <Box
                        key={brand.slug}
                        sx={{
                          position: "relative",
                          flex: 1,
                          minHeight: 208,
                          borderRadius: 4,
                          overflow: "hidden",
                          border: "1px solid rgba(255,255,255,0.12)",
                          backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.62)), url(${brand.images.hero})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      >
                        <Box sx={{ position: "absolute", inset: 0, p: 2.5, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                          <Typography sx={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "1.4rem", mb: 0.5 }}>{brand.name}</Typography>
                          <Typography sx={{ color: "rgba(255,255,255,0.72)", fontSize: "0.9rem", lineHeight: 1.6 }}>{brand.images.note}</Typography>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 7, md: 9 }, bgcolor: "#faf9f6" }}>
        <Container maxWidth="lg" sx={{ px: { xs: 3, sm: 4, md: 6 } }}>
          <Grid container spacing={3}>
            {FABRIC_CARE_PRINCIPLES.map((principle, index) => (
              <Grid item xs={12} md={6} lg={index === 0 ? 12 : 6} key={principle}>
                <Box
                  sx={{
                    height: "100%",
                    p: { xs: 3, md: 3.5 },
                    borderRadius: 4,
                    bgcolor: "#fff",
                    border: "1px solid rgba(0,0,0,0.06)",
                    boxShadow: "0 12px 30px rgba(0,0,0,0.03)",
                  }}
                >
                  <Typography sx={{ color: BRAND_ORANGE, fontWeight: 700, letterSpacing: "0.08em", mb: 1 }}>0{index + 1}</Typography>
                  <Typography sx={{ color: "#1a1a1a", fontSize: { xs: "1rem", md: "1.06rem" }, lineHeight: 1.8 }}>{principle}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box id="brand-library" sx={{ py: { xs: 8, md: 11 }, bgcolor: "#fff" }}>
        <Container maxWidth="lg" sx={{ px: { xs: 3, sm: 4, md: 6 } }}>
          <Box sx={{ textAlign: "center", mb: { xs: 6, md: 8 } }}>
            <Typography
              variant="overline"
              sx={{ color: BRAND_ORANGE, letterSpacing: "0.15em", fontWeight: 700, display: "block", mb: 1.5 }}
            >
              Brand Directory
            </Typography>
            <Typography
              component="h2"
              sx={{
                fontFamily: "var(--font-heading)",
                fontWeight: 600,
                color: "#1a1a1a",
                fontSize: { xs: "2.15rem", md: "3rem" },
                lineHeight: 1.15,
                mb: 2,
              }}
            >
              Choose the fabric finish you want to maintain.
            </Typography>
            <Typography sx={{ maxWidth: 700, mx: "auto", color: "text.secondary", lineHeight: 1.8 }}>
              Each page is focused on one brand, with a cleaner visual layout, simpler instructions, and direct source links.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {FABRIC_CARE_BRANDS.map((brand) => (
              <Grid item xs={12} md={6} lg={4} key={brand.slug}>
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    borderRadius: 4,
                    overflow: "hidden",
                    border: "1px solid rgba(0,0,0,0.08)",
                    transition: "all 0.35s ease",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      borderColor: "rgba(249,195,73,0.35)",
                      boxShadow: "0 22px 46px rgba(0,0,0,0.08)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      minHeight: 220,
                      backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.62)), url(${brand.images.hero})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <Box sx={{ position: "absolute", inset: 0, p: 3, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
                        <Chip
                          label={brand.sourceStatus === "official" ? "Official guidance" : "Verify with supplier"}
                          sx={{
                            bgcolor: "rgba(255,255,255,0.88)",
                            color: "#1a1a1a",
                            fontWeight: 700,
                          }}
                        />
                        <Typography sx={{ color: "rgba(255,255,255,0.75)", fontSize: "0.8rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                          {brand.heroEyebrow}
                        </Typography>
                      </Stack>

                      <Box>
                        <Typography sx={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "2rem", color: "#fff", mb: 0.5 }}>
                          {brand.name}
                        </Typography>
                        <Typography sx={{ color: "rgba(255,255,255,0.75)", lineHeight: 1.7 }}>{brand.images.note}</Typography>
                      </Box>
                    </Box>
                  </Box>

                  <CardContent sx={{ p: { xs: 3, md: 4 }, display: "flex", flexDirection: "column", height: "calc(100% - 220px)" }}>
                    <Typography sx={{ color: "text.secondary", lineHeight: 1.8 }}>{brand.summary}</Typography>

                    <Stack spacing={1} sx={{ mt: 3 }}>
                      {brand.quickFacts.slice(0, 3).map((fact) => (
                        <Typography key={fact} sx={{ color: "#1a1a1a", lineHeight: 1.6 }}>
                          {fact}
                        </Typography>
                      ))}
                    </Stack>

                    <Box sx={{ mt: "auto", pt: 3 }}>
                      <Button
                        component={Link}
                        href={`/fabric-care-guide/${brand.slug}`}
                        variant="outlined"
                        fullWidth
                        sx={{
                          minHeight: 52,
                          borderColor: "rgba(0,0,0,0.1)",
                          color: "#1a1a1a",
                          fontWeight: 600,
                          letterSpacing: "0.05em",
                          textTransform: "uppercase",
                          borderRadius: "999px",
                          "&:hover": { borderColor: "rgba(0,0,0,0.28)", bgcolor: "transparent" },
                        }}
                      >
                        View {brand.shortName} Guide
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: "#faf9f6" }}>
        <Container maxWidth="lg" sx={{ px: { xs: 3, sm: 4, md: 6 } }}>
          <Box sx={{ textAlign: "center", mb: { xs: 5, md: 7 } }}>
            <Typography
              variant="overline"
              sx={{ color: BRAND_ORANGE, letterSpacing: "0.15em", fontWeight: 700, display: "block", mb: 1.5 }}
            >
              Official Demo Videos
            </Typography>
            <Typography
              component="h2"
              sx={{
                fontFamily: "var(--font-heading)",
                fontWeight: 600,
                color: "#1a1a1a",
                fontSize: { xs: "2rem", md: "2.75rem" },
                lineHeight: 1.15,
                mb: 2,
              }}
            >
              Watch the cleaning method before you try it.
            </Typography>
            <Typography sx={{ maxWidth: 720, mx: "auto", color: "text.secondary", lineHeight: 1.8 }}>
              These demos complement the written care pages and help make rinsing, blotting, and stain-lift technique much clearer.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {FABRIC_CARE_VIDEOS.map((video) => (
              <Grid item xs={12} md={6} key={video.watchUrl}>
                <Card elevation={0} sx={{ borderRadius: 4, overflow: "hidden", border: "1px solid rgba(0,0,0,0.06)" }}>
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      paddingTop: "56.25%",
                      bgcolor: "#111",
                    }}
                  >
                    <Box
                      component="iframe"
                      src={video.embedUrl}
                      title={video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      sx={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        border: 0,
                      }}
                    />
                  </Box>
                  <CardContent sx={{ p: 3 }}>
                    <Typography sx={{ fontFamily: "var(--font-heading)", fontWeight: 600, color: "#1a1a1a", fontSize: "1.35rem", mb: 1 }}>
                      {video.title}
                    </Typography>
                    <Typography sx={{ color: "text.secondary", mb: 2 }}>{video.brand} | {video.provider}</Typography>
                    <Button
                      component={Link}
                      href={video.watchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ color: BRAND_ORANGE, fontWeight: 700, px: 0, "&:hover": { bgcolor: "transparent" } }}
                    >
                      Watch on {video.provider}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: "#fff" }}>
        <Container maxWidth="lg" sx={{ px: { xs: 3, sm: 4, md: 6 } }}>
          <Grid container spacing={4} alignItems="stretch">
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  minHeight: { xs: 280, md: 100 },
                  height: "100%",
                  borderRadius: 5,
                  overflow: "hidden",
                  backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.6)), url(${FABRIC_CARE_BRANDS[3].images.detail})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  boxShadow: "0 24px 50px rgba(0,0,0,0.08)",
                }}
              >
                <Box sx={{ height: "100%", p: { xs: 3, md: 4 }, display: "flex", alignItems: "flex-end" }}>
                  <Typography sx={{ color: "#fff", fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: { xs: "1.8rem", md: "2.2rem" }, maxWidth: 420 }}>
                    If you are unsure of the fabric, confirm first and clean second.
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <Typography
                  component="h2"
                  sx={{
                    fontFamily: "var(--font-heading)",
                    fontWeight: 600,
                    color: "#1a1a1a",
                    fontSize: { xs: "2rem", md: "2.5rem" },
                    mb: 2,
                  }}
                >
                  Need help identifying your fabric before cleaning?
                </Typography>
                <Typography sx={{ color: "text.secondary", lineHeight: 1.8, mb: 4 }}>
                  If you are not fully sure whether your material is Alta, Crypton, Endurepel, FibreGuard, Dura-Guard, vinyl, or another upholstery finish,
                  send us a photo or the supplier tag first. It is always safer to confirm the fabric and cleaning code before you start spot treatment.
                </Typography>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <Button
                    component={Link}
                    href="/contact"
                    variant="contained"
                    size="large"
                    sx={{
                      minHeight: 56,
                      px: 4,
                      bgcolor: BRAND_ORANGE,
                      color: "#fff",
                      fontWeight: 600,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      borderRadius: "999px",
                      "&:hover": { bgcolor: "#dfb042" },
                    }}
                  >
                    Contact JL Upholstery
                  </Button>
                  <Button
                    component={Link}
                    href="/fabric"
                    variant="outlined"
                    size="large"
                    sx={{
                      minHeight: 56,
                      px: 4,
                      borderColor: "rgba(0,0,0,0.12)",
                      color: "#1a1a1a",
                      fontWeight: 600,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      borderRadius: "999px",
                      "&:hover": { borderColor: "rgba(0,0,0,0.3)", bgcolor: "transparent" },
                    }}
                  >
                    Browse Fabric Options
                  </Button>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Divider />
      <Footer />
    </Box>
  );
}
