"use client";

import { Box, Typography } from "@mui/material";

export default function AdminPage() {
  return (
    <Box>
      <Typography
        component="h1"
        variant="h4"
        fontWeight={600}
        gutterBottom
        sx={{ fontSize: { xs: "1.35rem", md: "1.5rem" } }}
      >
        Dashboard
      </Typography>
      <Typography color="text.secondary" sx={{ fontSize: { xs: "0.95rem", md: "1rem" } }}>
        Use the menu to manage tags and add upholstery pieces.
      </Typography>
    </Box>
  );
}
