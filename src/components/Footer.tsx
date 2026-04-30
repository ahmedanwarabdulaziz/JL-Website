"use client";

import Link from "next/link";
import { Box, Container, Typography, Link as MuiLink, Stack, useTheme, useMediaQuery } from "@mui/material";

const SITE_NAME = "JL Upholstery";
const BRAND_ORANGE = "#f9c349";

const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/fabric", label: "Fabric" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        bgcolor: "#1a1a1a",
        color: "rgba(255,255,255,0.85)",
      }}
    >
      <Container maxWidth="xl" sx={{ maxWidth: 1320, px: { xs: 3, md: 4 }, py: { xs: 5, md: 6 } }}>
        <Stack
          direction={isMobile ? "column" : "row"}
          spacing={isMobile ? 4 : 0}
          justifyContent="space-between"
          alignItems={isMobile ? "flex-start" : "flex-start"}
          useFlexGap
          sx={{ gap: isMobile ? 4 : 6 }}
        >
          <Box sx={{ maxWidth: 280 }}>
            <Typography
              component={Link}
              href="/"
              variant="h6"
              sx={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontWeight: 600,
                color: "#fff",
                textDecoration: "none",
                display: "block",
                letterSpacing: "0.02em",
                mb: 1.5,
              }}
            >
              {SITE_NAME}
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.7, letterSpacing: "0.02em" }}>
              Bringing furniture value and a well-furnished life to every home.
            </Typography>
          </Box>

          <Box>
            <Typography variant="overline" sx={{ color: "rgba(255,255,255,0.5)", letterSpacing: "0.2em", fontWeight: 600, display: "block", mb: 2 }}>
              Quick links
            </Typography>
            <Stack spacing={1.25}>
              {QUICK_LINKS.map(({ href, label }) => (
                <MuiLink
                  key={href}
                  component={Link}
                  href={href}
                  sx={{
                    color: "rgba(255,255,255,0.85)",
                    textDecoration: "none",
                    fontSize: "0.9rem",
                    letterSpacing: "0.03em",
                    "&:hover": { color: BRAND_ORANGE },
                    transition: "color 0.2s ease",
                  }}
                >
                  {label}
                </MuiLink>
              ))}
            </Stack>
          </Box>

          <Box>
            <Typography variant="overline" sx={{ color: "rgba(255,255,255,0.5)", letterSpacing: "0.2em", fontWeight: 600, display: "block", mb: 2 }}>
              Get in touch
            </Typography>
            <Stack spacing={1.25}>
              <MuiLink component={Link} href="/contact" sx={{ color: "rgba(255,255,255,0.85)", textDecoration: "none", fontSize: "0.9rem", "&:hover": { color: BRAND_ORANGE } }}>
                Contact us
              </MuiLink>
              <MuiLink component={Link} href="/login" sx={{ color: "rgba(255,255,255,0.65)", textDecoration: "none", fontSize: "0.85rem", "&:hover": { color: BRAND_ORANGE } }}>
                Login
              </MuiLink>
              <MuiLink component={Link} href="/admin" sx={{ color: "rgba(255,255,255,0.65)", textDecoration: "none", fontSize: "0.85rem", "&:hover": { color: BRAND_ORANGE } }}>
                Admin
              </MuiLink>
            </Stack>
          </Box>
        </Stack>

        <Box sx={{ borderTop: "1px solid rgba(255,255,255,0.08)", mt: { xs: 4, md: 5 }, pt: 3 }}>
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.5)", letterSpacing: "0.03em" }}>
            © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
