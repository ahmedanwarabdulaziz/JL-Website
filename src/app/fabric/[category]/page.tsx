import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Box, Button, Container, Grid, Typography, Card, CardContent, Stack, Chip } from "@mui/material";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FABRIC_CATEGORIES, SUPPLIERS } from "@/lib/fabric-categories";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const BRAND_ORANGE = "#f9c349";

type CategoryPageProps = {
  params: Promise<{
    category: string;
  }>;
};

export async function generateStaticParams() {
  return Object.keys(FABRIC_CATEGORIES).map((key) => ({
    category: key,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const data = FABRIC_CATEGORIES[category];

  if (!data) {
    return {
      title: "Fabric Category Not Found",
    };
  }

  return {
    title: `${data.h1} | JL Upholstery`,
    description: data.description,
  };
}

export default async function FabricCategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const data = FABRIC_CATEGORIES[category];

  if (!data) {
    notFound();
  }

  // Get full supplier objects for this category
  const categorySuppliers = data.suppliers
    .map(id => SUPPLIERS.find(s => s.id === id))
    .filter(Boolean) as typeof SUPPLIERS;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": data.h1,
    "description": data.description,
    "provider": {
      "@type": "LocalBusiness",
      "name": "JL Upholstery"
    },
    "brand": categorySuppliers.map(s => ({
      "@type": "Brand",
      "name": s.name
    }))
  };

  return (
    <Box sx={{ minHeight: "100dvh", display: "flex", flexDirection: "column", bgcolor: "#fff" }}>
      <Header />
      
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Box sx={{ bgcolor: "#faf9f6", py: { xs: 4, md: 6 } }}>
        <Container maxWidth="lg" sx={{ px: { xs: 3, md: 6 } }}>
          <Button
            component={Link}
            href="/fabric"
            startIcon={<ArrowBackIcon />}
            sx={{ color: "text.secondary", mb: 4, "&:hover": { bgcolor: "transparent", color: BRAND_ORANGE } }}
          >
            Back to All Fabrics
          </Button>

          <Grid container spacing={{ xs: 6, md: 10 }} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="overline"
                sx={{ color: BRAND_ORANGE, letterSpacing: "0.15em", fontWeight: 700, display: "block", mb: 2 }}
              >
                {data.name}
              </Typography>
              <Typography
                component="h1"
                sx={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: 600,
                  fontSize: { xs: "2.5rem", md: "3.5rem" },
                  lineHeight: 1.1,
                  mb: 3,
                  color: "#1a1a1a"
                }}
              >
                {data.h1}
              </Typography>
              <Typography sx={{ color: "text.secondary", fontSize: "1.125rem", lineHeight: 1.8, mb: 4 }}>
                {data.description}
              </Typography>

              <Box sx={{ mb: 4 }}>
                <Typography sx={{ fontWeight: 700, mb: 2, color: "#1a1a1a" }}>Common Applications:</Typography>
                <Grid container spacing={2}>
                  {data.applications.map((app) => (
                    <Grid item xs={12} sm={6} key={app}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <CheckCircleOutlineIcon sx={{ color: BRAND_ORANGE, fontSize: 20 }} />
                        <Typography sx={{ color: "text.secondary" }}>{app}</Typography>
                      </Stack>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              <Button
                component={Link}
                href={`/contact?interest=${encodeURIComponent(data.name)}`}
                variant="contained"
                size="large"
                sx={{
                  bgcolor: BRAND_ORANGE,
                  color: "#fff",
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  borderRadius: "30px",
                  "&:hover": { bgcolor: "#dfb042" },
                }}
              >
                Request a Quote
              </Button>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  paddingTop: "120%", // Vertical aspect ratio
                  borderRadius: 4,
                  overflow: "hidden",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                }}
              >
                <Box
                  component="img"
                  src={data.image}
                  alt={data.name}
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Recommended Suppliers */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: "#fff" }}>
        <Container maxWidth="lg" sx={{ px: { xs: 3, md: 6 } }}>
          <Box sx={{ mb: 6 }}>
            <Typography
              component="h2"
              sx={{
                fontFamily: "var(--font-heading)",
                fontWeight: 600,
                fontSize: { xs: "2rem", md: "2.5rem" },
                color: "#1a1a1a",
                mb: 2
              }}
            >
              Featured {data.name} Suppliers
            </Typography>
            <Typography sx={{ color: "text.secondary", fontSize: "1.125rem", maxWidth: 600 }}>
              We source our {data.name.toLowerCase()} from these trusted industry leaders to ensure the highest quality for your project.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {categorySuppliers.map((supplier) => (
              <Grid item xs={12} sm={6} md={4} key={supplier.id}>
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    borderRadius: 4,
                    border: "1px solid rgba(0,0,0,0.12)",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
                    display: "flex",
                    flexDirection: "column",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      borderColor: BRAND_ORANGE,
                      boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
                      transform: "translateY(-4px)"
                    }
                  }}
                >
                  <Box
                    sx={{
                      height: 120,
                      bgcolor: "rgba(0,0,0,0.02)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderBottom: "1px solid rgba(0,0,0,0.04)",
                      overflow: "hidden"
                    }}
                  >
                    {supplier.logoUrl ? (
                      <Box component="img" src={supplier.logoUrl} alt={`${supplier.name} logo`} sx={{ width: "100%", height: "100%", objectFit: "cover", p: 0 }} />
                    ) : (
                      <Typography
                        variant="h4"
                        sx={{
                          fontFamily: "var(--font-heading)",
                          fontWeight: 700,
                          color: "rgba(0,0,0,0.2)",
                          letterSpacing: "0.1em"
                        }}
                      >
                        {supplier.logoPlaceholder || supplier.name.substring(0, 3).toUpperCase()}
                      </Typography>
                    )}
                  </Box>
                  <CardContent sx={{ p: 3, flexGrow: 1, display: "flex", flexDirection: "column" }}>
                    <Typography sx={{ fontWeight: 600, fontSize: "1.1rem", color: "#1a1a1a", mb: 0.5 }}>
                      {supplier.name}
                    </Typography>
                    <Typography sx={{ color: "text.secondary", fontSize: "0.9rem", mb: 2, flexGrow: 1 }}>
                      {supplier.specialty}
                    </Typography>
                    {supplier.website && (
                      <Button
                        component="a"
                        href={supplier.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          alignSelf: "flex-start",
                          color: BRAND_ORANGE,
                          fontWeight: 600,
                          p: 0,
                          "&:hover": { bgcolor: "transparent", color: "#d9a532" }
                        }}
                      >
                        Visit Website
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Care Instructions */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: "#faf9f6" }}>
        <Container maxWidth="lg" sx={{ px: { xs: 3, md: 6 } }}>
          <Box
            sx={{
              bgcolor: "#fff",
              p: { xs: 4, md: 6 },
              borderRadius: 4,
              boxShadow: "0 20px 40px rgba(0,0,0,0.04)",
              border: "1px solid rgba(0,0,0,0.05)"
            }}
          >
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={4}>
                <Typography
                  component="h3"
                  sx={{
                    fontFamily: "var(--font-heading)",
                    fontWeight: 600,
                    fontSize: { xs: "1.75rem", md: "2rem" },
                    color: "#1a1a1a",
                    mb: 2
                  }}
                >
                  Basic Care & Maintenance
                </Typography>
                <Button
                  component={Link}
                  href="/fabric-care-guide"
                  variant="outlined"
                  sx={{
                    color: "#1a1a1a",
                    borderColor: "rgba(0,0,0,0.1)",
                    borderRadius: "30px",
                    fontWeight: 600,
                    "&:hover": { borderColor: "rgba(0,0,0,0.3)", bgcolor: "transparent" }
                  }}
                >
                  View Full Care Library
                </Button>
              </Grid>
              <Grid item xs={12} md={8}>
                <Box
                  sx={{
                    p: 4,
                    bgcolor: "rgba(249, 195, 73, 0.05)",
                    borderRadius: 3,
                    borderLeft: `4px solid ${BRAND_ORANGE}`
                  }}
                >
                  <Typography sx={{ color: "text.secondary", lineHeight: 1.8, fontSize: "1.05rem" }}>
                    {data.care}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
