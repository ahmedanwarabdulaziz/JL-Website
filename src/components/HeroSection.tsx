"use client";

import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";
import { Button, Container, Typography, Box, Stack } from "@mui/material";
import { useQuotationModal } from "@/contexts/QuotationModalContext";

// Placeholder images for the split screen effect
const BEFORE_IMAGE = "https://images.unsplash.com/photo-1544457070-4cd773b4d71e?q=80&w=2662&auto=format&fit=crop";
const AFTER_IMAGE = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2670&auto=format&fit=crop";

export default function HeroSection() {
  const { openQuotationModal } = useQuotationModal();
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const percentage = (x / rect.width) * 100;
      setSliderPosition(percentage);
    },
    []
  );

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      handleMove(e.clientX);
    },
    [isDragging, handleMove]
  );

  const onTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging) return;
      handleMove(e.touches[0].clientX);
    },
    [isDragging, handleMove]
  );

  const stopDragging = useCallback(() => setIsDragging(false), []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("touchmove", onTouchMove, { passive: false });
      window.addEventListener("mouseup", stopDragging);
      window.addEventListener("touchend", stopDragging);
    }
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("mouseup", stopDragging);
      window.removeEventListener("touchend", stopDragging);
    };
  }, [isDragging, onMouseMove, onTouchMove, stopDragging]);

  return (
    <Box
      component="main"
      sx={{
        position: "relative",
        minHeight: { xs: "90vh", md: "85vh" },
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        bgcolor: "#000",
      }}
    >
      {/* Interactive Split-Screen Background */}
      <Box
        ref={containerRef}
        sx={{
          position: "absolute",
          inset: 0,
          cursor: isDragging ? "grabbing" : "grab",
          userSelect: "none",
          touchAction: "none", // Prevent scrolling while dragging on mobile
        }}
        onMouseDown={(e) => {
          setIsDragging(true);
          handleMove(e.clientX);
        }}
        onTouchStart={(e) => {
          setIsDragging(true);
          handleMove(e.touches[0].clientX);
        }}
      >
        {/* AFTER Image (Bottom layer) */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url('${AFTER_IMAGE}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* BEFORE Image (Top layer, clipped) */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url('${BEFORE_IMAGE}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
          }}
        />

        {/* Drag Handle & Line */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `${sliderPosition}%`,
            width: 2,
            bgcolor: "#fff",
            transform: "translateX(-50%)",
            zIndex: 2,
            pointerEvents: "none",
            boxShadow: "0 0 10px rgba(0,0,0,0.5)",
          }}
        >
          {/* Handle Circle */}
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 48,
              height: 48,
              borderRadius: "50%",
              bgcolor: "var(--brand-orange)",
              border: "3px solid #fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
              "&::before, &::after": {
                content: '""',
                width: 0,
                height: 0,
                borderStyle: "solid",
              },
              "&::before": {
                borderWidth: "6px 8px 6px 0",
                borderColor: "transparent #fff transparent transparent",
                marginRight: "4px",
              },
              "&::after": {
                borderWidth: "6px 0 6px 8px",
                borderColor: "transparent transparent transparent #fff",
                marginLeft: "4px",
              },
            }}
          />
        </Box>
      </Box>

      {/* Dark Overlay for Text Readability - slightly stronger at bottom left */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.2) 100%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
      {/* Mobile-specific overlay gradient (bottom up) */}
      <Box
        sx={{
          display: { xs: "block", md: "none" },
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0) 100%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Content Container */}
      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 3,
          pointerEvents: "none", // Allow dragging through the container empty space
          textAlign: { xs: "center", md: "left" },
          py: { xs: 8, md: 0 },
          display: "flex",
          flexDirection: "column",
          justifyContent: { xs: "flex-end", md: "center" },
          height: "100%",
        }}
      >
        <Stack 
          spacing={{ xs: 3, md: 4 }} 
          sx={{ 
            maxWidth: { xs: "100%", md: 680 },
            pointerEvents: "none", // Let touch events pass through to the slider
            mt: { xs: "auto", md: 0 }, // Push to bottom on mobile
          }}
        >
          {/* Labels for Before/After */}
          <Stack 
            direction="row" 
            justifyContent={{ xs: "space-between", md: "flex-start" }} 
            spacing={{ xs: 0, md: 4 }}
            sx={{ px: { xs: 2, md: 0 }, mb: -1 }}
          >
           <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600 }}>Before</Typography>
           <Typography sx={{ color: "rgba(255,129,43,0.9)", fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600 }}>After</Typography>
          </Stack>

          <Typography
            component="h1"
            variant="h2"
            sx={{
              fontFamily: "var(--font-heading)",
              fontWeight: 600,
              color: "#fff",
              fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.5rem" },
              lineHeight: 1.1,
              letterSpacing: "0.01em",
              textShadow: "0 2px 24px rgba(0,0,0,0.6)",
            }}
          >
            The Standard of Excellence in <span style={{ color: "var(--brand-orange)", fontStyle: "italic" }}>Professional Upholstery.</span>
          </Typography>

          <Typography
            sx={{
              color: "rgba(255,255,255,0.9)",
              fontSize: { xs: "1rem", sm: "1.125rem", md: "1.25rem" },
              lineHeight: 1.6,
              letterSpacing: "0.02em",
              fontFamily: "var(--font-body)",
              textShadow: "0 1px 12px rgba(0,0,0,0.5)",
              maxWidth: { xs: "100%", md: "90%" },
            }}
          >
            Bringing 30 years of unrivaled value to the furniture you love. From residential heirlooms to commercial environments, we believe every space deserves the quality of a well-furnished life.
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{
              pt: { xs: 1, md: 2 },
              width: { xs: "100%", sm: "auto" },
              mx: { xs: "auto", md: 0 },
              pointerEvents: "auto", // Re-enable pointer events ONLY for the buttons
            }}
          >
            <Button
              onClick={openQuotationModal}
              variant="contained"
              size="large"
              fullWidth={false}
              sx={{
                minHeight: 56,
                px: 4,
                bgcolor: "var(--brand-orange)",
                color: "#fff",
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                letterSpacing: "0.05em",
                fontSize: "0.875rem",
                borderRadius: 1,
                boxShadow: "0 8px 20px rgba(254,129,43,0.3)",
                transition: "all 0.3s ease",
                "&:hover": { 
                  bgcolor: "#e67324", 
                  boxShadow: "0 12px 28px rgba(254,129,43,0.5)",
                  transform: "translateY(-2px)"
                },
              }}
            >
              Start Your Quote - Send Photos
            </Button>
            <Button
              component={Link}
              href="/gallery"
              variant="outlined"
              size="large"
              fullWidth={false}
              sx={{
                minHeight: 56,
                px: 4,
                borderColor: "rgba(255,255,255,0.3)",
                color: "#fff",
                fontFamily: "var(--font-body)",
                fontWeight: 500,
                letterSpacing: "0.05em",
                fontSize: "0.875rem",
                borderRadius: 1,
                backdropFilter: "blur(4px)",
                transition: "all 0.3s ease",
                "&:hover": { 
                  borderColor: "#fff", 
                  bgcolor: "rgba(255,255,255,0.1)",
                  transform: "translateY(-2px)"
                },
              }}
            >
              View Gallery
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
