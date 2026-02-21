"use client";

import { createTheme } from "@mui/material/styles";

const BRAND_ORANGE = "#fe812b";

const theme = createTheme({
  palette: {
    primary: { main: BRAND_ORANGE },
    secondary: { main: BRAND_ORANGE },
    background: { default: "#fafafa", paper: "#fff" },
    text: { primary: "#1a1a1a", secondary: "rgba(26,26,26,0.72)" },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
    h1: { fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 600, letterSpacing: "0.02em" },
    h2: { fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 600, letterSpacing: "0.02em" },
    h3: { fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 600, letterSpacing: "0.01em" },
    h4: { fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 600 },
    h5: { fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 600 },
    h6: { fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 600 },
    body1: { letterSpacing: "0.01em" },
    body2: { letterSpacing: "0.01em" },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          minHeight: 44,
          minWidth: 44,
          padding: "10px 20px",
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        slotProps: {
          input: { style: { minHeight: 44 } },
        },
      },
    },
  },
});

export default theme;
