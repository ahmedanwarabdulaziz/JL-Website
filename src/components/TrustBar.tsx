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
        py: { xs: 6, md: 8 },
        bgcolor: "#fafafa",
        borderBottom: "1px solid rgba(0,0,0,0.05)",
        position: "relative",
        zIndex: 10,
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 4, md: 6 } }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 4, md: 3, lg: 4 }}
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
                  position: "relative",
                  "&::after": {
                    content: '""',
                    display: { xs: "none", md: index < ITEMS.length - 1 ? "block" : "none" },
                    position: "absolute",
                    right: { md: "-16px", lg: "-20px" },
                    top: "10%",
                    height: "80%",
                    width: "1px",
                    bgcolor: "rgba(0,0,0,0.08)",
                  }
                }}
              >
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    bgcolor: "rgba(254,129,43,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2.5,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      bgcolor: "var(--brand-orange)",
                      "& > svg": { color: "#fff" }
                    }
                  }}
                >
                  <Icon sx={{ color: "var(--brand-orange)", fontSize: 28, transition: "color 0.3s ease" }} />
                </Box>
                
                <Typography
                  component="h3"
                  sx={{
                    fontFamily: "var(--font-heading)",
                    fontWeight: 700,
                    color: "#1a1a1a",
                    fontSize: { xs: "1.25rem", sm: "1.35rem" },
                    letterSpacing: "0.02em",
                    lineHeight: 1.3,
                    mb: 1.5,
                    fontVariantNumeric: "lining-nums", // Forces numbers to align uniformly on the baseline
                    fontFeatureSettings: '"lnum" 1', // Fallback for some browsers
                  }}
                >
                  {item.title}
                </Typography>
                
                <Typography
                  sx={{
                    color: "rgba(0,0,0,0.65)",
                    fontSize: "0.9375rem",
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

