import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: ["Roboto", '"Helvetica Neue"', "Arial", "sans-serif"].join(","),
    h1: {
      fontFamily: "Roboto",
      fontWeight: 500,
    },
  },
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#ff9800",
    },
    success: {
      main: "#388e3c",
    },
    error: {
      main: "#f44336",
    },
    warning: {
      main: "#ff5722",
    },
    info: {
      main: "#03a9f4",
    },
    text: {
      primary: "#333",
      secondary: "#666",
    },
    background: {
      default: "#fff",
    },
  },
});

export default theme;
