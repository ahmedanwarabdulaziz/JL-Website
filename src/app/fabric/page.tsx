"use client";

import { Box, Container, Typography, Grid, Stack, Button, Card, CardContent } from "@mui/material";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useQuotationModal } from "@/contexts/QuotationModalContext";
import Link from "next/link";
import React from 'react';
import { FABRIC_CATEGORIES, SUPPLIERS } from "@/lib/fabric-categories";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';

const BRAND_ORANGE = "#f9c349";

export default function FabricPage() {
  const { openQuotationModal } = useQuotationModal();

  // Tier separation for rendering
  const tier1 = SUPPLIERS.filter(s => s.tier === 1);
  const tier2 = SUPPLIERS.filter(s => s.tier === 2);
  const tier3 = SUPPLIERS.filter(s => s.tier === 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "JL Upholstery Fabric Suppliers",
    "description": "Our trusted network of professional upholstery fabric, leather, and vinyl suppliers across Canada and internationally.",
    "itemListElement": SUPPLIERS.map((s, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Brand",
        "name": s.name,
        "url": s.website
      }
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

      {/* Hero Section */}
      <Box
        component="section"
        sx={{
          position: "relative",
          height: { xs: "auto", md: "85vh" },
          minHeight: { xs: 600, md: 600 },
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
            backgroundImage: `url(/images/05.jpeg)`,
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
            background: "linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.2) 100%)",
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
              Premium Upholstery Materials
            </Typography>

            <Typography
              component="h1"
              sx={{
                fontFamily: "var(--font-heading)",
                fontWeight: 700,
                fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.5rem", lg: "5rem" },
                lineHeight: { xs: 1.15, md: 1.1 },
                letterSpacing: "-0.02em",
                mb: 3,
                textShadow: "0 2px 20px rgba(0,0,0,0.5)",
              }}
            >
              Fabric is Our <span style={{ color: BRAND_ORANGE, fontStyle: "italic", fontWeight: 600 }}>Specialty</span>
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: "1rem", md: "1.25rem" },
                fontWeight: 500,
                color: "#fff",
                lineHeight: { xs: 1.5, md: 1.4 },
                mb: 3,
                fontFamily: "var(--font-heading)",
                borderLeft: `4px solid ${BRAND_ORANGE}`,
                pl: { xs: 2, md: 3 },
                py: 0.5,
                textShadow: "0 1px 10px rgba(0,0,0,0.5)",
              }}
            >
              Over 25,000 options of material available. Access the industry's most trusted suppliers for residential, commercial, and marine upholstery.
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ xs: "stretch", sm: "center" }} sx={{ mt: 5 }}>
              <Button
                variant="contained"
                size="large"
                onClick={openQuotationModal}
                sx={{
                  bgcolor: BRAND_ORANGE,
                  color: "#fff",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  px: { xs: 3, md: 4 },
                  py: { xs: 1.5, md: 2 },
                  fontSize: { xs: "0.875rem", md: "0.9375rem" },
                  borderRadius: "30px",
                  "&:hover": { bgcolor: "#dfb042" },
                }}
              >
                Request Your Quote Now
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Material Categories Grid */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: "#fff" }} id="materials">
        <Container maxWidth="lg" sx={{ px: { xs: 3, md: 6 } }}>
          <Box sx={{ textAlign: "center", mb: { xs: 6, md: 8 } }}>
            <Typography
              variant="overline"
              sx={{ color: BRAND_ORANGE, letterSpacing: "0.15em", fontWeight: 700, display: "block", mb: 2 }}
            >
              Explore By Type
            </Typography>
            <Typography
              component="h2"
              sx={{
                fontFamily: "var(--font-heading)",
                fontWeight: 600,
                color: "#1a1a1a",
                fontSize: { xs: "2rem", md: "3rem" },
                letterSpacing: "0.01em",
                mb: 2,
              }}
            >
              Browse Upholstery Materials
            </Typography>
            <Typography sx={{ color: "text.secondary", fontSize: "1.125rem", maxWidth: 600, mx: "auto" }}>
              Find the perfect fabric for your project. Select a category below to explore options, applications, and recommended suppliers.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {Object.values(FABRIC_CATEGORIES).map((category) => (
              <Grid item xs={12} sm={6} md={4} key={category.id}>
                  <Card 
                    component={Link}
                    href={`/fabric/${category.id}`}
                    elevation={0}
                    sx={{ 
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      border: "1px solid rgba(0,0,0,0.12)",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
                      borderRadius: "16px",
                      textDecoration: "none",
                      color: "inherit",
                      transition: "all 0.3s ease",
                      overflow: "hidden",
                      "&:hover": {
                        borderColor: BRAND_ORANGE,
                        boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
                        transform: "translateY(-4px)"
                      }
                    }}
                  >
                  <Box
                    sx={{
                      height: 200,
                      backgroundImage: `url("${category.image}")`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      borderBottom: "1px solid rgba(0,0,0,0.05)"
                    }}
                  />
                  <CardContent sx={{ p: 4, flexGrow: 1, display: "flex", flexDirection: "column" }}>
                    <Typography 
                      variant="h5" 
                      component="h3" 
                      sx={{ 
                        fontFamily: "var(--font-heading)", 
                        fontWeight: 600,
                        color: "#1a1a1a",
                        mb: 1.5
                      }}
                    >
                      {category.name}
                    </Typography>
                    <Typography 
                      sx={{ 
                        color: "text.secondary", 
                        fontSize: "0.95rem",
                        lineHeight: 1.6,
                        mb: 3
                      }}
                    >
                      {category.description}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: "auto", color: BRAND_ORANGE }}>
                      <Typography sx={{ fontWeight: 600, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Explore {category.name}</Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Supplier Directory Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: "#faf9f6" }} id="suppliers">
        <Container maxWidth="lg" sx={{ px: { xs: 3, md: 6 } }}>
          <Box sx={{ textAlign: "center", mb: { xs: 6, md: 10 } }}>
            <Typography
              variant="overline"
              sx={{ color: BRAND_ORANGE, letterSpacing: "0.15em", fontWeight: 700, display: "block", mb: 2 }}
            >
              Our Partners
            </Typography>
            <Typography
              component="h2"
              sx={{
                fontFamily: "var(--font-heading)",
                fontWeight: 600,
                color: "#1a1a1a",
                fontSize: { xs: "2rem", md: "3rem" },
                mb: 2,
              }}
            >
              Professional Fabric Suppliers
            </Typography>
            <Typography sx={{ color: "text.secondary", fontSize: "1.125rem", maxWidth: 700, mx: "auto" }}>
              We partner with the industry's most respected textile houses and distributors to offer you an unparalleled selection of high-quality materials.
            </Typography>
          </Box>

          {/* Tier 1 - Premium */}
          <Box sx={{ mb: 8 }}>
            <Typography sx={{ fontFamily: "var(--font-heading)", fontSize: "1.75rem", fontWeight: 600, mb: 4, color: "#1a1a1a", textAlign: "center" }}>
              International Premium Brands
            </Typography>
            <Grid container spacing={4} justifyContent="center">
              {tier1.map(supplier => (
                <Grid item xs={12} sm={6} md={4} key={supplier.id}>
                  <Card elevation={0} sx={{ height: "100%", borderRadius: 4, border: "1px solid rgba(0,0,0,0.12)", boxShadow: "0 10px 30px rgba(0,0,0,0.03)", transition: "all 0.3s ease", "&:hover": { borderColor: BRAND_ORANGE, boxShadow: "0 15px 40px rgba(0,0,0,0.08)", transform: "translateY(-4px)" } }}>
                    <Box sx={{ height: 140, bgcolor: "#fff", display: "flex", alignItems: "center", justifyContent: "center", borderBottom: "1px solid rgba(0,0,0,0.04)", overflow: "hidden" }}>
                      {supplier.logoUrl ? (
                        <Box component="img" src={supplier.logoUrl} alt={`${supplier.name} logo`} sx={{ width: "100%", height: "100%", objectFit: "cover", p: 0 }} />
                      ) : (
                        <Typography variant="h3" sx={{ fontFamily: "var(--font-heading)", fontWeight: 700, color: "rgba(0,0,0,0.15)", letterSpacing: "0.1em" }}>
                          {supplier.logoPlaceholder || supplier.name.substring(0,3).toUpperCase()}
                        </Typography>
                      )}
                    </Box>
                    <CardContent sx={{ p: 4, textAlign: "center" }}>
                      <Typography sx={{ fontWeight: 700, fontSize: "1.25rem", color: "#1a1a1a", mb: 1 }}>{supplier.name}</Typography>
                      <Typography sx={{ color: "text.secondary", fontSize: "0.95rem", mb: 3 }}>{supplier.specialty}</Typography>
                      {supplier.website && (
                        <Button
                          component="a"
                          href={supplier.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          endIcon={<OpenInNewIcon fontSize="small" />}
                          sx={{ color: BRAND_ORANGE, fontWeight: 600, "&:hover": { bgcolor: "transparent" } }}
                        >
                          Visit Website
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Tier 2 - Established Distributors */}
          <Box sx={{ mb: 8 }}>
            <Typography sx={{ fontFamily: "var(--font-heading)", fontSize: "1.75rem", fontWeight: 600, mb: 4, color: "#1a1a1a", textAlign: "center" }}>
              Canadian Wholesale Distributors
            </Typography>
            <Grid container spacing={3}>
              {tier2.map(supplier => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={supplier.id}>
                  <Card elevation={0} sx={{ height: "100%", borderRadius: 4, border: "1px solid rgba(0,0,0,0.12)", boxShadow: "0 10px 30px rgba(0,0,0,0.03)", transition: "all 0.3s ease", display: "flex", flexDirection: "column", "&:hover": { borderColor: BRAND_ORANGE, boxShadow: "0 15px 40px rgba(0,0,0,0.08)", transform: "translateY(-4px)" } }}>
                    <Box sx={{ height: 120, bgcolor: "#fff", display: "flex", alignItems: "center", justifyContent: "center", borderBottom: "1px solid rgba(0,0,0,0.04)", overflow: "hidden" }}>
                      {supplier.logoUrl ? (
                        <Box component="img" src={supplier.logoUrl} alt={`${supplier.name} logo`} sx={{ width: "100%", height: "100%", objectFit: "cover", p: 0 }} />
                      ) : (
                        <Typography variant="h4" sx={{ fontFamily: "var(--font-heading)", fontWeight: 700, color: "rgba(0,0,0,0.15)", letterSpacing: "0.1em" }}>
                          {supplier.logoPlaceholder || supplier.name.substring(0,3).toUpperCase()}
                        </Typography>
                      )}
                    </Box>
                    <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", flexGrow: 1 }}>
                      <Typography sx={{ fontWeight: 600, color: "#1a1a1a", mb: 0.5 }}>{supplier.name}</Typography>
                      <Typography sx={{ color: "text.secondary", fontSize: "0.85rem", mb: 2, flexGrow: 1 }}>{supplier.specialty}</Typography>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        {supplier.location && (
                          <Typography sx={{ fontSize: "0.75rem", color: "rgba(0,0,0,0.4)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            {supplier.location}
                          </Typography>
                        )}
                        {supplier.website && (
                          <Button
                            component="a"
                            href={supplier.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ minWidth: "auto", p: 0.5, color: "text.secondary", "&:hover": { color: BRAND_ORANGE, bgcolor: "transparent" } }}
                          >
                            <OpenInNewIcon fontSize="small" />
                          </Button>
                        )}
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Tier 3 - Specialty */}
          <Box>
            <Typography sx={{ fontFamily: "var(--font-heading)", fontSize: "1.75rem", fontWeight: 600, mb: 4, color: "#1a1a1a", textAlign: "center" }}>
              Specialty & Leather Partners
            </Typography>
            <Grid container spacing={3} justifyContent="center">
              {tier3.map(supplier => (
                <Grid item xs={12} sm={6} md={4} key={supplier.id}>
                  <Card elevation={0} sx={{ height: "100%", borderRadius: 4, border: "1px solid rgba(0,0,0,0.12)", boxShadow: "0 10px 30px rgba(0,0,0,0.03)", transition: "all 0.3s ease", display: "flex", flexDirection: "column", "&:hover": { borderColor: BRAND_ORANGE, boxShadow: "0 15px 40px rgba(0,0,0,0.08)", transform: "translateY(-4px)" } }}>
                    <Box sx={{ height: 100, bgcolor: "#fff", display: "flex", alignItems: "center", justifyContent: "center", borderBottom: "1px solid rgba(0,0,0,0.04)", overflow: "hidden" }}>
                      {supplier.logoUrl ? (
                        <Box component="img" src={supplier.logoUrl} alt={`${supplier.name} logo`} sx={{ width: "100%", height: "100%", objectFit: "cover", p: 0 }} />
                      ) : (
                        <Typography variant="h4" sx={{ fontFamily: "var(--font-heading)", fontWeight: 700, color: "rgba(0,0,0,0.15)", letterSpacing: "0.1em" }}>
                          {supplier.logoPlaceholder || supplier.name.substring(0,3).toUpperCase()}
                        </Typography>
                      )}
                    </Box>
                    <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", flexGrow: 1 }}>
                      <Typography sx={{ fontWeight: 600, color: "#1a1a1a", mb: 0.5 }}>{supplier.name}</Typography>
                      <Typography sx={{ color: "text.secondary", fontSize: "0.85rem", mb: 2 }}>{supplier.specialty}</Typography>
                      {supplier.website && (
                        <Button
                          component="a"
                          href={supplier.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ minWidth: "auto", p: 0, color: BRAND_ORANGE, fontSize: "0.85rem", fontWeight: 600, "&:hover": { bgcolor: "transparent" } }}
                        >
                          Website <OpenInNewIcon sx={{ fontSize: 14, ml: 0.5 }} />
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

        </Container>
      </Box>

      {/* Fabric Maintenance CTA Section */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: "#fff" }}>
        <Container maxWidth="lg" sx={{ px: { xs: 3, md: 6 } }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={6} alignItems="center">
            <Box sx={{ flex: 1 }}>
              <Typography
                component="h2"
                sx={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: 600,
                  color: "#1a1a1a",
                  fontSize: { xs: "2rem", sm: "2.5rem" },
                  mb: 3,
                }}
              >
                Fabric Maintenance Library
              </Typography>
              <Typography
                sx={{
                  color: "text.secondary",
                  fontSize: "1.125rem",
                  fontFamily: "var(--font-body)",
                  lineHeight: 1.8,
                  mb: 4,
                }}
              >
                Explore our dedicated Fabric Maintenance Library for source-backed care guidance on Alta, Crypton, Endurepel, FibreGuard, and other performance upholstery finishes. Keep your investment looking pristine for years to come.
              </Typography>
              <Button
                component={Link}
                href="/fabric-care-guide"
                variant="outlined"
                size="large"
                sx={{
                  minHeight: 56,
                  color: "#1a1a1a",
                  borderColor: "rgba(0,0,0,0.1)",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  fontSize: "0.875rem",
                  borderRadius: "30px",
                  "&:hover": { 
                    borderColor: "rgba(0,0,0,0.3)",
                    bgcolor: "transparent"
                  },
                }}
              >
                View Maintenance Library
              </Button>
            </Box>
            <Box sx={{ flex: 1, position: "relative" }}>
              <Box
                sx={{
                  width: "100%",
                  paddingTop: "75%",
                  backgroundImage: `url("/images/12.jpeg")`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: "16px",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                }}
              />
            </Box>
          </Stack>
        </Container>
      </Box>

      {/* Global CTA Section */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: "#faf9f6", color: "#1a1a1a", borderTop: "1px solid rgba(0,0,0,0.05)" }}>
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
