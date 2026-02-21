import { Container, Typography, Box } from "@mui/material";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function FabricPage() {
  return (
    <Box sx={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <Header />
      <Box component="main" sx={{ flex: 1, py: 6 }}>
        <Container maxWidth="md">
          <Typography component="h1" variant="h4" fontWeight={600} gutterBottom>
            Fabric
          </Typography>
          <Typography color="text.secondary">Content coming soon.</Typography>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}
