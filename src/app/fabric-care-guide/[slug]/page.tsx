import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Box, Button, Card, CardContent, Chip, Container, Divider, Grid, Stack, Typography } from "@mui/material";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FABRIC_CARE_BRANDS, FABRIC_CARE_BRAND_MAP } from "@/lib/fabric-care";
import WaterDropOutlinedIcon from "@mui/icons-material/WaterDropOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import CleaningServicesOutlinedIcon from "@mui/icons-material/CleaningServicesOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

const BRAND_ORANGE = "#f9c349";

type BrandPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function DetailList({ items }: { items: string[] }) {
  return (
    <Stack spacing={1.5}>
      {items.map((item) => (
        <Typography key={item} sx={{ color: "text.secondary", lineHeight: 1.8 }}>
          {item}
        </Typography>
      ))}
    </Stack>
  );
}

function StylishDetailList({ items }: { items: string[] }) {
  return (
    <Stack spacing={2}>
      {items.map((item, index) => (
        <Stack direction="row" spacing={1.5} key={index} alignItems="flex-start">
          <Box
            sx={{
              mt: 0.25,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 24,
              height: 24,
              borderRadius: "50%",
              bgcolor: "rgba(0,0,0,0.04)",
              color: "#1a1a1a",
              flexShrink: 0,
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 16 }} />
          </Box>
          <Typography sx={{ color: "text.secondary", lineHeight: 1.6, fontSize: "0.95rem" }}>
            {item}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}

function SectionCard({
  title,
  eyebrow,
  items,
  icon,
  useStylishBullets,
}: {
  title: string;
  eyebrow: string;
  items: string[];
  icon?: React.ReactNode;
  useStylishBullets?: boolean;
}) {
  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        borderRadius: 4,
        border: "1px solid rgba(0,0,0,0.08)",
        boxShadow: "0 14px 36px rgba(0,0,0,0.03)",
      }}
    >
      <CardContent sx={{ p: { xs: 3, md: 4 } }}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
          {icon && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 32,
                height: 32,
                borderRadius: 2,
                bgcolor: "rgba(0,0,0,0.04)",
                color: "#1a1a1a",
              }}
            >
              {icon}
            </Box>
          )}
          <Typography
            variant="overline"
            sx={{ color: "text.secondary", letterSpacing: "0.14em", fontWeight: 700, display: "block", m: 0 }}
          >
            {eyebrow}
          </Typography>
        </Stack>
        <Typography sx={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "1.8rem", color: "#1a1a1a", mb: 2 }}>
          {title}
        </Typography>
        {useStylishBullets ? <StylishDetailList items={items} /> : <DetailList items={items} />}
      </CardContent>
    </Card>
  );
}

export async function generateStaticParams() {
  return FABRIC_CARE_BRANDS.map((brand) => ({
    slug: brand.slug,
  }));
}

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const { slug } = await params;
  const brand = FABRIC_CARE_BRAND_MAP[slug];

  if (!brand) {
    return {
      title: "Fabric Maintenance Guide",
    };
  }

  return {
    title: `${brand.name} Maintenance Guide`,
    description: `Cleaning and care guidance for ${brand.name} upholstery fabrics, including routine care, spill response, cautions, and source links.`,
  };
}

export default async function FabricCareBrandPage({ params }: BrandPageProps) {
  const { slug } = await params;
  const brand = FABRIC_CARE_BRAND_MAP[slug];

  if (!brand) {
    notFound();
  }

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
            "radial-gradient(circle at top left, rgba(249,195,73,0.20) 0%, rgba(249,195,73,0) 26%), linear-gradient(180deg, #171717 0%, #101010 100%)",
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

        <Container maxWidth="xl" sx={{ maxWidth: 1320, px: { xs: 3, sm: 4, md: 6 }, py: { xs: 10, md: 12 } }}>
          <Grid container spacing={{ xs: 5, md: 7 }} alignItems="center">
            <Grid item xs={12} lg={6}>
              <Typography
                variant="overline"
                sx={{ color: BRAND_ORANGE, letterSpacing: "0.18em", fontWeight: 700, display: "block", mb: 2 }}
              >
                {brand.heroEyebrow}
              </Typography>

              <Typography
                component="h1"
                sx={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: 600,
                  fontSize: { xs: "2.7rem", sm: "3.5rem", md: "4.5rem" },
                  lineHeight: 1.08,
                  letterSpacing: "-0.02em",
                  maxWidth: 820,
                }}
              >
                {brand.name} maintenance guide
              </Typography>

              <Typography
                sx={{
                  mt: 3,
                  maxWidth: 760,
                  color: "rgba(255,255,255,0.76)",
                  fontSize: { xs: "1rem", md: "1.1rem" },
                  lineHeight: 1.8,
                }}
              >
                {brand.summary}
              </Typography>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 4 }}>
                <Button
                  component={Link}
                  href="#care-steps"
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
                    "&:hover": { bgcolor: "#dfb042" },
                  }}
                >
                  View Care Steps
                </Button>

                <Button
                  component={Link}
                  href="/fabric-care-guide"
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
                    "&:hover": { borderColor: "rgba(255,255,255,0.34)", bgcolor: "rgba(255,255,255,0.04)" },
                  }}
                >
                  Back to Library
                </Button>
              </Stack>
            </Grid>

            <Grid item xs={12} lg={6}>
              <Box
                sx={{
                  position: "relative",
                  minHeight: { xs: 360, md: 560 },
                  borderRadius: 5,
                  overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.1)",
                  boxShadow: "0 28px 64px rgba(0,0,0,0.28)",
                  backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.06), rgba(0,0,0,0.66)), url(${brand.images.hero})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <Box sx={{ position: "absolute", inset: 0, p: { xs: 3, md: 4 }, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
                    <Chip
                      label={brand.sourceStatus === "official" ? "Official guidance" : "Verify with supplier"}
                      sx={{
                        bgcolor: "rgba(255,255,255,0.9)",
                        color: "#1a1a1a",
                        fontWeight: 700,
                      }}
                    />
                    <Typography sx={{ color: "rgba(255,255,255,0.72)", fontSize: "0.8rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                      {brand.shortName}
                    </Typography>
                  </Stack>

                  <Box
                    sx={{
                      alignSelf: { xs: "stretch", md: "flex-end" },
                      maxWidth: 360,
                      p: 3,
                      borderRadius: 4,
                      bgcolor: "rgba(17,17,17,0.58)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      backdropFilter: "blur(12px)",
                    }}
                  >
                    <Typography sx={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "1.8rem", mb: 1 }}>{brand.images.note}</Typography>
                    <Stack spacing={1}>
                      {brand.quickFacts.slice(0, 3).map((fact) => (
                        <Typography key={fact} sx={{ color: "rgba(255,255,255,0.78)", lineHeight: 1.7 }}>
                          {fact}
                        </Typography>
                      ))}
                    </Stack>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: "#fff" }}>
        <Container maxWidth="lg" sx={{ px: { xs: 3, sm: 4, md: 6 } }}>
          <Grid container spacing={4} alignItems="stretch">
            <Grid item xs={12} lg={5}>
              <Box
                sx={{
                  position: "relative",
                  minHeight: { xs: 320, md: "100%" },
                  height: "100%",
                  borderRadius: 5,
                  overflow: "hidden",
                  backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.04), rgba(0,0,0,0.56)), url(${brand.images.detail})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  boxShadow: "0 24px 50px rgba(0,0,0,0.08)",
                }}
              >
                <Box sx={{ height: "100%", p: { xs: 3, md: 4 }, display: "flex", alignItems: "flex-end" }}>
                  <Box
                    sx={{
                      maxWidth: 360,
                      p: 3,
                      borderRadius: 4,
                      bgcolor: "rgba(255,255,255,0.88)",
                      boxShadow: "0 16px 30px rgba(0,0,0,0.12)",
                    }}
                  >
                    <Typography sx={{ color: BRAND_ORANGE, fontWeight: 700, letterSpacing: "0.08em", mb: 1 }}>Visual Reference</Typography>
                    <Typography sx={{ color: "#1a1a1a", lineHeight: 1.7 }}>{brand.images.alt}</Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} lg={7}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card elevation={0} sx={{ height: "100%", borderRadius: 4, border: "1px solid rgba(0,0,0,0.08)" }}>
                    <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                      <Typography
                        variant="overline"
                        sx={{ color: BRAND_ORANGE, letterSpacing: "0.14em", fontWeight: 700, display: "block", mb: 1 }}
                      >
                        Best Use
                      </Typography>
                      <Typography sx={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "1.8rem", color: "#1a1a1a", mb: 2 }}>
                        Where {brand.shortName} works best
                      </Typography>
                      <Typography sx={{ color: "text.secondary", lineHeight: 1.8 }}>{brand.bestFor}</Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card elevation={0} sx={{ height: "100%", borderRadius: 4, border: "1px solid rgba(0,0,0,0.08)" }}>
                    <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                      <Typography
                        variant="overline"
                        sx={{ color: BRAND_ORANGE, letterSpacing: "0.14em", fontWeight: 700, display: "block", mb: 1 }}
                      >
                        Cleaning Code
                      </Typography>
                      <Typography sx={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "1.8rem", color: "#1a1a1a", mb: 2 }}>
                        Confirm the exact fabric first
                      </Typography>
                      <Typography sx={{ color: "text.secondary", lineHeight: 1.8 }}>{brand.cleaningCodeNote}</Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Card
                    elevation={0}
                    sx={{
                      borderRadius: 4,
                      border: "1px solid rgba(0,0,0,0.08)",
                      background:
                        "linear-gradient(135deg, rgba(249,195,73,0.12) 0%, rgba(249,195,73,0.02) 42%, rgba(255,255,255,1) 100%)",
                    }}
                  >
                    <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                      <Typography
                        variant="overline"
                        sx={{ color: BRAND_ORANGE, letterSpacing: "0.14em", fontWeight: 700, display: "block", mb: 1 }}
                      >
                        Quick Facts
                      </Typography>
                      <Grid container spacing={2}>
                        {brand.quickFacts.map((fact) => (
                          <Grid item xs={12} md={6} key={fact}>
                            <Box
                              sx={{
                                p: 2.2,
                                height: "100%",
                                borderRadius: 3,
                                bgcolor: "rgba(255,255,255,0.72)",
                                border: "1px solid rgba(0,0,0,0.04)",
                              }}
                            >
                              <Typography sx={{ color: "#1a1a1a", lineHeight: 1.7 }}>{fact}</Typography>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box id="care-steps" sx={{ py: { xs: 8, md: 10 }, bgcolor: "#faf9f6" }}>
        <Container maxWidth="lg" sx={{ px: { xs: 3, sm: 4, md: 6 } }}>
          <Box sx={{ textAlign: "center", mb: { xs: 5, md: 7 } }}>
            <Typography
              variant="overline"
              sx={{ color: BRAND_ORANGE, letterSpacing: "0.15em", fontWeight: 700, display: "block", mb: 1.5 }}
            >
              Care Steps
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
              A safer way to clean {brand.shortName} upholstery.
            </Typography>
            <Typography sx={{ maxWidth: 740, mx: "auto", color: "text.secondary", lineHeight: 1.8 }}>
              Start with the gentlest method, rinse thoroughly, and let the fabric dry fully before judging the final result.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <SectionCard
                title="Routine care"
                eyebrow="Ongoing maintenance"
                items={brand.routineCare}
                icon={<AutorenewOutlinedIcon fontSize="small" />}
                useStylishBullets={true}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <SectionCard
                title="Immediate spill response"
                eyebrow="First action"
                items={brand.immediateSpillResponse}
                icon={<WaterDropOutlinedIcon fontSize="small" />}
                useStylishBullets={true}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <SectionCard
                title="Stubborn stain care"
                eyebrow="When more work is needed"
                items={brand.stubbornStainCare}
                icon={<CleaningServicesOutlinedIcon fontSize="small" />}
                useStylishBullets={true}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <SectionCard
                title="Cautions"
                eyebrow="Avoid these mistakes"
                items={brand.cautions}
                icon={<WarningAmberOutlinedIcon fontSize="small" />}
                useStylishBullets={true}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {(brand.workshopNote || brand.sourceNote) && (
        <Box sx={{ py: { xs: 8, md: 9 }, bgcolor: "#fff" }}>
          <Container maxWidth="lg" sx={{ px: { xs: 3, sm: 4, md: 6 } }}>
            <Grid container spacing={3}>
              {brand.workshopNote && (
                <Grid item xs={12} md={brand.sourceNote ? 6 : 12}>
                  <Card
                    elevation={0}
                    sx={{
                      height: "100%",
                      borderRadius: 4,
                      border: "1px solid rgba(0,0,0,0.08)",
                      background:
                        "linear-gradient(135deg, rgba(249,195,73,0.1) 0%, rgba(249,195,73,0.02) 32%, rgba(255,255,255,1) 100%)",
                    }}
                  >
                    <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                      <Typography
                        variant="overline"
                        sx={{ color: BRAND_ORANGE, letterSpacing: "0.14em", fontWeight: 700, display: "block", mb: 1 }}
                      >
                        JL Workshop Note
                      </Typography>
                      <Typography sx={{ color: "text.secondary", lineHeight: 1.8 }}>{brand.workshopNote}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )}

              {brand.sourceNote && (
                <Grid item xs={12} md={brand.workshopNote ? 6 : 12}>
                  <Card elevation={0} sx={{ height: "100%", borderRadius: 4, border: "1px solid rgba(0,0,0,0.08)" }}>
                    <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                      <Typography
                        variant="overline"
                        sx={{ color: BRAND_ORANGE, letterSpacing: "0.14em", fontWeight: 700, display: "block", mb: 1 }}
                      >
                        Source Note
                      </Typography>
                      <Typography sx={{ color: "text.secondary", lineHeight: 1.8 }}>{brand.sourceNote}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>
          </Container>
        </Box>
      )}

      {brand.videos.length > 0 && (
        <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: "#faf9f6" }}>
          <Container maxWidth="lg" sx={{ px: { xs: 3, sm: 4, md: 6 } }}>
            <Box sx={{ textAlign: "center", mb: { xs: 5, md: 7 } }}>
              <Typography
                variant="overline"
                sx={{ color: BRAND_ORANGE, letterSpacing: "0.15em", fontWeight: 700, display: "block", mb: 1.5 }}
              >
                Video Demonstrations
              </Typography>
              <Typography
                component="h2"
                sx={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: 600,
                  color: "#1a1a1a",
                  fontSize: { xs: "2rem", md: "2.6rem" },
                  lineHeight: 1.15,
                  mb: 2,
                }}
              >
                See the technique before you try it.
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {brand.videos.map((video) => (
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
                      <Typography sx={{ color: "text.secondary", mb: 2 }}>{video.provider}</Typography>
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
      )}

      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: "#fff" }}>
        <Container maxWidth="lg" sx={{ px: { xs: 3, sm: 4, md: 6 } }}>
          <Grid container spacing={4} alignItems="stretch">
            <Grid item xs={12} lg={7}>
              <Typography
                variant="overline"
                sx={{ color: BRAND_ORANGE, letterSpacing: "0.15em", fontWeight: 700, display: "block", mb: 1.5 }}
              >
                Source Links
              </Typography>
              <Typography
                component="h2"
                sx={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: 600,
                  color: "#1a1a1a",
                  fontSize: { xs: "2rem", md: "2.6rem" },
                  lineHeight: 1.15,
                  mb: 2,
                }}
              >
                Reference material for {brand.shortName}.
              </Typography>
              <Typography sx={{ color: "text.secondary", lineHeight: 1.8, mb: 3 }}>
                Use the brand or supplier documentation below for the most specific instructions tied to your exact textile.
              </Typography>

              <Stack spacing={1.5}>
                {brand.sources.length > 0 ? (
                  brand.sources.map((source) => (
                    <Button
                      key={source.url}
                      component={Link}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="outlined"
                      sx={{
                        justifyContent: "flex-start",
                        minHeight: 54,
                        px: 2.5,
                        borderColor: "rgba(0,0,0,0.1)",
                        color: "#1a1a1a",
                        borderRadius: 3,
                        textTransform: "none",
                        fontWeight: 600,
                        "&:hover": { borderColor: "rgba(0,0,0,0.22)", bgcolor: "transparent" },
                      }}
                    >
                      {source.label}
                    </Button>
                  ))
                ) : (
                  <Typography sx={{ color: "text.secondary", lineHeight: 1.8 }}>
                    No single official brand-wide source was verified for this finish. Use the original supplier sheet, cleaning code, or order paperwork for the exact fabric first.
                  </Typography>
                )}
              </Stack>
            </Grid>

            <Grid item xs={12} lg={5}>
              <Card elevation={0} sx={{ height: "100%", borderRadius: 4, border: "1px solid rgba(0,0,0,0.08)", bgcolor: "#faf9f6" }}>
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Typography
                    variant="overline"
                    sx={{ color: BRAND_ORANGE, letterSpacing: "0.14em", fontWeight: 700, display: "block", mb: 1 }}
                  >
                    Need Confirmation?
                  </Typography>
                  <Typography sx={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "1.8rem", color: "#1a1a1a", mb: 2 }}>
                    Send us the fabric tag before you clean.
                  </Typography>
                  <Typography sx={{ color: "text.secondary", lineHeight: 1.8, mb: 3 }}>
                    If you are not fully sure which finish you have, a quick fabric photo or supplier tag can help us point you to the safest maintenance path.
                  </Typography>
                  <Stack spacing={1.5}>
                    <Button
                      component={Link}
                      href="/contact"
                      variant="contained"
                      size="large"
                      sx={{
                        minHeight: 56,
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
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Divider />
      <Footer />
    </Box>
  );
}
