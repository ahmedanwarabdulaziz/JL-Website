"use client";

import { Dialog, DialogContent, Typography, Button, Box, IconButton, Divider } from "@mui/material";
import { useRouter } from "next/navigation";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import InstagramIcon from "@mui/icons-material/Instagram";

const BRAND_ORANGE = "#f9c349";
const INSTAGRAM_URL = "https://www.instagram.com/jl_upholstery/";

export default function ComingSoonOverlay() {
  const router = useRouter();

  return (
    <Dialog
      open={true}
      disableEscapeKeyDown
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: "0 32px 64px rgba(0,0,0,0.2)",
        },
      }}
      sx={{
        "& .MuiBackdrop-root": {
          backdropFilter: "blur(12px)",
          backgroundColor: "rgba(0,0,0,0.7)",
        },
      }}
    >
      {/* Gold accent bar */}
      <Box sx={{ height: 5, bgcolor: BRAND_ORANGE }} />

      <DialogContent sx={{ px: 4, pt: 4, pb: 4, textAlign: "center" }}>
        {/* Icon */}
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            bgcolor: "rgba(249,195,73,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 2,
          }}
        >
          <AutoAwesomeIcon sx={{ fontSize: 36, color: BRAND_ORANGE }} />
        </Box>

        {/* Heading */}
        <Typography
          variant="h5"
          sx={{ fontFamily: "var(--font-heading)", fontWeight: 700, mb: 1.5, letterSpacing: "-0.01em" }}
        >
          Gallery Coming Soon
        </Typography>

        {/* Body */}
        <Typography sx={{ color: "text.secondary", fontSize: "1rem", lineHeight: 1.7, mb: 3 }}>
          We&apos;re hand-crafting a beautiful project gallery to showcase our finest work.
          In the meantime, explore our full portfolio of reupholstered masterpieces on Instagram.
        </Typography>

        <Divider sx={{ mb: 3 }} />

        {/* Instagram profile row */}
        <Box
          component="a"
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1.5,
            mb: 1,
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <IconButton
            component="span"
            disableRipple
            sx={{
              background: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
              color: "#fff",
              width: 44,
              height: 44,
              "&:hover": { opacity: 0.9 },
              pointerEvents: "none",
            }}
          >
            <InstagramIcon sx={{ fontSize: 22 }} />
          </IconButton>
          <Box sx={{ textAlign: "left" }}>
            <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.75rem" }}>
              View our portfolio on
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 700, color: "#1a1a1a", lineHeight: 1.2 }}>
              @jl_upholstery
            </Typography>
          </Box>
        </Box>

        {/* Primary CTA */}
        <Button
          variant="contained"
          fullWidth
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          startIcon={<InstagramIcon />}
          sx={{
            mt: 2,
            py: 1.5,
            background: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
            color: "#fff",
            fontWeight: 600,
            fontSize: "0.95rem",
            borderRadius: "30px",
            textTransform: "none",
            letterSpacing: "0.02em",
            boxShadow: "0 4px 15px rgba(220,39,67,0.35)",
            "&:hover": { opacity: 0.92, boxShadow: "0 6px 20px rgba(220,39,67,0.45)" },
          }}
        >
          Explore Our Gallery on Instagram
        </Button>

        {/* Secondary link */}
        <Button
          variant="text"
          onClick={() => router.push("/")}
          sx={{ mt: 1.5, color: "text.secondary", textTransform: "none", fontSize: "0.875rem" }}
        >
          Return to Home
        </Button>
      </DialogContent>
    </Dialog>
  );
}
