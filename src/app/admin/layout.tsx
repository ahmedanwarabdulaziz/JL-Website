"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme,
  CircularProgress,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LabelIcon from "@mui/icons-material/Label";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "@/contexts/AuthContext";

const SIDEBAR_WIDTH_MOBILE = 280;
const SIDEBAR_WIDTH_DESKTOP = 280;
const MAIN_MAX_WIDTH = 900;

const navItems = [
  { href: "/admin", label: "Dashboard", icon: <DashboardIcon /> },
  { href: "/admin/pieces", label: "Gallery", icon: <PhotoLibraryIcon /> },
  { href: "/admin/tags", label: "Tag system", icon: <LabelIcon /> },
  { href: "/admin/pieces/new", label: "Add piece", icon: <AddPhotoAlternateIcon /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAdmin, loading, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (!isAdmin) {
      router.replace("/");
    }
  }, [user, isAdmin, loading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const closeMobile = () => setMobileOpen(false);

  const sidebarContent = (
    <Box
      sx={{
        width: { xs: SIDEBAR_WIDTH_MOBILE, md: SIDEBAR_WIDTH_DESKTOP },
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
        borderRight: 1,
        borderColor: "divider",
        pt: { xs: "env(safe-area-inset-top)", md: 0 },
      }}
    >
      <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
        <Typography variant="h6" fontWeight={600} sx={{ fontSize: { xs: "1.1rem", md: "1.25rem" } }}>
          Admin
        </Typography>
      </Box>
      <List sx={{ flex: 1, px: 1.5, py: 2 }}>
        {navItems.map(({ href, label, icon }) => (
          <ListItem key={href} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              component={Link}
              href={href}
              onClick={closeMobile}
              selected={pathname === href}
              sx={{
                borderRadius: 1.5,
                minHeight: 48,
                py: 1.5,
                "&.Mui-selected": { bgcolor: "primary.main", color: "primary.contrastText" },
                "&.Mui-selected:hover": { bgcolor: "primary.dark" },
              }}
            >
              <ListItemIcon sx={{ minWidth: 44, color: "inherit" }}>{icon}</ListItemIcon>
              <ListItemText primary={label} primaryTypographyProps={{ fontWeight: 500 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <List sx={{ px: 1.5, py: 2, borderTop: 1, borderColor: "divider" }}>
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton
            component={Link}
            href="/"
            onClick={closeMobile}
            sx={{ borderRadius: 1.5, minHeight: 48, py: 1.5 }}
          >
            <ListItemIcon sx={{ minWidth: 44 }}><HomeIcon /></ListItemIcon>
            <ListItemText primary="Home" primaryTypographyProps={{ fontWeight: 500 }} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={handleSignOut} sx={{ borderRadius: 1.5, minHeight: 48, py: 1.5 }}>
            <ListItemIcon sx={{ minWidth: 44 }}><LogoutIcon /></ListItemIcon>
            <ListItemText primary="Sign out" primaryTypographyProps={{ fontWeight: 500 }} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  if (loading || !user || !isAdmin) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100dvh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100dvh" }}>
      {/* Mobile menu button - safe area aware */}
      <IconButton
        onClick={() => setMobileOpen(true)}
        sx={{
          position: "fixed",
          top: "max(12px, env(safe-area-inset-top))",
          left: "max(12px, env(safe-area-inset-left))",
          zIndex: (t) => t.zIndex.drawer + 1,
          bgcolor: "background.paper",
          boxShadow: 2,
          "&:hover": { bgcolor: "action.hover" },
          "&:active": { bgcolor: "action.selected" },
          display: { md: "none" },
          minWidth: 48,
          minHeight: 48,
        }}
        aria-label="Open menu"
      >
        <MenuIcon />
      </IconButton>

      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={closeMobile}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: SIDEBAR_WIDTH_MOBILE,
            maxWidth: "85vw",
            boxSizing: "border-box",
            pt: "env(safe-area-inset-top)",
          },
        }}
      >
        {sidebarContent}
      </Drawer>

      {/* Desktop sidebar (fixed; doesn't take space in flow) */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            width: SIDEBAR_WIDTH_DESKTOP,
            boxSizing: "border-box",
            top: 0,
            flexShrink: 0,
          },
        }}
        open
      >
        {sidebarContent}
      </Drawer>

      {/* Spacer so main content starts after sidebar on desktop (drawer is fixed so doesn't reserve space) */}
      <Box
        sx={{
          width: SIDEBAR_WIDTH_DESKTOP,
          flexShrink: 0,
          display: { xs: "none", md: "block" },
        }}
      />

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          maxWidth: MAIN_MAX_WIDTH,
          px: { xs: 2, sm: 3 },
          pt: { xs: "calc(56px + env(safe-area-inset-top))", md: 3 },
          pb: { xs: 3, md: 4 },
          overflow: "auto",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
