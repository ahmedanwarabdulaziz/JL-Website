"use client";

import { useState } from "react";
import { Box, Container, Typography, Tabs, Tab, Fade, Paper, useMediaQuery, useTheme } from "@mui/material";
import RestaurantMenuOutlinedIcon from "@mui/icons-material/RestaurantMenuOutlined";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";

const BRAND_ORANGE = "#fe812b";

const INDUSTRY_DATA = [
  {
    icon: <RestaurantMenuOutlinedIcon fontSize="large" />,
    label: "Hospitality & Dining",
    title: "Hospitality & Dining",
    content: "For restaurants, hotels, and cafes, the furniture is a central part of the guest experience. We specialize in custom booth and chair restoration for major names like The Westin Hotel and Boston Pizza, where high-traffic durability meets designer style. Our workshop utilizes a library of over 25,000 materials, featuring stain-resistant and fire-rated fabrics that are built to withstand the rigors of daily commercial use without losing their aesthetic appeal. By focusing on structural longevity, we ensure your establishment maintains its premium look for years."
  },
  {
    icon: <LocalHospitalOutlinedIcon fontSize="large" />,
    label: "Healthcare & Wellness",
    title: "Healthcare & Wellness",
    content: "Clinical environments require a specialized balance of hygiene and structural integrity. We provide professional reupholstery for dental chairs, chiropractic tables, and medical reception areas across Milton, Brampton, and Mississauga. Under the guidance of our lead engineer, Ahmed, every piece is assessed to ensure it meets the highest standards of stability and comfort. We utilize clinical-grade vinyls that are publicly described as anti-bacterial, mildew-resistant, and sulfide-resistant, ensuring your facility remains compliant and professional."
  },
  {
    icon: <AccountBalanceOutlinedIcon fontSize="large" />,
    label: "Institutional & Public Spaces",
    title: "Institutional & Public Spaces",
    content: "Managing large-scale upholstery for shopping centers like Square One Mall and university student housing requires professional logistics and a wide reputation for reliability. Our workshop-based model is designed to handle high-volume projects—from mall seating to community center furniture—with minimal downtime for your facility. We prioritize high-density, commercial-grade foam and frames reinforced for constant public use, supported by a regional pickup and delivery service that covers the entire Greater Toronto Area."
  },
  {
    icon: <BusinessCenterOutlinedIcon fontSize="large" />,
    label: "Corporate & Offices",
    title: "Corporate & Professional Offices",
    content: "First impressions matter in corporate environments like reception areas and executive lounges. We have a history of providing refined solutions for clients such as Deloitte, ensuring that office seating reflects a brand's professional standards. Whether it is updating a boardroom suite or restoring lobby furniture, we offer a \"mind for the art\" that combines sleek modern design with the structural durability required for a busy professional workspace."
  }
];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`industry-tabpanel-${index}`}
      aria-labelledby={`industry-tab-${index}`}
      {...other}
      sx={{ pt: { xs: 4, md: 6 } }}
    >
      <Fade in={value === index} timeout={500}>
         <Box>{children}</Box>
      </Fade>
    </Box>
  );
}

function a11yProps(index: number) {
  return {
    id: `industry-tab-${index}`,
    'aria-controls': `industry-tabpanel-${index}`,
  };
}

export default function CommercialIndustrySolutions() {
  const [value, setValue] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box component="section" sx={{ py: { xs: 8, md: 12 }, bgcolor: "#fdf8f4" }}>
      <Container maxWidth="lg" sx={{ px: { xs: 3, md: 6 } }}>
        <Box sx={{ textAlign: "center", mb: { xs: 6, md: 8 }, maxWidth: 800, mx: "auto" }}>
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
            Specialized Industry Solutions
          </Typography>
          <Typography
            component="h2"
            sx={{
              fontFamily: "var(--font-heading)",
              fontWeight: 600,
              fontSize: { xs: "2rem", md: "2.75rem" },
              color: "#1a1a1a",
              lineHeight: 1.2,
              mb: 3,
            }}
          >
            Engineered for High-Traffic <span style={{ color: BRAND_ORANGE, fontStyle: "italic" }}>Environments.</span>
          </Typography>
          <Typography
            sx={{
              color: "rgba(26,26,26,0.7)",
              fontSize: { xs: "1rem", md: "1.125rem" },
              lineHeight: 1.6,
              fontFamily: "var(--font-body)",
            }}
          >
            We provide deep, professional insights into how JL Upholstery serves specific sectors. Each solution is meticulously designed to build trust while matching the aesthetic of your brand.
          </Typography>
        </Box>

        <Paper 
          elevation={0} 
          sx={{ 
             borderRadius: 4, 
             overflow: "hidden", 
             border: "1px solid rgba(0,0,0,0.05)",
             boxShadow: "0 10px 40px rgba(0,0,0,0.03)",
             bgcolor: "#fff" 
          }}
        >
          <Box sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "#fafafa" }}>
            <Tabs 
              value={value} 
              onChange={handleChange} 
              aria-label="Industry Solutions Tabs"
              variant={isMobile ? "scrollable" : "fullWidth"}
              scrollButtons={isMobile ? "auto" : false}
              allowScrollButtonsMobile
              sx={{
                 "& .MuiTabs-indicator": {
                    backgroundColor: BRAND_ORANGE,
                    height: 3,
                    borderTopLeftRadius: 3,
                    borderTopRightRadius: 3,
                 }
              }}
            >
              {INDUSTRY_DATA.map((tab, index) => (
                <Tab 
                  key={index}
                  icon={tab.icon} 
                  iconPosition="top"
                  label={tab.label} 
                  {...a11yProps(index)} 
                  sx={{
                     py: 3,
                     px: { xs: 2, md: 3 },
                     color: "text.secondary",
                     fontFamily: "var(--font-heading)",
                     fontWeight: 600,
                     fontSize: { xs: "0.875rem", md: "1rem" },
                     letterSpacing: "0.02em",
                     textTransform: "none",
                     minHeight: 100,
                     transition: "color 0.3s ease",
                     "&.Mui-selected": {
                        color: BRAND_ORANGE,
                     },
                     "& .MuiSvgIcon-root": {
                        mb: 1,
                        transition: "color 0.3s ease",
                        color: value === index ? BRAND_ORANGE : "rgba(0,0,0,0.4)"
                     }
                  }}
                />
              ))}
            </Tabs>
          </Box>
          
          <Box sx={{ p: { xs: 4, md: 6, lg: 8 } }}>
             {INDUSTRY_DATA.map((tab, index) => (
               <TabPanel value={value} index={index} key={index}>
                 <Box sx={{ maxWidth: 900, mx: "auto" }}>
                    <Typography 
                      component="h3" 
                      sx={{ 
                        fontFamily: "var(--font-heading)", 
                        fontSize: { xs: "1.75rem", md: "2.25rem" }, 
                        fontWeight: 600, 
                        color: "#1a1a1a",
                        mb: 3,
                        display: "flex",
                        alignItems: "center",
                        gap: 2
                      }}
                    >
                      {tab.title}
                    </Typography>
                    <Typography 
                      component="p"
                      sx={{ 
                        fontFamily: "var(--font-body)", 
                        fontSize: { xs: "1.0625rem", md: "1.25rem" }, 
                        lineHeight: 1.8,
                        color: "rgba(26,26,26,0.8)",
                      }}
                    >
                      {tab.content}
                    </Typography>
                 </Box>
               </TabPanel>
             ))}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
