"use client";

import { createTheme } from "@mui/material/styles";

// Get values from CSS variables defined in globals.css for centralization
const BRAND_ORANGE = "var(--brand-orange)";
const FONT_HEADING = "var(--font-heading)";
const FONT_BODY = "var(--font-body)";

const theme = createTheme({
  palette: {
    primary: { main: "#fe812b" }, // MUI needs an actual hex for some internal calculations, but we can still use variables elsewhere
    secondary: { main: "#fe812b" },
    background: { default: "#fafafa", paper: "#fff" },
    text: { primary: "#1a1a1a", secondary: "rgba(26,26,26,0.72)" },
  },
  typography: {
    fontFamily: FONT_BODY,
    h1: { fontFamily: FONT_HEADING, fontWeight: 600, letterSpacing: "0.02em" },
    h2: { fontFamily: FONT_HEADING, fontWeight: 600, letterSpacing: "0.02em" },
    h3: { fontFamily: FONT_HEADING, fontWeight: 600, letterSpacing: "0.01em" },
    h4: { fontFamily: FONT_HEADING, fontWeight: 600 },
    h5: { fontFamily: FONT_HEADING, fontWeight: 600 },
    h6: { fontFamily: FONT_HEADING, fontWeight: 600 },
    body1: { letterSpacing: "0.01em", fontFamily: FONT_BODY },
    body2: { letterSpacing: "0.01em", fontFamily: FONT_BODY },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          minHeight: 44,
          minWidth: 44,
          padding: "10px 20px",
          fontFamily: FONT_BODY,
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
