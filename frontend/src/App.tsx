import {
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Typography,
  Switch,
  Box,
} from "@mui/material";
import MarkdownEditor from "./Editor";
import { useState } from "react";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    background: {
      default: "#ffffff",
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
    },
    background: {
      default: "#121212",
    },
  },
});

function App() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };
  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            pt: 2,
          }}
        >
          <Switch checked={isDarkMode} onChange={toggleTheme} />
          <Typography variant="body2" color="text.primary">
            {isDarkMode ? "Dark Mode" : "Light Mode"}
          </Typography>
        </Box>

        <MarkdownEditor />
      </Container>
    </ThemeProvider>
  );
}

export default App;
