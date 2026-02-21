import Link from "next/link";
import { Button, Container, Typography, Box } from "@mui/material";

export default function HomePage() {
  return (
    <Container maxWidth="md" sx={{ px: 2 }}>
      <Box
        sx={{
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 3,
          py: 3,
        }}
      >
        <Typography
          component="h1"
          variant="h3"
          fontWeight={600}
          sx={{ fontSize: { xs: "1.75rem", sm: "2.5rem" }, textAlign: "center" }}
        >
          Welcome to JL Website
        </Typography>
        <Typography color="text.secondary" textAlign="center">
          A simple home page. Sign in or go to admin.
        </Typography>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
          <Button component={Link} href="/login" variant="contained" size="large" sx={{ minHeight: 48, minWidth: 120 }}>
            Login
          </Button>
          <Button component={Link} href="/admin" variant="outlined" size="large" sx={{ minHeight: 48, minWidth: 120 }}>
            Admin
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
