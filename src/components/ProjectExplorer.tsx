"use client";

import { useState, useEffect } from "react";
import { Box, Container, Typography, Grid, Button, Paper, Chip, IconButton } from "@mui/material";
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import CollectionsOutlinedIcon from "@mui/icons-material/CollectionsOutlined";
import Link from "next/link";
import { getTags, getTagCategories, type Tag } from "@/lib/firestore";

const ENVIRONMENTS = [
  { 
    title: "Private Residential Interiors", 
    description: "Bespoke reupholstery for the furniture that defines the home—from sentimental heirlooms to modern sectionals.",
    image: "/images/new.jpeg" 
  },
  { 
    title: "Commercial & Hospitality Environments", 
    description: "Durable, high-design solutions for restaurants, hotels, and offices that demand both beauty and longevity.",
    image: "/images/03.jpeg" 
  },
  { 
    title: "Healthcare & Institutional Spaces", 
    description: "Specialized upholstery for clinics, hospitals, and community centers, prioritizing hygiene and industrial-grade durability.",
    image: "/images/02.jpeg" 
  },
  { 
    title: "Outdoor & Specialty Marine", 
    description: "Custom-crafted cushions and seating designed to withstand the elements without sacrificing comfort.",
    image: "/images/04.jpeg" 
  },
];

// Helper component for fast-loading, stylish category cards
function CategoryCard({ title, description, image }: { title: string; description: string; image: string }) {
  return (
    <Paper
      elevation={0}
      sx={{
        position: "relative",
        height: { xs: 260, md: 300 },
        borderRadius: "4px",
        overflow: "hidden",
        bgcolor: "#e0e0e0", // placeholder color before image loads
        cursor: "pointer",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 12px 24px rgba(0,0,0,0.12)",
          "& img": { transform: "scale(1.05)" },
          "& .overlay": { opacity: 0.9 },
          "& .content": { transform: "translateY(0)" },
          "& .description": { opacity: 1 }
        }
      }}
    >
      <Box
        component="img"
        src={image}
        alt={title}
        loading="lazy"
        decoding="async"
        sx={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transition: "transform 0.5s ease",
        }}
      />
      <Box
        className="overlay"
        sx={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.1) 100%)",
          opacity: 0.8,
          transition: "opacity 0.3s ease",
        }}
      />
      <Box
        className="content"
        sx={{
          position: "absolute",
          inset: 0,
          p: { xs: 3, md: 4 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          transform: { xs: "none", md: "translateY(24px)" },
          transition: "transform 0.3s ease",
        }}
      >
        <Typography
          variant="h6"
          component="h3"
          sx={{
            color: "#fff",
            fontFamily: "var(--font-heading)",
            fontWeight: 600,
            letterSpacing: "0.02em",
            textShadow: "0 2px 4px rgba(0,0,0,0.4)",
            mb: 1,
            fontSize: { xs: "1.25rem", md: "1.5rem" }
          }}
        >
          {title}
        </Typography>
        <Typography
          className="description"
          sx={{
            color: "rgba(255,255,255,0.85)",
            fontFamily: "var(--font-body)",
            fontSize: "0.875rem",
            lineHeight: 1.6,
            opacity: { xs: 1, md: 0 },
            transition: "opacity 0.3s ease",
          }}
        >
          {description}
        </Typography>
      </Box>
    </Paper>
  );
}

export default function ProjectExplorer() {
  const [styleTags, setStyleTags] = useState<Tag[]>([]);
  const [loadingTags, setLoadingTags] = useState(true);
  const [activeStyleId, setActiveStyleId] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    async function fetchTags() {
      try {
        const [categories, allTags] = await Promise.all([
          getTagCategories(),
          getTags()
        ]);
        
        // Find the "Style" category if it exists, otherwise just show all tags (or fallback)
        const styleCategory = categories.find(c => c.name.toLowerCase() === "style");
        let activeTags: Tag[] = [];
        
        if (styleCategory) {
          activeTags = allTags.filter(t => t.categoryId === styleCategory.id);
        } else {
          activeTags = allTags; // Fallback if no specific category named 'Style'
        }
        setStyleTags(activeTags);
        
        // We no longer auto-select the first tag. We let the user see the style cards first.
      } catch (error) {
        console.error("Failed to fetch tags:", error);
      } finally {
        setLoadingTags(false);
      }
    }
    
    fetchTags();
  }, []);

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 10, lg: 12 },
        bgcolor: "#fafafa",
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 3, sm: 4, md: 6 } }}>
        {/* Header Section */}
        <Box sx={{ textAlign: "center", mb: { xs: 6, md: 8 } }}>
          <Typography
            variant="overline"
            sx={{
              color: "var(--brand-orange)",
              letterSpacing: "0.15em",
              fontWeight: 700,
              display: "block",
              mb: 1.5,
              textTransform: "uppercase",
            }}
          >
            The Project Explorer
          </Typography>
          <Typography
            component="h2"
            sx={{
              fontFamily: "var(--font-heading)",
              fontWeight: 600,
              color: "#1a1a1a",
              fontSize: { xs: "2.25rem", sm: "2.75rem", md: "3rem" },
              letterSpacing: "0.01em",
              lineHeight: 1.2,
              mb: 2,
            }}
          >
            A Portfolio of Wide <span style={{ color: "var(--brand-orange)", fontStyle: "italic" }}>Reputation.</span>
          </Typography>
          <Typography
            sx={{
              color: "text.secondary",
              fontSize: { xs: "1rem", sm: "1.0625rem" },
              maxWidth: 600,
              mx: "auto",
              fontFamily: "var(--font-body)",
              lineHeight: 1.6,
            }}
          >
            Database Tag Integration allows you to browse our finest work by setting or style. Discover what 30 years of expertise looks like.
          </Typography>
        </Box>

        {/* Explore by Service Environment */}
        <Box sx={{ mb: 8 }}>
          <Typography
            variant="h4"
            sx={{
              fontFamily: "var(--font-heading)",
              fontWeight: 600,
              color: "#1a1a1a",
              mb: 3,
              fontSize: { xs: "1.75rem", md: "2rem" },
              borderBottom: "2px solid rgba(0,0,0,0.05)",
              pb: 1.5,
            }}
          >
            Explore by Service Environment
          </Typography>
          <Grid container spacing={3}>
            {ENVIRONMENTS.map((item) => (
              <Grid item xs={12} sm={6} md={6} key={item.title}>
                <CategoryCard title={item.title} description={item.description} image={item.image} />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Browse by Style Tags */}
        <Box sx={{ mb: 8 }}>
          <Typography
            variant="h4"
            sx={{
              fontFamily: "var(--font-heading)",
              fontWeight: 600,
              color: "#1a1a1a",
              mb: 3,
              fontSize: { xs: "1.75rem", md: "2rem" },
              borderBottom: "2px solid rgba(0,0,0,0.05)",
              pb: 1.5,
            }}
          >
            Browse by Style
          </Typography>
          {loadingTags ? (
            <Typography sx={{ fontFamily: "var(--font-body)", color: "text.secondary" }}>
              Loading styles...
            </Typography>
          ) : styleTags.length > 0 ? (
            <>
              {!activeStyleId ? (
                // State 1: No style selected. Show all styles as large cards.
                <Grid container spacing={3} sx={{ animation: "fadeIn 0.5s ease-in-out" }}>
                  {styleTags.map((tag) => (
                    <Grid item xs={12} sm={6} md={4} key={tag.id}>
                      <Paper
                        elevation={0}
                        onClick={() => {
                          setActiveStyleId(tag.id);
                          setActiveImageIndex(0);
                        }}
                        sx={{
                          position: "relative",
                          height: 280,
                          borderRadius: 2,
                          overflow: "hidden",
                          cursor: "pointer",
                          display: "block",
                          "&:hover img": { transform: "scale(1.05)" },
                          "&:hover .overlay": { opacity: 0.2 },
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
                         <Box className="overlay" sx={{ position: "absolute", inset: 0, bgcolor: "black", opacity: 0.4, transition: "opacity 0.3s ease" }} />
                         <Box sx={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", p: 3, textAlign: "center" }}>
                           <Typography variant="h5" sx={{ color: "white", fontWeight: 600, fontFamily: "var(--font-heading)", letterSpacing: "0.02em", textShadow: "0 2px 8px rgba(0,0,0,0.5)", mb: 1 }}>
                             {tag.label}
                           </Typography>
                           <Box sx={{ display: "flex", alignItems: "center", gap: 1, opacity: 0.9, transition: "all 0.3s ease" }}>
                             <CollectionsOutlinedIcon fontSize="small" sx={{ color: "var(--brand-orange)" }} />
                             <Typography variant="button" sx={{ color: "white", fontWeight: 600, letterSpacing: "0.08em" }}>
                               View Samples
                             </Typography>
                           </Box>
                         </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                // State 2: Active style is selected. Show chips at top, then the single image slider.
                <Box sx={{ animation: "fadeIn 0.5s ease-in-out" }}>
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
                    {styleTags.map((tag) => {
                      const isActive = activeStyleId === tag.id;
                      return (
                        <Paper
                          key={tag.id}
                          elevation={0}
                          onClick={() => {
                            setActiveStyleId(isActive ? null : tag.id);
                            if (!isActive) setActiveImageIndex(0);
                          }}
                          sx={{
                            minWidth: 160,
                            height: 100,
                            position: "relative",
                            borderRadius: 2,
                            overflow: "hidden",
                            cursor: "pointer",
                            border: isActive ? "2px solid var(--brand-orange)" : "2px solid transparent",
                            transition: "all 0.2s ease",
                            "&:hover img": { transform: "scale(1.05)" },
                            "&:hover .overlay": { opacity: isActive ? 0.3 : 0.2 },
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
                           <Box className="overlay" sx={{ position: "absolute", inset: 0, bgcolor: "black", opacity: isActive ? 0.3 : 0.5, transition: "opacity 0.3s ease" }} />
                           <Box sx={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", p: 1, textAlign: "center" }}>
                             <Typography variant="subtitle2" sx={{ color: "white", fontWeight: 600, fontFamily: "var(--font-heading)", letterSpacing: "0.02em", textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}>
                               {tag.label}
                             </Typography>
                           </Box>
                        </Paper>
                      );
                    })}
                  </Box>
                  
                  {activeStyleId && styleTags.find(t => t.id === activeStyleId)?.featuredImages && styleTags.find(t => t.id === activeStyleId)!.featuredImages!.length > 0 && (
                    <Box sx={{ animation: "fadeIn 0.5s ease-in-out" }}>
                      {(() => {
                        const activeTag = styleTags.find(t => t.id === activeStyleId)!;
                        const images = activeTag.featuredImages!;
                        const currentImg = images[activeImageIndex];
                        
                        const handlePrev = () => setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
                        const handleNext = () => setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

                        return (
                          <Paper
                            elevation={0}
                            sx={{
                              position: "relative",
                              height: { xs: 300, sm: 400, md: 500 },
                              borderRadius: 2,
                              overflow: "hidden",
                              bgcolor: "#fcfdff",
                              background: `
                                repeating-linear-gradient(0deg, transparent, transparent 31px, rgba(0,0,0,0.06) 31px, rgba(0,0,0,0.06) 32px),
                                repeating-linear-gradient(90deg, transparent, transparent 31px, rgba(0,0,0,0.06) 31px, rgba(0,0,0,0.06) 32px)
                              `,
                              backgroundColor: "#fcfdff",
                              backgroundPosition: "-1px -1px", // Aligns the grid perfectly
                              border: "1px solid rgba(0,0,0,0.08)",
                              boxShadow: "inset 0 0 60px rgba(0,0,0,0.03)"
                            }}
                          >
                             <Box
                               component="img"
                               src={currentImg.publicUrl}
                               loading="eager" // Eager since it's the main slider
                               sx={{ width: "100%", height: "100%", objectFit: "contain", transition: "opacity 0.3s ease" }}
                               key={currentImg.storageKey} // Triggers React re-render animation if we add CSS
                             />
                             
                             {/* Navigation Arrows */}
                             {images.length > 1 && (
                               <>
                                 <IconButton
                                   onClick={handlePrev}
                                   sx={{
                                     position: "absolute",
                                     left: 16,
                                     top: "50%",
                                     transform: "translateY(-50%)",
                                     bgcolor: "rgba(255, 255, 255, 0.8)",
                                     "&:hover": { bgcolor: "#faf9f6" },
                                     boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
                                   }}
                                 >
                                   <NavigateBeforeIcon fontSize="large" sx={{ color: "var(--brand-orange)" }} />
                                 </IconButton>
                                 <IconButton
                                   onClick={handleNext}
                                   sx={{
                                     position: "absolute",
                                     right: 16,
                                     top: "50%",
                                     transform: "translateY(-50%)",
                                     bgcolor: "rgba(255, 255, 255, 0.8)",
                                     "&:hover": { bgcolor: "#faf9f6" },
                                     boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
                                   }}
                                 >
                                   <NavigateNextIcon fontSize="large" sx={{ color: "var(--brand-orange)" }} />
                                 </IconButton>
                                 
                                 {/* Dots Navigation */}
                                 <Box sx={{ position: "absolute", bottom: 16, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 1 }}>
                                   {images.map((_, idx) => (
                                     <Box
                                       key={idx}
                                       onClick={() => setActiveImageIndex(idx)}
                                       sx={{
                                         width: activeImageIndex === idx ? 24 : 8,
                                         height: 8,
                                         borderRadius: 4,
                                         bgcolor: activeImageIndex === idx ? "var(--brand-orange)" : "rgba(0,0,0,0.3)",
                                         cursor: "pointer",
                                         transition: "all 0.3s ease"
                                       }}
                                     />
                                   ))}
                                 </Box>
                               </>
                             )}
                          </Paper>
                        );
                      })()}

                      <Box sx={{ mt: 3, textAlign: "right" }}>
                        <Button 
                          component={Link} 
                          href={`/gallery?tag=${activeStyleId}`}
                          endIcon={<ArrowForwardRoundedIcon />}
                          sx={{ color: "var(--brand-orange)", fontWeight: 600, "&:hover": { bgcolor: "transparent", textDecoration: "underline" } }}
                        >
                          View all {styleTags.find(t => t.id === activeStyleId)?.label} projects
                        </Button>
                      </Box>
                    </Box>
                  )}
                </Box>
              )}
            </>
          ) : (
            <Typography sx={{ fontFamily: "var(--font-body)", color: "text.secondary" }}>
              No styles found.
            </Typography>
          )}
        </Box>

        {/* The Results CTA */}
        <Box
          sx={{
            textAlign: "center",
            p: { xs: 4, md: 6 },
            bgcolor: "#1a1a1a",
            borderRadius: "4px",
            color: "#fff",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
          }}
        >
          {/* Subtle background pattern/texture */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              opacity: 0.1,
              backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Typography
              variant="overline"
              sx={{ color: "var(--brand-orange)", letterSpacing: "0.15em", mb: 2, display: "block", fontWeight: 700 }}
            >
              The Results
            </Typography>
            <Typography
              component="h3"
              sx={{
                fontFamily: "var(--font-heading)",
                fontWeight: 600,
                fontSize: { xs: "1.75rem", md: "2.5rem" },
                mb: 4,
                letterSpacing: "0.02em",
              }}
            >
              Experience The Before & After Gallery
            </Typography>
            <Button
              component={Link}
              href="/projects"
              variant="contained"
              endIcon={<ArrowForwardRoundedIcon />}
              sx={{
                bgcolor: "var(--brand-orange)",
                color: "#fff",
                px: 5,
                py: 1.5,
                fontSize: "0.9375rem",
                fontWeight: 600,
                letterSpacing: "0.05em",
                borderRadius: "2px",
                "&:hover": { bgcolor: "#dfb042" }
              }}
            >
              View Full Gallery
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
