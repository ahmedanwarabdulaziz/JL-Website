import Link from "next/link";
import { Button, Container, Typography, Box, Stack } from "@mui/material";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function GalleryPage() {
  return (
    <Box sx={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <Header />
      <Box component="main" sx={{ flex: 1, py: 6 }}>
        <Container maxWidth="md">
          <Typography component="h1" variant="h4" fontWeight={600} gutterBottom>
            Gallery
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Content coming soon.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button component={Link} href="/projects" variant="contained">
              View projects
            </Button>
          </Stack>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}
