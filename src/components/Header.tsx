"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AppBar,
  Toolbar,
  Container,
  Button,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Collapse,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import PhoneIcon from "@mui/icons-material/Phone";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import React, { useState } from "react";
import { useQuotationModal } from "@/contexts/QuotationModalContext";

const LOGO_SRC = "/images/JL%20Logo.png";
const BRAND_ORANGE = "#f9c349";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/commercial", label: "Commercial" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Project Explorer" },
  { 
    href: "/fabric", 
    label: "Fabric",
    subLinks: [
      { href: "/fabric-care-guide", label: "Fabric Care Guide" }
    ]
  },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

function getPageTitle(pathname: string): string {
  for (const link of NAV_LINKS) {
    if (link.href === pathname) return link.label;
    if (link.subLinks) {
      for (const subLink of link.subLinks) {
        if (subLink.href === pathname) return subLink.label;
      }
    }
  }
  return pathname === "/" ? "Home" : pathname.slice(1).replace(/-/g, " ");
}

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { openQuotationModal } = useQuotationModal();

  const ctaButtons = (
    <Stack direction="row" alignItems="center" gap={1.5} sx={{ flexShrink: 0 }}>
      <Button
        component={Link}
        href="/contact"
        variant="outlined"
        size="medium"
        startIcon={<PhoneIcon sx={{ fontSize: 18 }} />}
        sx={{
          fontWeight: 600,
          color: "#1a1a1a",
          borderColor: "rgba(26,26,26,0.3)",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          fontSize: "0.7rem",
          px: 2,
          "&:hover": { borderColor: BRAND_ORANGE, color: BRAND_ORANGE, bgcolor: "transparent" },
        }}
      >
        Call Now
      </Button>
      <Button
        onClick={openQuotationModal}
        variant="contained"
        size="medium"
        startIcon={<RequestQuoteIcon sx={{ fontSize: 18 }} />}
        sx={{
          fontWeight: 600,
          bgcolor: BRAND_ORANGE,
          color: "#fff",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          fontSize: "0.7rem",
          px: 2,
          boxShadow: "none",
          "&:hover": { bgcolor: "#dfb042", boxShadow: "none" },
        }}
      >
        Request quotation
      </Button>
    </Stack>
  );

  return (
    <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "#faf9f6",
          color: "#1a1a1a",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          boxShadow: "0 1px 0 rgba(255,255,255,0.9)",
        }}
      >
        <Container maxWidth="xl" disableGutters sx={{ maxWidth: 1320, mx: "auto", px: { xs: 2, md: 4 }, overflow: "visible" }}>
          <Toolbar
            disableGutters
            sx={{
              minHeight: { xs: 64, md: 80 },
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              gap: 2,
              overflow: "visible",
            }}
          >
            <Box component={Link} href="/" sx={{ display: "flex", alignItems: "center", textDecoration: "none", flexShrink: 0 }} onClick={() => setMobileOpen(false)}>
              <Box component="img" src={LOGO_SRC} alt="JL Upholstery" sx={{ height: { xs: 46, md: 56 }, width: "auto", display: "block" }} />
            </Box>

            {/* Desktop nav */}
            <Box
              component="nav"
              aria-label="Main navigation"
              sx={{
                display: { xs: "none", sm: "flex" },
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                minWidth: 0,
                gap: 0,
              }}
            >
              {NAV_LINKS.map(({ href, label, subLinks }) => {
                const isActive = pathname === href || (subLinks && subLinks.some(s => pathname === s.href));
                return (
                  <Box
                    key={href}
                    sx={{ position: "relative", "&:hover .dropdown": { display: "block" } }}
                  >
                    <Box
                      component={Link}
                      href={href}
                      sx={{
                        display: "inline-block",
                        px: 2,
                        py: 1.5,
                        color: isActive ? BRAND_ORANGE : "#1a1a1a",
                        fontWeight: 500,
                        fontSize: "0.75rem",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        textDecoration: "none",
                        borderBottom: isActive ? "2px solid" : "2px solid transparent",
                        borderColor: BRAND_ORANGE,
                        whiteSpace: "nowrap",
                        "&:hover": { color: BRAND_ORANGE },
                      }}
                    >
                      {label}
                    </Box>
                    {subLinks && (
                      <Box
                        className="dropdown"
                        sx={{
                          display: "none",
                          position: "absolute",
                          top: "100%",
                          left: 0,
                          minWidth: 200,
                          bgcolor: "#fff",
                          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                          borderRadius: 2,
                          py: 1,
                          zIndex: 10,
                          border: "1px solid rgba(0,0,0,0.05)"
                        }}
                      >
                        {subLinks.map(sub => (
                          <Box
                            key={sub.href}
                            component={Link}
                            href={sub.href}
                            sx={{
                              display: "block",
                              px: 3,
                              py: 1.5,
                              color: pathname === sub.href ? BRAND_ORANGE : "#1a1a1a",
                              textDecoration: "none",
                              fontSize: "0.8rem",
                              fontWeight: 500,
                              "&:hover": { bgcolor: "rgba(249, 195, 73, 0.05)", color: BRAND_ORANGE }
                            }}
                          >
                            {sub.label}
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Box>
                );
              })}
            </Box>

            {/* Desktop CTA */}
            <Box sx={{ display: { xs: "none", sm: "flex" }, flexShrink: 0 }}>
              {ctaButtons}
            </Box>

            {/* Mobile: menu toggle button */}
            <Box sx={{ display: { xs: "flex", sm: "none" }, alignItems: "center", flexShrink: 0 }}>
              <button
                type="button"
                onClick={() => setMobileOpen((o) => !o)}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 48,
                  height: 48,
                  padding: 0,
                  margin: 0,
                  border: "none",
                  background: "transparent",
                  color: "#1a1a1a",
                  cursor: "pointer",
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                {mobileOpen ? <CloseIcon /> : <MenuIcon />}
              </button>
            </Box>
          </Toolbar>

          {/* Mobile: collapsible nav panel (no Modal, in document flow) */}
          <Collapse in={mobileOpen} sx={{ display: { sm: "none" } }}>
            <Box
              sx={{
                px: 2,
                pb: 3,
                pt: 0,
                borderTop: "1px solid rgba(0,0,0,0.08)",
                bgcolor: "#faf9f6",
              }}
            >
              <List disablePadding>
                {NAV_LINKS.map(({ href, label, subLinks }) => (
                  <React.Fragment key={href}>
                    <ListItem disablePadding>
                      <Link href={href} style={{ textDecoration: "none", width: "100%", color: "inherit" }} onClick={() => setMobileOpen(false)}>
                        <ListItemButton
                          component="div"
                          sx={{
                            color: pathname === href ? BRAND_ORANGE : "#1a1a1a",
                            py: 2,
                            minHeight: 52,
                            fontWeight: pathname === href || (subLinks && subLinks.some(s => pathname === s.href)) ? 600 : 500,
                            fontSize: "1rem",
                          }}
                        >
                          <ListItemText primary={label} primaryTypographyProps={{ fontWeight: "inherit" }} />
                        </ListItemButton>
                      </Link>
                    </ListItem>
                    {subLinks && subLinks.map((sub) => (
                      <ListItem key={sub.href} disablePadding>
                        <Link href={sub.href} style={{ textDecoration: "none", width: "100%", color: "inherit" }} onClick={() => setMobileOpen(false)}>
                          <ListItemButton
                            component="div"
                            sx={{
                              color: pathname === sub.href ? BRAND_ORANGE : "rgba(26,26,26,0.7)",
                              py: 1.5,
                              pl: 4,
                              minHeight: 48,
                              fontWeight: pathname === sub.href ? 600 : 400,
                              fontSize: "0.95rem",
                            }}
                          >
                            <ListItemText primary={sub.label} primaryTypographyProps={{ fontWeight: "inherit" }} />
                          </ListItemButton>
                        </Link>
                      </ListItem>
                    ))}
                  </React.Fragment>
                ))}
              </List>
              <Stack direction="column" spacing={2} sx={{ mt: 2 }}>
                <Link href="/contact" style={{ textDecoration: "none" }} onClick={() => setMobileOpen(false)}>
                  <Button variant="outlined" fullWidth startIcon={<PhoneIcon />} sx={{ color: "#1a1a1a", borderColor: "rgba(26,26,26,0.3)", minHeight: 48 }}>
                    Call Now
                  </Button>
                </Link>
                <Button variant="contained" fullWidth startIcon={<RequestQuoteIcon />} onClick={() => { setMobileOpen(false); openQuotationModal(); }} sx={{ bgcolor: BRAND_ORANGE, "&:hover": { bgcolor: "#dfb042" }, minHeight: 48 }}>
                  Request quotation
                </Button>
              </Stack>
            </Box>
          </Collapse>
        </Container>
    </AppBar>
  );
}
