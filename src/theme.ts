"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#9c27b0" },
  },
  typography: {
    htmlFontSize: 16,
    fontSize: 16,
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
