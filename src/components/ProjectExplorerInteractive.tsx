"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  Chip, 
  Switch,
  FormControlLabel,
  Tooltip,
  Button,
  Dialog,
  DialogContent,
  IconButton
} from "@mui/material";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import type { Tag, TagCategory } from "@/lib/firestore";

export interface PortfolioItem {
  id: string;
  type: "project" | "piece";
  title: string;
  slug: string;
  primaryImage: string;
  beforeImages: string[];
  tagIds: string[];
}

const BRAND_ORANGE = "#f9c349";

interface ProjectExplorerInteractiveProps {
  initialItems: PortfolioItem[];
  initialTags: Tag[];
  initialCategories: TagCategory[];
}

// A custom theme specifically for this interactive component 
// to ensure the dropdowns pop beautifully against the dark architectural background.
const explorerTheme = createTheme({
  palette: {
    primary: { main: BRAND_ORANGE },
    mode: 'dark', // Switch to dark mode for the form controls
  },
  typography: {
    fontFamily: "var(--font-body)",
  },
  components: {
    MuiSelect: {
      styleOverrides: {
        select: {
          paddingTop: 4,
          paddingBottom: 4,
          paddingLeft: 8,
          paddingRight: 28, // space for dropdown icon
          backgroundColor: "transparent",
          borderRadius: 0,
          color: BRAND_ORANGE,
          transition: "all 0.3s ease",
          "&:focus": {
            backgroundColor: "transparent",
          }
        },
        icon: {
           color: BRAND_ORANGE,
           right: 4,
           transition: "transform 0.3s ease",
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          padding: 0,
          "&::after": {
             content: '""',
             position: 'absolute',
             bottom: 0,
             left: 4,
             right: 20, // stop underline before the icon
             height: 2,
             backgroundColor: "rgba(249,195,73, 0.4)",
             transition: "all 0.3s ease",
          },
          "&:hover::after": {
             backgroundColor: "rgba(249,195,73, 0.8)",
             height: 3,
          },
          "&.Mui-focused::after": {
             backgroundColor: BRAND_ORANGE,
             height: 3,
          }
        },
        notchedOutline: {
          border: 'none', // Remove the rigid box completely
        }
      }
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            backgroundColor: "rgba(249,195,73, 0.15)",
          },
          "&.Mui-selected:hover": {
            backgroundColor: "rgba(249,195,73, 0.25)",
          }
        }
      }
    }
  }
});

export default function ProjectExplorerInteractive({ 
  initialItems, 
  initialTags, 
  initialCategories 
}: ProjectExplorerInteractiveProps) {
  
  // 1. Identify Categories to group tags for the dropdowns
  const categoryIds = useMemo(() => {
    const getCat = (keywords: string[]) => 
      initialCategories.find(c => keywords.some(kw => c.name.toLowerCase().includes(kw)))?.id;

    return {
      piece: getCat(["piece", "item", "furniture"]),
      context: getCat(["businesses", "business", "context", "environment", "commercial", "residential"]),
      style: getCat(["style"]),
      material: getCat(["material", "fabric", "vinyl", "leather"]),
      color: getCat(["color", "shade", "tone", "family"]),
    };
  }, [initialCategories]);

  // 2. Group tags by the discovered categories
  const dropdownTags = useMemo(() => {
    return {
      piece: initialTags.filter(t => t.categoryId === categoryIds.piece),
      context: initialTags.filter(t => t.categoryId === categoryIds.context),
      style: initialTags.filter(t => t.categoryId === categoryIds.style),
      material: initialTags.filter(t => t.categoryId === categoryIds.material),
      color: initialTags.filter(t => t.categoryId === categoryIds.color),
    };
  }, [initialTags, categoryIds]);

  // 3. Setup State for the 5 sentence builder dropdowns as multi-select arrays
  const [selectedPiece, setSelectedPiece] = useState<string[]>([]);
  const [selectedContext, setSelectedContext] = useState<string[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<string[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState<string[]>([]);
  
  // State for the Image Lightbox Modal
  const [selectedImageItem, setSelectedImageItem] = useState<PortfolioItem | null>(null);

  // Pagination state to limit initial load bandwidth
  const [visibleCount, setVisibleCount] = useState(12);

  // Reset pagination when any filter changes
  useEffect(() => {
    setVisibleCount(12);
  }, [selectedPiece, selectedContext, selectedStyle, selectedMaterial, selectedColor]);

  const renderFilterTrigger = (
    type: "piece" | "context" | "style" | "material" | "color", 
    selectedIds: string[], 
    placeholder: string
  ) => {
    return (
      <Box 
        component="span" 
        sx={{ mx: 0.5, display: "inline-flex", flexWrap: "wrap", alignItems: "center", gap: 1 }}
      >
        {selectedIds.length === 0 ? (
          <Box 
            component="span" 
            sx={{ 
              color: "rgba(249,195,73, 0.4)", 
              fontWeight: 600, 
              borderBottom: "2px dashed rgba(249,195,73, 0.3)",
              pb: 0.5,
              mx: 1
            }}
          >
            <em>{placeholder}</em>
          </Box>
        ) : (
          selectedIds.map(id => {
            const tag = initialTags.find(t => t.id === id);
            if (!tag) return null;
            return (
              <Chip
                key={id}
                label={tag.label}
                onDelete={() => {
                   const setter = 
                     type === "piece" ? setSelectedPiece :
                     type === "context" ? setSelectedContext :
                     type === "style" ? setSelectedStyle : 
                     type === "color" ? setSelectedColor : setSelectedMaterial;
                   setter(prev => prev.filter(v => v !== id));
                }}
                sx={{
                  bgcolor: "rgba(249,195,73,0.15)",
                  color: "var(--brand-orange)",
                  fontWeight: 600,
                  fontSize: { xs: "0.95rem", md: "1.1rem" },
                  border: "1px solid rgba(249,195,73,0.5)",
                  "& .MuiChip-deleteIcon": {
                    color: "rgba(249,195,73,0.8)",
                    "&:hover": { color: "var(--brand-orange)" }
                  }
                }}
              />
            );
          })
        )}
      </Box>
    );
  };

  // 4. Dynamic Filtering Logic
  const hasActiveFilters = selectedPiece.length > 0 || selectedContext.length > 0 || selectedStyle.length > 0 || selectedMaterial.length > 0 || selectedColor.length > 0;

  const filteredItems = useMemo(() => {
    if (!hasActiveFilters) return [];

    return initialItems.filter(item => {
      const pTags = item.tagIds || [];
      
      // If specific tags are selected, at least one MUST be present in the item's tags
      if (selectedPiece.length > 0 && !selectedPiece.some(id => pTags.includes(id))) return false;
      if (selectedContext.length > 0 && !selectedContext.some(id => pTags.includes(id))) return false;
      if (selectedStyle.length > 0 && !selectedStyle.some(id => pTags.includes(id))) return false;
      if (selectedMaterial.length > 0 && !selectedMaterial.some(id => pTags.includes(id))) return false;
      if (selectedColor.length > 0 && !selectedColor.some(id => pTags.includes(id))) return false;

      return true;
    });
  }, [initialItems, selectedPiece, selectedContext, selectedStyle, selectedMaterial, selectedColor, hasActiveFilters]);

  // 5. Dynamic SEO H1 Logic based on selected filters
  const dynamicH1 = useMemo(() => {
    const styleLabel = selectedStyle.length > 0 
      ? selectedStyle.map(id => initialTags.find(t => t.id === id)?.label).join(", ") 
      : "";
    const pieceLabel = selectedPiece.length > 0 
      ? selectedPiece.map(id => initialTags.find(t => t.id === id)?.label).join(", ") 
      : "Master";
    
    // Construct dynamic string
    let h1 = "Professional ";
    if (styleLabel) h1 += `${styleLabel} `;
    
    // e.g "Mid-Century Modern Sofa" or "Master Upholstery"
    h1 += `${pieceLabel} Upholstery Restoration in the GTA.`;

    // Only return the custom string if at least one meaningful filter is active
    if (selectedStyle.length === 0 && selectedPiece.length === 0) {
       return "Professional Master Upholstery Projects Across the GTA.";
    }
    return h1;
  }, [selectedStyle, selectedPiece, initialTags]);

  // 6. Navigation Logic for the Carousel
  const currentIndex = useMemo(() => {
    if (!selectedImageItem) return -1;
    return filteredItems.findIndex(item => item.id === selectedImageItem.id);
  }, [selectedImageItem, filteredItems]);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setSelectedImageItem(filteredItems[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex < filteredItems.length - 1) {
      setSelectedImageItem(filteredItems[currentIndex + 1]);
    }
  };

  // Keyboard navigation for carousel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImageItem) return;
      if (e.key === "ArrowLeft") handlePrevious();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedImageItem, currentIndex, filteredItems]);

  return (
    <ThemeProvider theme={explorerTheme}>
      <Container maxWidth="xl" sx={{ px: { xs: 3, md: 6 }, py: { xs: 6, md: 10 } }}>
        
        {/* Dynamic SEO Header */}
        <Box sx={{ textAlign: "center", mb: 8, maxWidth: 900, mx: "auto" }}>
           <Typography
             component="h1"
             sx={{
               fontFamily: "var(--font-heading)",
               fontWeight: 600,
               fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
               color: "#1a1a1a",
               lineHeight: 1.2,
               mb: 2,
               transition: "all 0.4s ease"
             }}
           >
             {dynamicH1}
           </Typography>
        </Box>

        {/* The Natural Language Sentence Builder Filter - Dashboard Frame */}
        <Paper 
          elevation={0}
          sx={{ 
            p: { xs: 3, md: 6, lg: 8 }, 
            borderRadius: { xs: 4, md: 2 }, 
             // High-contrast, dark architectural background
            bgcolor: "#0a0a0a",
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: "30px 30px",
            border: "1px solid rgba(255,255,255,0.1)",
            borderTop: "3px solid var(--brand-orange)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
            mb: { xs: 4, md: 10 },
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
            "&::before": {
               content: '""',
               position: "absolute",
               inset: 0,
               background: "radial-gradient(circle at 50% 0%, rgba(249,195,73,0.15) 0%, transparent 70%)",
               pointerEvents: "none"
            }
          }}
        >
          <Typography 
            variant="h4" 
            component="p"
            sx={{ 
              fontFamily: "var(--font-heading)", 
              lineHeight: { xs: 1.8, md: 2.6 }, 
              color: "#ffffff",
              fontWeight: 300,
              fontSize: { xs: "1.1rem", sm: "1.5rem", md: "2rem" },
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
              rowGap: { xs: 1.5, md: 2 },
              position: "relative",
              zIndex: 1
            }}
          >
            <Box component="span" sx={{ fontStyle: "italic", color: "rgba(255,255,255,0.5)", mr: 1 }}>I want to see</Box>
            
            {renderFilterTrigger("piece", selectedPiece, "[Any Piece]")}
            
            <Box component="span" sx={{ fontStyle: "italic", color: "rgba(255,255,255,0.5)", mx: 1 }}>for my</Box>
            
            {renderFilterTrigger("context", selectedContext, "[Any Context]")}
            
            <Box component="span" sx={{ fontStyle: "italic", color: "rgba(255,255,255,0.5)", mx: 1 }}>in a style that is</Box>
            
            {renderFilterTrigger("style", selectedStyle, "[Any Style]")}
            
            <Box component="span" sx={{ fontStyle: "italic", color: "rgba(255,255,255,0.5)", mx: 1 }}>using</Box>
            
            {renderFilterTrigger("material", selectedMaterial, "[Any Material]")}
            
            <Box component="span" sx={{ fontStyle: "italic", color: "rgba(255,255,255,0.5)", mx: 1 }}>in</Box>
            
            {renderFilterTrigger("color", selectedColor, "[Any Color]")}
            
            <Box component="span" sx={{ color: "rgba(255,255,255,0.5)" }}>.</Box>
          </Typography>

          {/* Tag Board Categories */}
          <Box sx={{ mt: { xs: 4, md: 6 }, pt: { xs: 4, md: 5 }, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            <Grid container spacing={4} justifyContent="center" textAlign="left">
               {(["piece", "context", "style", "material", "color"] as const).map(type => {
                 const tags = dropdownTags[type];
                 if (tags.length === 0) return null;
                 
                 const title = type.charAt(0).toUpperCase() + type.slice(1);
                 
                 const currentSelected = 
                    type === "piece" ? selectedPiece :
                    type === "context" ? selectedContext :
                    type === "style" ? selectedStyle : 
                    type === "color" ? selectedColor : selectedMaterial;
                    
                 const setter = 
                    type === "piece" ? setSelectedPiece :
                    type === "context" ? setSelectedContext :
                    type === "style" ? setSelectedStyle : 
                    type === "color" ? setSelectedColor : setSelectedMaterial;

                 return (
                   <Grid item xs={12} sm={6} md={4} lg={2.4} key={type}>
                     <Typography sx={{ color: "rgba(255,255,255,0.4)", fontWeight: 600, mb: 2, textTransform: "uppercase", letterSpacing: "0.05em", fontSize: "0.85rem" }}>
                       {title}
                     </Typography>
                     <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                       {tags.map(tag => {
                         const isSelected = currentSelected.includes(tag.id);
                         return (
                           <Chip
                             key={tag.id}
                             label={tag.label}
                             onClick={() => {
                               if (isSelected) {
                                  setter(prev => prev.filter(id => id !== tag.id));
                               } else {
                                  setter(prev => [...prev, tag.id]);
                               }
                             }}
                             sx={{
                               bgcolor: isSelected ? "var(--brand-orange)" : "rgba(255,255,255,0.05)",
                               color: isSelected ? "#000" : "rgba(255,255,255,0.7)",
                               fontWeight: isSelected ? 700 : 400,
                               border: "1px solid",
                               borderColor: isSelected ? "var(--brand-orange)" : "rgba(255,255,255,0.1)",
                               transition: "all 0.2s ease",
                               "&:hover": {
                                 bgcolor: isSelected ? "var(--brand-orange)" : "rgba(255,255,255,0.1)",
                                 color: isSelected ? "#000" : "#fff"
                               }
                             }}
                           />
                         );
                       })}
                     </Box>
                   </Grid>
                 );
               })}
            </Grid>
            {hasActiveFilters && (
               <Box sx={{ mt: 4, pt: 3, textAlign: "center" }}>
                 <Button 
                   variant="text" 
                   onClick={() => {
                     setSelectedPiece([]);
                     setSelectedContext([]);
                     setSelectedStyle([]);
                     setSelectedMaterial([]);
                     setSelectedColor([]);
                   }}
                   sx={{ color: "rgba(255,255,255,0.4)", "&:hover": { color: "#fff", bgcolor: "transparent", textDecoration: "underline" } }}
                 >
                   Clear all filters
                 </Button>
               </Box>
            )}
          </Box>
        </Paper>

        {/* Toolbar: Results Count Toggle */}
        {hasActiveFilters && (
          <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", mb: 4, px: 1 }}>
             <Typography sx={{ color: "text.secondary", fontWeight: 500 }}>
               Showing <strong style={{color: "#1a1a1a"}}>{filteredItems.length}</strong> matching {filteredItems.length === 1 ? 'image' : 'images'}
             </Typography>
          </Box>
        )}

        {/* The Project Explorer Grid */}
        {!hasActiveFilters ? (
          <Box sx={{ p: 10, textAlign: "center", bgcolor: "#fcfcfc", borderRadius: 4, border: "1px dashed rgba(0,0,0,0.1)", boxShadow: "inset 0 0 20px rgba(0,0,0,0.02)" }}>
             <Typography variant="h5" sx={{ color: "#1a1a1a", fontFamily: "var(--font-heading)", mb: 2, fontWeight: 300 }}>
               Ready to explore our legacy?
             </Typography>
             <Typography sx={{ color: "text.secondary", fontSize: "1.1rem" }}>
               Select at least one tag from the interactive sentence above to begin loading tailored masterpieces.
             </Typography>
          </Box>
        ) : filteredItems.length > 0 ? (
          <>
            <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
              {filteredItems.slice(0, visibleCount).map(item => {
                const mainImage = item.primaryImage;

                return (
                <Grid item xs={6} sm={6} md={4} lg={3} key={item.id}>
                  <Paper
                    onClick={() => setSelectedImageItem(item)}
                    elevation={0}
                    sx={{
                      display: "block",
                      textDecoration: "none",
                      position: "relative",
                      borderRadius: 3,
                      overflow: "hidden",
                      bgcolor: "#f5f5f5",
                      height: { xs: 200, sm: 260, md: 320 },
                      cursor: "pointer",
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)",
                        zIndex: 1,
                        pointerEvents: "none",
                      },
                      "&:hover img": {
                        transform: "scale(1.05)",
                      },
                      "&:hover .mind-for-art-stamp": {
                        opacity: 1,
                        transform: "translateY(0)",
                      }
                    }}
                  >
                    <Box
                      component="img"
                      src={mainImage}
                      alt={item.title}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.5s ease",
                      }}
                    />

                    {/* Project Title at bottom */}
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
                        variant="h6"
                        sx={{
                          color: "#fff",
                          fontWeight: 600,
                          lineHeight: 1.2,
                          fontFamily: "var(--font-heading)",
                        }}
                      >
                        {item.title}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              );
            })}
            </Grid>
            
            {/* Load More Button */}
            {visibleCount < filteredItems.length && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
                <Box
                  component="button"
                  onClick={() => setVisibleCount(prev => prev + 12)}
                  sx={{
                    px: 6,
                    py: 2,
                    bgcolor: "transparent",
                    color: "#1a1a1a",
                    border: "2px solid rgba(0,0,0,0.1)",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      borderColor: "var(--brand-orange)",
                      color: "var(--brand-orange)",
                      bgcolor: "rgba(249,195,73, 0.05)"
                    }
                  }}
                >
                  Load More Images ({filteredItems.length - visibleCount} remaining)
                </Box>
              </Box>
            )}
          </>
        ) : (
          <Box sx={{ p: 10, textAlign: "center", bgcolor: "#faf9f6", borderRadius: 4, border: "1px dashed rgba(0,0,0,0.1)" }}>
             <Typography variant="h6" sx={{ color: "text.secondary", fontFamily: "var(--font-heading)" }}>
               No specific portfolio pieces found matching your exact custom criteria.
             </Typography>
             <Typography sx={{ color: "text.disabled", mt: 1 }}>
               Try expanding your sentence builder selections to view more of our legacy projects!
             </Typography>
          </Box>
        )}

        {/* Professional Image Lightbox Modal */}
        <Dialog
          open={!!selectedImageItem}
          onClose={() => setSelectedImageItem(null)}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            sx: {
              bgcolor: "#0a0a0a",
              backgroundImage: `
                radial-gradient(circle at 100% 0%, rgba(249,195,73,0.15) 0%, transparent 50%),
                linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
              `,
              backgroundSize: "100% 100%, 30px 30px, 30px 30px",
              borderRadius: { xs: 0, md: 3 },
              overflow: "hidden",
              m: { xs: 0, md: 2 },
              border: "1px solid rgba(255,255,255,0.1)",
              borderTop: "3px solid var(--brand-orange)",
              boxShadow: "0 40px 80px rgba(0,0,0,0.5)",
            }
          }}
        >
          {selectedImageItem && (
            <DialogContent sx={{ p: 0, position: "relative", display: "flex", flexDirection: "column" }}>
              {/* Close Button */}
              <IconButton
                onClick={() => setSelectedImageItem(null)}
                sx={{
                  position: "absolute",
                  right: 16,
                  top: 16,
                  color: "#fff",
                  bgcolor: "rgba(0,0,0,0.4)",
                  "&:hover": { bgcolor: "var(--brand-orange)" },
                  zIndex: 10,
                  backdropFilter: "blur(4px)"
                }}
              >
                <CloseIcon />
              </IconButton>
              
              {/* Main Image Container */}
              <Box 
                sx={{ 
                  width: "100%", 
                  height: { xs: "50vh", md: "75vh" },
                  position: "relative",
                  bgcolor: "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* Previous Arrow */}
                {currentIndex > 0 && (
                  <IconButton
                    onClick={handlePrevious}
                    sx={{
                      position: "absolute",
                      left: { xs: 8, md: 24 },
                      color: "rgba(255,255,255,0.7)",
                      bgcolor: "rgba(0,0,0,0.4)",
                      "&:hover": { bgcolor: "var(--brand-orange)", color: "#fff" },
                      zIndex: 10,
                      backdropFilter: "blur(4px)"
                    }}
                  >
                    <ArrowBackIosNewIcon />
                  </IconButton>
                )}

                <Box
                  component="img"
                  src={selectedImageItem.primaryImage}
                  alt={selectedImageItem.title}
                  sx={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                    transition: "opacity 0.2s ease"
                  }}
                />

                {/* Next Arrow */}
                {currentIndex < filteredItems.length - 1 && (
                  <IconButton
                    onClick={handleNext}
                    sx={{
                      position: "absolute",
                      right: { xs: 8, md: 24 },
                      color: "rgba(255,255,255,0.7)",
                      bgcolor: "rgba(0,0,0,0.4)",
                      "&:hover": { bgcolor: "var(--brand-orange)", color: "#fff" },
                      zIndex: 10,
                      backdropFilter: "blur(4px)"
                    }}
                  >
                    <ArrowForwardIosIcon />
                  </IconButton>
                )}
              </Box>

              {/* Detail Panel */}
              <Box sx={{ p: { xs: 3, md: 4 }, bgcolor: "#0a0a0a", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                  <Typography variant="h4" sx={{ color: "#fff", fontFamily: "var(--font-heading)", fontWeight: 300 }}>
                    {selectedImageItem.title}
                  </Typography>
                  <Typography sx={{ color: "rgba(255,255,255,0.3)", fontWeight: 600, fontSize: "0.9rem", mt: 1 }}>
                    {currentIndex + 1} / {filteredItems.length}
                  </Typography>
                </Box>
                
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {selectedImageItem.tagIds.map(tagId => {
                    const tag = initialTags.find(t => t.id === tagId);
                    if (!tag) return null;
                    return (
                      <Chip 
                        key={tag.id} 
                        label={tag.label} 
                        size="small" 
                        sx={{ 
                          bgcolor: "rgba(255,255,255,0.05)", 
                          color: "#ccc",
                          border: "1px solid rgba(255,255,255,0.1)",
                          "&:hover": { bgcolor: "rgba(249,195,73, 0.2)", color: "var(--brand-orange)", borderColor: "var(--brand-orange)" }
                        }} 
                      />
                    );
                  })}
                </Box>
              </Box>
            </DialogContent>
          )}
        </Dialog>

        {/* Old modal code completely stripped */}

      </Container>
    </ThemeProvider>
  );
}
