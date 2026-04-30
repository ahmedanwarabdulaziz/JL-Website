import { Box, Container, Typography, Stack, Paper } from "@mui/material";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import StyleRoundedIcon from "@mui/icons-material/StyleRounded";
import SpaRoundedIcon from "@mui/icons-material/SpaRounded";

const ITEMS = [
  { 
    id: "legacy", 
    icon: WorkspacePremiumRoundedIcon, 
    title: "A 30-Year Family Legacy", 
    description: "A wide reputation built on trust and craftsmanship." 
  },
  { 
    id: "gta", 
    icon: LocalShippingRoundedIcon, 
    title: "Serving the Entire GTA", 
    description: "Professional pickup and delivery for Milton, Brampton, Oakville, Mississauga, Burlington, Georgetown, and Guelph." 
  },
  { 
    id: "materials", 
    icon: StyleRoundedIcon, 
    title: "25,000+ Material Options", 
    description: "Premium fabrics, leathers, and high-performance vinyls." 
  },
  { 
    id: "sustainability", 
    icon: SpaRoundedIcon, 
    title: "Sustainability & Quality", 
    description: "Utilizing eco-friendly high-density foams and sustainable textiles." 
  },
];


export default function TrustBar() {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: "#faf9f6",
        position: "relative",
        zIndex: 10,
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 4, md: 6 } }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 3, md: 3, lg: 4 }}
          alignItems="stretch"
          justifyContent="space-between"
        >
          {ITEMS.map((item, index) => {
            const Icon = item.icon;
            return (
              <Box
                key={item.id}
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: { xs: "center", md: "flex-start" },
                  textAlign: { xs: "center", md: "left" },
                  p: { xs: 4, md: 4, lg: 5 },
                  background: "linear-gradient(145deg, #f8f9fa 0%, #e2e4e8 100%)",
                  borderRadius: "24px",
                  border: "1px solid rgba(0,0,0,0.03)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.02)",
                  position: "relative",
                  overflow: "hidden",
                  transition: "all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.06)",
                    border: "1px solid rgba(249,195,73,0.3)",
                    "& .icon-container": {
                      transform: "scale(1.1)",
                    },
                    "&::before": {
                      opacity: 1
                    }
                  },
                  // Subtle top glow line
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    background: "linear-gradient(90deg, #f9c349 0%, #dfb042 100%)",
                    opacity: 0,
                    transition: "opacity 0.4s ease",
                  }
                }}
              >
                <Box
                  className="icon-container"
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: "16px",
                    bgcolor: "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start", // align icon to the left to match text
                    mb: { xs: 2, md: 3 },
                    transition: "all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)",
                  }}
                >
                  <Icon sx={{ color: "var(--brand-orange)", fontSize: 40, transition: "transform 0.4s ease" }} />
                </Box>
                
                <Typography
                  component="h3"
                  sx={{
                    fontFamily: "var(--font-heading)",
                    fontWeight: 700,
                    color: "#1a1a1a",
                    fontSize: { xs: "1.35rem", sm: "1.45rem", lg: "1.55rem" },
                    letterSpacing: "0.01em",
                    lineHeight: 1.3,
                    mb: 2,
                    fontVariantNumeric: "lining-nums", 
                    fontFeatureSettings: '"lnum" 1', 
                  }}
                >
                  {item.title}
                </Typography>
                
                <Typography
                  sx={{
                    color: "rgba(0,0,0,0.65)",
                    fontSize: "1rem",
                    letterSpacing: "0.01em",
                    lineHeight: 1.6,
                    fontFamily: "var(--font-body)",
                    maxWidth: { xs: "320px", md: "100%" },
                  }}
                >
                  {item.description}
                </Typography>
              </Box>
            );
          })}
        </Stack>
      </Container>
    </Box>
  );
}

