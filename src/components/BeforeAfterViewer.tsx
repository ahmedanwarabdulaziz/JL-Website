"use client";

import { useState } from "react";
import {
  Box,
  Dialog,
  IconButton,
  Paper,
  Stack,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloseIcon from "@mui/icons-material/Close";
import type { StoredImage } from "@/lib/firestore";

interface BeforeAfterViewerProps {
  beforeImages: StoredImage[];
  afterImages: StoredImage[];
}

export default function BeforeAfterViewer({ beforeImages, afterImages }: BeforeAfterViewerProps) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxSection, setLightboxSection] = useState<"before" | "after">("before");
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const before = beforeImages ?? [];
  const after = afterImages ?? [];
  const hasBefore = before.length > 0;
  const hasAfter = after.length > 0;

  if (!hasBefore && !hasAfter) return null;

  const openLightbox = (section: "before" | "after", index: number) => {
    setLightboxSection(section);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const currentList = lightboxSection === "before" ? before : after;
  const currentUrl = currentList[lightboxIndex]?.publicUrl ?? currentList[lightboxIndex]?.thumbnailUrl;
  const goPrev = () => setLightboxIndex((i) => (i <= 0 ? currentList.length - 1 : i - 1));
  const goNext = () => setLightboxIndex((i) => (i >= currentList.length - 1 ? 0 : i + 1));

  return (
    <>
      <Stack spacing={2}>
        <Typography variant="h6" fontWeight={600}>
          Before / After
        </Typography>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, flex: 1 }}>
            <Typography fontWeight={600} sx={{ mb: 1.5 }}>
              Before
            </Typography>
            {hasBefore ? (
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {before.map((img, i) => (
                  <Box
                    key={img.storageKey}
                    component="button"
                    onClick={() => openLightbox("before", i)}
                    sx={{
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      borderRadius: 1,
                      overflow: "hidden",
                      "&:hover": { opacity: 0.9 },
                      "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main" },
                    }}
                  >
                    <Box
                      component="img"
                      src={img.thumbnailUrl || img.publicUrl}
                      alt={`Before ${i + 1}`}
                      sx={{
                        width: 160,
                        height: 120,
                        objectFit: "cover",
                        bgcolor: "action.hover",
                        display: "block",
                      }}
                    />
                  </Box>
                ))}
              </Stack>
            ) : (
              <Typography color="text.secondary">—</Typography>
            )}
          </Paper>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, flex: 1 }}>
            <Typography fontWeight={600} sx={{ mb: 1.5 }}>
              After
            </Typography>
            {hasAfter ? (
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {after.map((img, i) => (
                  <Box
                    key={img.storageKey}
                    component="button"
                    onClick={() => openLightbox("after", i)}
                    sx={{
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      borderRadius: 1,
                      overflow: "hidden",
                      "&:hover": { opacity: 0.9 },
                      "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main" },
                    }}
                  >
                    <Box
                      component="img"
                      src={img.thumbnailUrl || img.publicUrl}
                      alt={`After ${i + 1}`}
                      sx={{
                        width: 160,
                        height: 120,
                        objectFit: "cover",
                        bgcolor: "action.hover",
                        display: "block",
                      }}
                    />
                  </Box>
                ))}
              </Stack>
            ) : (
              <Typography color="text.secondary">—</Typography>
            )}
          </Paper>
        </Stack>
      </Stack>

      <Dialog
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        maxWidth={false}
        fullScreen={!isDesktop}
        PaperProps={{
          sx: {
            ...(!isDesktop ? { bgcolor: "rgba(0,0,0,0.95)" } : { maxWidth: "90vw", maxHeight: "90vh", bgcolor: "background.paper" }),
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: isDesktop ? 400 : "100dvh",
            p: 2,
          }}
        >
          <IconButton
            onClick={() => setLightboxOpen(false)}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 1,
              color: isDesktop ? "text.primary" : "white",
            }}
            aria-label="Close"
          >
            <CloseIcon />
          </IconButton>

          {currentList.length > 1 && (
            <>
              <IconButton
                onClick={goPrev}
                sx={{
                  position: "absolute",
                  left: 8,
                  color: isDesktop ? "text.primary" : "white",
                  bgcolor: isDesktop ? "action.hover" : "rgba(255,255,255,0.1)",
                  "&:hover": { bgcolor: isDesktop ? "action.selected" : "rgba(255,255,255,0.2)" },
                }}
                aria-label="Previous"
              >
                <ChevronLeftIcon />
              </IconButton>
              <IconButton
                onClick={goNext}
                sx={{
                  position: "absolute",
                  right: 8,
                  color: isDesktop ? "text.primary" : "white",
                  bgcolor: isDesktop ? "action.hover" : "rgba(255,255,255,0.1)",
                  "&:hover": { bgcolor: isDesktop ? "action.selected" : "rgba(255,255,255,0.2)" },
                }}
                aria-label="Next"
              >
                <ChevronRightIcon />
              </IconButton>
            </>
          )}

          {currentUrl && (
            <Box
              component="img"
              src={currentUrl}
              alt={lightboxSection === "before" ? `Before ${lightboxIndex + 1}` : `After ${lightboxIndex + 1}`}
              sx={{
                maxWidth: "100%",
                maxHeight: isDesktop ? "85vh" : "calc(100dvh - 80px)",
                objectFit: "contain",
              }}
            />
          )}

          {currentList.length > 1 && (
            <Typography
              variant="body2"
              sx={{
                position: "absolute",
                bottom: 16,
                left: "50%",
                transform: "translateX(-50%)",
                color: isDesktop ? "text.secondary" : "rgba(255,255,255,0.8)",
              }}
            >
              {lightboxIndex + 1} / {currentList.length}
            </Typography>
          )}
        </Box>
      </Dialog>
    </>
  );
}
