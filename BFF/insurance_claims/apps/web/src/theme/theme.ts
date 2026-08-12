import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1565C0",
    },
    secondary: {
      main: "#26A69A",
    },
    background: {
      default: "#F5F7FA",
    },
  },

  typography: {
    fontFamily: "Roboto, sans-serif",
  },

  shape: {
    borderRadius: 8,
  },
});

export default theme;