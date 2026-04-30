"use client";

import { useState, useEffect } from "react";
import { Box, Container, Typography, Grid, Paper, Chip, IconButton } from "@mui/material";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";
import HandymanOutlinedIcon from "@mui/icons-material/HandymanOutlined";
import CollectionsOutlinedIcon from "@mui/icons-material/CollectionsOutlined";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { getTags, getTagCategories, type Tag } from "@/lib/firestore";

const BRAND_ORANGE = "#f9c349";

// The insights to rotate through for the hover/slider states
const INSIGHTS = [
  {
    icon: <BuildOutlinedIcon sx={{ fontSize: 18 }} />,
    title: "Structural Assurance",
    text: "Frame stability and motion joints inspected and reinforced.",
  },
  {
    icon: <VerifiedUserOutlinedIcon sx={{ fontSize: 18 }} />,
    title: "Performance Materials",
    text: "Utilizing specialty vinyls with 2M+ double-rub durability.",
  },
  {
    icon: <HandymanOutlinedIcon sx={{ fontSize: 18 }} />,
    title: "The JL Standard",
    text: "Craftsmanship guided by our lead engineer, Ahmed, for long-term commercial use.",
  },
];

export default function CommercialProjectExplorer() {
  const [commercialTags, setCommercialTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTagId, setActiveTagId] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // We want to fetch tags that belong to the businesses/commercial category
  useEffect(() => {
    async function loadCommercialTags() {
      try {
        const [allTags, categories] = await Promise.all([
           getTags(),
           getTagCategories()
        ]);
        
        // Find the category object that matches businesses
        const commercialCategory = categories.find(c => 
           c.name.toLowerCase() === "businesses" || 
           c.name.toLowerCase() === "businessess" || 
           c.name.toLowerCase() === "business" || 
           c.name.toLowerCase() === "commercial"
        );

        // Filter tags: either they belong to that category ID, or they have "business" in the label
        const filtered = allTags.filter((tag) => 
            (commercialCategory && tag.categoryId === commercialCategory.id) ||
            tag.label.toLowerCase().includes("business")
        );
        
        // We only want tags that actually have featured images to show in the gallery
        const withImages = filtered.filter(tag => tag.featuredImages && tag.featuredImages.length > 0);
        
        setCommercialTags(withImages);
      } catch (error) {
        console.error("Failed to load commercial tags:", error);
      } finally {
        setLoading(false);
      }
    }
    loadCommercialTags();
  }, []);

  return (
    <Box component="section" sx={{ py: { xs: 8, md: 12 }, bgcolor: "#faf9f6", position: "relative" }}>
      <Container maxWidth="xl" sx={{ px: { xs: 3, md: 6 } }}>
        <Box sx={{ mb: { xs: 6, md: 8 }, textAlign: "center", maxWidth: 800, mx: "auto" }}>
          <Typography
            variant="overline"
            sx={{
              color: BRAND_ORANGE,
              letterSpacing: "0.15em",
              fontWeight: 700,
              display: "block",
              mb: 1.5,
              textTransform: "uppercase",
            }}
          >
            Visual Proof of Reputation
          </Typography>
          <Typography
            component="h2"
            sx={{
              fontFamily: "var(--font-heading)",
              fontWeight: 600,
              fontSize: { xs: "2.25rem", md: "3rem" },
              color: "#1a1a1a",
              lineHeight: 1.2,
              mb: 3,
            }}
          >
            A Proven Reputation Across Every Industry.
          </Typography>
          <Typography
            sx={{
              color: "rgba(26,26,26,0.7)",
              fontSize: { xs: "1.0625rem", md: "1.25rem" },
              lineHeight: 1.6,
              fontFamily: "var(--font-body)",
            }}
          >
            Explore our portfolio of high-traffic transformations. Each project is a testament to our 30-year standard of combining aesthetic beauty with industrial-grade durability.
          </Typography>
        </Box>

        {loading ? (
           <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
              <Typography sx={{ color: "text.secondary" }}>Loading projects...</Typography>
           </Box>
        ) : commercialTags.length > 0 ? (
          <Box>
            {!activeTagId ? (
              // State 1: No active tag selected. Show the grid.
              <Grid container spacing={4} sx={{ animation: "fadeIn 0.5s ease-in-out" }}>
                {commercialTags.map((tag, index) => {
                  const firstImage = tag.featuredImages![0].publicUrl;

                  return (
                    <Grid item xs={12} sm={6} md={4} key={tag.id}>
                      <Paper
                        elevation={0}
                        onClick={() => {
                           setActiveTagId(tag.id);
                           setActiveImageIndex(0);
                        }}
                        sx={{
                          position: "relative",
                          borderRadius: 2,
                          overflow: "hidden",
                          bgcolor: "#f5f5f5",
                          height: { xs: 300, sm: 350, md: 400 },
                          cursor: "pointer",
                          display: "block",
                          "&::before": {
                            content: '""',
                            position: "absolute",
                            inset: 0,
                            background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)",
                            zIndex: 1,
                            pointerEvents: "none",
                            transition: "opacity 0.3s ease",
                          },
                          "&:hover img": {
                            transform: "scale(1.05)",
                          },
                          "&:hover .hover-overlay": {
                            opacity: 1,
                            transform: "translateY(0)",
                          },
                          "&:hover::before": {
                             opacity: 0.5,
                          }
                        }}
                      >
                        <Box
                          component="img"
                          src={firstImage}
                          alt={tag.label}
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                          }}
                        />
                        
                        {/* Default Label */}
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            p: 3,
                            zIndex: 2,
                          }}
                        >
                          <Typography
                            variant="h5"
                            sx={{
                              color: "#fff",
                              fontWeight: 600,
                              fontFamily: "var(--font-heading)",
                              textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                              mb: 0.5,
                            }}
                          >
                            {tag.label}
                          </Typography>
                        </Box>

                        {/* View Samples Hover Area */}
                        <Box
                           className="hover-overlay"
                           sx={{
                              position: "absolute",
                              inset: 0,
                              bgcolor: "rgba(0,0,0,0.4)",
                              zIndex: 3,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              opacity: 0,
                              transition: "all 0.3s ease",
                           }}
                        >
                           <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <CollectionsOutlinedIcon sx={{ color: BRAND_ORANGE, fontSize: 32 }} />
                              <Typography sx={{ color: "#fff", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                                View Gallery
                              </Typography>
                           </Box>
                        </Box>
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
            ) : (
              // State 2: Active Tag Selected. Show Slider.
              <Box sx={{ animation: "fadeIn 0.5s ease-in-out" }}>
                 {/* Top Scrolling Tags */}
                 <Box
                    sx={{
                      display: "flex",
                      flexWrap: "nowrap",
                      overflowX: "auto",
                      gap: 2,
                      mb: 4,
                      pb: 1, // Space for scrollbar
                      "&::-webkit-scrollbar": { height: 6 },
                      "&::-webkit-scrollbar-thumb": { backgroundColor: "rgba(0,0,0,0.2)", borderRadius: 3 },
                    }}
                  >
                    {commercialTags.map((tag) => {
                      const isActive = activeTagId === tag.id;
                      return (
                        <Paper
                          key={tag.id}
                          elevation={0}
                          onClick={() => {
                            setActiveTagId(isActive ? null : tag.id);
                            if (!isActive) setActiveImageIndex(0);
                          }}
                          sx={{
                            minWidth: 180,
                            height: 110,
                            position: "relative",
                            borderRadius: 2,
                            overflow: "hidden",
                            cursor: "pointer",
                            border: isActive ? `2px solid ${BRAND_ORANGE}` : "2px solid transparent",
                            transition: "all 0.2s ease",
                            "&:hover img": { transform: "scale(1.05)" },
                            "&:hover .overlay": { opacity: isActive ? 0.4 : 0.2 },
                          }}
                        >
                           {tag.featuredImages && tag.featuredImages.length > 0 ? (
                             <Box
                               component="img"
                               src={tag.featuredImages[0].publicUrl}
                               loading="lazy"
                               sx={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }}
                             />
                           ) : (
                             <Box sx={{ width: "100%", height: "100%", bgcolor: "#e0e0e0" }} />
                           )}
                           <Box className="overlay" sx={{ position: "absolute", inset: 0, bgcolor: "black", opacity: isActive ? 0.4 : 0.6, transition: "opacity 0.3s ease" }} />
                           <Box sx={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", p: 1, textAlign: "center", zIndex: 1 }}>
                             <Typography variant="subtitle1" sx={{ color: "white", fontWeight: 600, fontFamily: "var(--font-heading)", letterSpacing: "0.02em", textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}>
                               {tag.label}
                             </Typography>
                           </Box>
                           {isActive && (
                              <Box sx={{ position: "absolute", top: 8, right: 8, zIndex: 2 }}>
                                 <CollectionsOutlinedIcon sx={{ color: BRAND_ORANGE, fontSize: 16 }} />
                              </Box>
                           )}
                        </Paper>
                      );
                    })}
                  </Box>

                  {/* Main Slider Area */}
                  {activeTagId && commercialTags.find(t => t.id === activeTagId)?.featuredImages && commercialTags.find(t => t.id === activeTagId)!.featuredImages!.length > 0 && (
                    <Box sx={{ animation: "fadeIn 0.5s ease-in-out" }}>
                      {(() => {
                        const activeTag = commercialTags.find(t => t.id === activeTagId)!;
                        const images = activeTag.featuredImages!;
                        const currentImg = images[activeImageIndex];
                        // Get the index of this tag in the overall array to pick the corresponding insight map:
                        const tagGlobalIndex = commercialTags.findIndex(t => t.id === activeTagId);
                        const insight = INSIGHTS[tagGlobalIndex % INSIGHTS.length];
                        
                        const handlePrev = () => setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
                        const handleNext = () => setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

                        return (
                           <Box>
                             <Paper
                               elevation={0}
                               sx={{
                                 position: "relative",
                                 height: { xs: 350, sm: 450, md: 550 },
                                 borderRadius: 2,
                                 overflow: "hidden",
                                 bgcolor: "#fcfdff",
                                 background: `
                                   repeating-linear-gradient(0deg, transparent, transparent 31px, rgba(0,0,0,0.06) 31px, rgba(0,0,0,0.06) 32px),
                                   repeating-linear-gradient(90deg, transparent, transparent 31px, rgba(0,0,0,0.06) 31px, rgba(0,0,0,0.06) 32px)
                                 `,
                                 backgroundPosition: "-1px -1px",
                                 border: "1px solid rgba(0,0,0,0.08)",
                                 boxShadow: "inset 0 0 60px rgba(0,0,0,0.03)"
                               }}
                             >
                                <Box
                                  component="img"
                                  src={currentImg.publicUrl}
                                  loading="eager"
                                  sx={{ width: "100%", height: "100%", objectFit: "contain", transition: "opacity 0.3s ease" }}
                                  key={currentImg.storageKey}
                                />
                                
                                {/* Info Overlay gradient */}
                                <Box sx={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)", p: 4, zIndex: 1 }} />

                                {/* Navigation Arrows */}
                                {images.length > 1 && (
                                  <>
                                    <IconButton
                                      onClick={handlePrev}
                                      sx={{
                                        position: "absolute",
                                        left: { xs: 8, md: 16 },
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        bgcolor: "rgba(255, 255, 255, 0.8)",
                                        "&:hover": { bgcolor: "#faf9f6" },
                                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                                        zIndex: 2,
                                      }}
                                    >
                                      <NavigateBeforeIcon fontSize="large" sx={{ color: BRAND_ORANGE }} />
                                    </IconButton>
                                    <IconButton
                                      onClick={handleNext}
                                      sx={{
                                        position: "absolute",
                                        right: { xs: 8, md: 16 },
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        bgcolor: "rgba(255, 255, 255, 0.8)",
                                        "&:hover": { bgcolor: "#faf9f6" },
                                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                                        zIndex: 2,
                                      }}
                                    >
                                      <NavigateNextIcon fontSize="large" sx={{ color: BRAND_ORANGE }} />
                                    </IconButton>
                                    
                                    {/* Dots Navigation */}
                                    <Box sx={{ position: "absolute", bottom: 20, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 1, zIndex: 2 }}>
                                      {images.map((_, idx) => (
                                        <Box
                                          key={idx}
                                          onClick={() => setActiveImageIndex(idx)}
                                          sx={{
                                            width: activeImageIndex === idx ? 24 : 8,
                                            height: 8,
                                            borderRadius: 4,
                                            bgcolor: activeImageIndex === idx ? BRAND_ORANGE : "rgba(255,255,255,0.4)",
                                            cursor: "pointer",
                                            transition: "all 0.3s ease",
                                            boxShadow: "0 1px 3px rgba(0,0,0,0.5)"
                                          }}
                                        />
                                      ))}
                                    </Box>
                                  </>
                                )}
                             </Paper>

                             {/* Mind for the Art Insight Box (Bottom) */}
                             <Paper
                               elevation={0}
                               sx={{
                                  mt: 3,
                                  p: 4,
                                  bgcolor: "#fdf8f4",
                                  borderLeft: `4px solid ${BRAND_ORANGE}`,
                                  borderRadius: "0 8px 8px 0"
                               }}
                             >
                                <Grid container spacing={3} alignItems="center">
                                   <Grid item xs={12} md={4}>
                                      <Chip 
                                          icon={insight.icon}
                                          label={insight.title}
                                          size="medium"
                                          sx={{ 
                                            bgcolor: "rgba(249,195,73, 0.15)", 
                                            color: BRAND_ORANGE, 
                                            fontWeight: 700,
                                            letterSpacing: "0.05em",
                                            "& .MuiChip-icon": { color: BRAND_ORANGE }
                                          }} 
                                      />
                                   </Grid>
                                   <Grid item xs={12} md={8}>
                                      <Typography sx={{ color: "#1a1a1a", fontSize: "1.125rem", fontFamily: "var(--font-heading)", fontWeight: 500 }}>
                                         &quot;{insight.text}&quot;
                                      </Typography>
                                      <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
                                         Project Standard: <strong style={{ color: "#1a1a1a" }}>{activeTag.label}</strong>
                                      </Typography>
                                   </Grid>
                                </Grid>
                             </Paper>
                           </Box>
                        );
                      })()}
                    </Box>
                  )}
              </Box>
            )}
          </Box>
        ) : (
          <Box sx={{ p: 6, textAlign: "center", bgcolor: "#f9f9f9", borderRadius: 2 }}>
             <Typography sx={{ color: "text.secondary", fontSize: "1.125rem" }}>
               We are currently uploading our commercial portfolio. Please check back soon for updates to our high-traffic transformations.
             </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}
