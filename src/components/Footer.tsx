"use client";

import Link from "next/link";
import { Box, Container, Typography, Link as MuiLink, Stack, useTheme, useMediaQuery, Grid, IconButton, Button } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import PinterestIcon from "@mui/icons-material/Pinterest";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useQuotationModal } from "@/contexts/QuotationModalContext";

const SITE_NAME = "JL Upholstery";
const BRAND_ORANGE = "#f9c349";
const LOGO_SRC = "/images/JL%20Logo.png";

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/commercial", label: "Commercial" },
  { href: "/projects", label: "Projects" },
  { href: "/fabric", label: "Fabric" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { openQuotationModal } = useQuotationModal();

  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        background: "linear-gradient(180deg, #111111 0%, #080808 100%)",
        color: "rgba(255,255,255,0.85)",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: `linear-gradient(90deg, ${BRAND_ORANGE} 0%, #ff8c00 100%)`,
        }
      }}
    >
      <Container maxWidth="xl" sx={{ maxWidth: 1320, px: { xs: 3, md: 4 }, pt: { xs: 10, md: 12 }, pb: { xs: 6, md: 6 } }}>
        <Grid container spacing={{ xs: 8, md: 6, lg: 8 }} justifyContent="space-between">
          
          {/* Brand Block */}
          <Grid item xs={12} md={3.5} lg={3}>
            <Box sx={{ mb: { xs: 1, md: 3 } }}>
              <Box component={Link} href="/" sx={{ 
                display: "inline-flex", 
                alignItems: "center",
                justifyContent: "center",
                mb: 4, 
                bgcolor: "rgba(255, 255, 255, 0.95)", 
                p: 1.5, 
                borderRadius: 2,
                boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                transition: "transform 0.3s ease",
                "&:hover": { transform: "translateY(-4px)" }
              }}>
                <Box component="img" src={LOGO_SRC} alt="JL Upholstery" sx={{ height: 48, width: "auto", display: "block" }} />
              </Box>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)", lineHeight: 1.8, mb: 3, fontSize: "0.95rem" }}>
                With over <strong style={{ color: "#fff", fontWeight: 600 }}>30 years</strong> of family legacy, we provide premium custom upholstery and furniture restoration.
              </Typography>
              <Box sx={{ 
                bgcolor: "rgba(255,255,255,0.03)", 
                borderLeft: `3px solid ${BRAND_ORANGE}`,
                p: 2, 
                borderRadius: "0 8px 8px 0"
              }}>
                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.6, fontSize: "0.85rem" }}>
                  Quality materials. Expert craftsmanship.<br />Pickup & delivery available.<br />
                  Proudly serving the <strong style={{ color: "#fff" }}>Greater Toronto Area (GTA)</strong>.
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Contact Block */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="overline" sx={{ color: BRAND_ORANGE, letterSpacing: "0.15em", fontWeight: 700, display: "inline-block", mb: 4, position: "relative", "&::after": { content: '""', position: "absolute", bottom: -4, left: 0, width: "24px", height: "2px", bgcolor: BRAND_ORANGE, borderRadius: 1 } }}>
              Contact Us
            </Typography>
            <Stack spacing={3.5}>
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <Box sx={{ bgcolor: "rgba(249,195,73,0.1)", p: 1, borderRadius: 1.5, color: BRAND_ORANGE, mt: -0.5 }}>
                  <LocationOnIcon sx={{ fontSize: 20 }} />
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)", fontWeight: 500, mb: 0.5 }}>Milton, Ontario</Typography>
                  <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)", display: "block" }}>(By Appointment Only)</Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{ bgcolor: "rgba(249,195,73,0.1)", p: 1, borderRadius: 1.5, color: BRAND_ORANGE }}>
                  <PhoneIcon sx={{ fontSize: 20 }} />
                </Box>
                <MuiLink href="tel:+14165550198" sx={{ color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: "0.95rem", fontWeight: 500, transition: "color 0.2s", "&:hover": { color: BRAND_ORANGE } }}>
                  (416) 555-0198
                </MuiLink>
              </Stack>

              <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{ bgcolor: "rgba(249,195,73,0.1)", p: 1, borderRadius: 1.5, color: BRAND_ORANGE }}>
                  <EmailIcon sx={{ fontSize: 20 }} />
                </Box>
                <MuiLink href="mailto:info@jlupholstery.ca" sx={{ color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: "0.95rem", fontWeight: 500, transition: "color 0.2s", "&:hover": { color: BRAND_ORANGE } }}>
                  info@jlupholstery.ca
                </MuiLink>
              </Stack>

              <Stack direction="row" spacing={2} alignItems="flex-start">
                <Box sx={{ bgcolor: "rgba(255,255,255,0.05)", p: 1, borderRadius: 1.5, color: "rgba(255,255,255,0.7)", mt: -0.5 }}>
                  <AccessTimeIcon sx={{ fontSize: 20 }} />
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem", mb: 0.5 }}>Mon - Fri: 9:00 AM - 5:00 PM</Typography>
                  <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem" }}>Sat - Sun: Closed</Typography>
                </Box>
              </Stack>
            </Stack>
          </Grid>

          {/* Navigation Block */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="overline" sx={{ color: BRAND_ORANGE, letterSpacing: "0.15em", fontWeight: 700, display: "inline-block", mb: 4, position: "relative", "&::after": { content: '""', position: "absolute", bottom: -4, left: 0, width: "24px", height: "2px", bgcolor: BRAND_ORANGE, borderRadius: 1 } }}>
              Explore
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {NAV_LINKS.map(({ href, label }) => (
                <MuiLink
                  key={href}
                  component={Link}
                  href={href}
                  sx={{
                    color: "rgba(255,255,255,0.65)",
                    textDecoration: "none",
                    fontSize: "0.95rem",
                    display: "flex",
                    alignItems: "center",
                    py: 0.5,
                    "&:hover": { 
                      color: "#fff", 
                      transform: "translateX(6px)"
                    },
                    "&:hover > svg": {
                      opacity: 1,
                      ml: 0,
                      mr: 1,
                      color: BRAND_ORANGE
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  <ChevronRightIcon sx={{ fontSize: 18, opacity: 0, ml: -2.5, transition: "all 0.2s" }} />
                  {label}
                </MuiLink>
              ))}
            </Box>
          </Grid>

          {/* Social/Proof Block */}
          <Grid item xs={12} md={3.5} lg={3}>
            <Typography variant="overline" sx={{ color: BRAND_ORANGE, letterSpacing: "0.15em", fontWeight: 700, display: "inline-block", mb: 4, position: "relative", "&::after": { content: '""', position: "absolute", bottom: -4, left: 0, width: "24px", height: "2px", bgcolor: BRAND_ORANGE, borderRadius: 1 } }}>
              Connect
            </Typography>
            <Stack direction="row" spacing={1.5} sx={{ mb: 4 }}>
              <IconButton size="small" sx={{ bgcolor: "rgba(255,255,255,0.05)", color: "#fff", transition: "all 0.3s ease", "&:hover": { bgcolor: BRAND_ORANGE, color: "#111", transform: "translateY(-3px)" } }}>
                <InstagramIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ bgcolor: "rgba(255,255,255,0.05)", color: "#fff", transition: "all 0.3s ease", "&:hover": { bgcolor: BRAND_ORANGE, color: "#111", transform: "translateY(-3px)" } }}>
                <FacebookIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ bgcolor: "rgba(255,255,255,0.05)", color: "#fff", transition: "all 0.3s ease", "&:hover": { bgcolor: BRAND_ORANGE, color: "#111", transform: "translateY(-3px)" } }}>
                <PinterestIcon fontSize="small" />
              </IconButton>
            </Stack>
            
            <Box sx={{ bgcolor: "rgba(255,255,255,0.02)", p: 3, borderRadius: 3, border: "1px solid rgba(255,255,255,0.05)" }}>
              <Typography variant="body2" sx={{ color: "#fff", mb: 0.5, fontWeight: 600 }}>
                Ready to transform your piece?
              </Typography>
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)", display: "block", mb: 3 }}>
                Get an estimate or send us photos.
              </Typography>
              
              <Stack spacing={1.5}>
                <Button
                  onClick={openQuotationModal}
                  variant="contained"
                  fullWidth
                  startIcon={<RequestQuoteIcon />}
                  sx={{
                    bgcolor: BRAND_ORANGE,
                    color: "#111",
                    fontWeight: 700,
                    py: 1.2,
                    boxShadow: "0 4px 14px rgba(249, 195, 73, 0.2)",
                    "&:hover": { bgcolor: "#dfb042", boxShadow: "0 6px 20px rgba(249, 195, 73, 0.3)", transform: "translateY(-1px)" },
                    transition: "all 0.2s ease"
                  }}
                >
                  Request a Quote
                </Button>
                <Button
                  onClick={openQuotationModal}
                  variant="outlined"
                  fullWidth
                  startIcon={<CameraAltIcon />}
                  sx={{
                    borderColor: "rgba(255,255,255,0.15)",
                    color: "#fff",
                    fontWeight: 600,
                    py: 1.2,
                    "&:hover": { borderColor: "#fff", bgcolor: "rgba(255,255,255,0.05)" },
                  }}
                >
                  Send Photos
                </Button>
              </Stack>
            </Box>
          </Grid>
        </Grid>

        {/* Sub-footer */}
        <Box sx={{ borderTop: "1px solid rgba(255,255,255,0.08)", mt: { xs: 6, md: 8 }, pt: 4, display: "flex", flexDirection: { xs: "column", md: "row" }, justifyContent: "space-between", alignItems: "center", gap: 3 }}>
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.4)", textAlign: { xs: "center", md: "left" } }}>
            © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </Typography>
          <Stack direction="row" spacing={3} alignItems="center" justifyContent="center" sx={{ flexWrap: "wrap", gap: { xs: 2, md: 0 } }}>
            <MuiLink component={Link} href="/privacy-policy" sx={{ color: "rgba(255,255,255,0.4)", textDecoration: "none", fontSize: "0.85rem", transition: "color 0.2s", "&:hover": { color: "#fff" } }}>
              Privacy Policy
            </MuiLink>
            <MuiLink component={Link} href="/terms" sx={{ color: "rgba(255,255,255,0.4)", textDecoration: "none", fontSize: "0.85rem", transition: "color 0.2s", "&:hover": { color: "#fff" } }}>
              Terms of Service
            </MuiLink>
            <Box sx={{ width: "4px", height: "4px", borderRadius: "50%", bgcolor: "rgba(255,255,255,0.2)", display: { xs: "none", md: "block" }, mx: 1 }} />
            <MuiLink component={Link} href="/login" sx={{ color: "rgba(255,255,255,0.2)", textDecoration: "none", fontSize: "0.85rem", transition: "color 0.2s", "&:hover": { color: "#fff" } }}>
              Staff Login
            </MuiLink>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}

