import React, { useState, useEffect } from "react";
import {
  TextField,
  Box,
  Typography,
  Paper,
  Button,
  useTheme,
} from "@mui/material";
import axios from "axios";
import Grid from "@mui/material/Grid2";
import { io, Socket } from "socket.io-client";

const Editor: React.FC = () => {
  const [markdown, setMarkdown] = useState<string>("");
  const [htmlPreview, setHtmlPreview] = useState<string>("");
  const [socket, setSocket] = useState<Socket | null>(null); // Type the state as Socket | null
  const theme = useTheme();

  useEffect(() => {
    // Connect to the Socket.IO server
    const socket = io("http://localhost:5000");
    setSocket(socket);

    socket.on("htmlUpdate", (html) => {
      setHtmlPreview(html); // Update the preview with the converted HTML
    });

    socket.on("error", (message) => {
      console.error(message);
    });

    return () => {
      socket.disconnect(); // Cleanup when the component is unmounted
    };
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMarkdown = event.target.value;
    setMarkdown(newMarkdown);

    // Emit the Markdown content to the backend
    if (socket && socket.connected) {
      socket.emit("convertMarkdown", newMarkdown);
    }
  };

  // Function to send Markdown to the backend for conversion
  const convertMarkdownToHTML = async () => {
    try {
      const response = await axios.post("http://localhost:5000/convert", {
        markdown,
      });
      setHtmlPreview(response.data.html);
    } catch (error) {
      console.error("Error converting markdown:", error);
    }
  };

  // Function to reset the markdown
  const resetMarkdown = () => {
    setMarkdown("");
    setHtmlPreview("");
  };

  return (
    <Box sx={{ minHeight: "100vh", padding: { xs: 2, md: 3 } }}>
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        sx={{
          fontSize: {
            xs: "1.5rem",
            sm: "2rem",
            md: "3rem",
          },
          pb: 2,
        }}
      >
        Markdown Previewer
      </Typography>

      <Grid container spacing={3}>
        {/* Markdown Editor */}
        <Grid size={{ md: 6, xs: 12 }}>
          <Paper
            elevation={3}
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              padding: { xs: 2, md: 3 },
            }}
          >
            <Typography variant="h6" align="center" sx={{ paddingBottom: 2 }}>
              Markdown Editor
            </Typography>

            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                overflowY: "auto",
                borderTop: "1px solid #ccc",
                borderRadius: "4px",
              }}
            >
              <TextField
                fullWidth
                multiline
                minRows={8}
                variant="outlined"
                value={markdown}
                onChange={handleInputChange}
                placeholder="Start typing Markdown here..."
                sx={{
                  marginBottom: 2,
                }}
              />
              {/* <Button
                variant="contained"
                onClick={convertMarkdownToHTML}
                sx={{
                  alignSelf: "flex-end",
                  width: "fit-content",
                }}
              >
                Convert to HTML
              </Button> */}
            </Box>
          </Paper>
        </Grid>

        {/* Live Preview */}
        <Grid size={{ md: 6, xs: 12 }}>
          <Paper
            elevation={3}
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              padding: { xs: 2, md: 3 },
            }}
          >
            <Typography variant="h6" align="center" sx={{ paddingBottom: 2 }}>
              Live Preview
            </Typography>

            <Box
              dangerouslySetInnerHTML={{ __html: htmlPreview }}
              sx={{
                flex: 1,
                overflowY: "auto",
                borderTop: "1px solid #ccc",
                borderRadius: "4px",
                padding: 2,
                backgroundColor: theme.palette.background.paper,
              }}
            />
          </Paper>
        </Grid>
      </Grid>

      {/* Reset Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
        <Button variant="outlined" color="error" onClick={resetMarkdown}>
          Reset
        </Button>
      </Box>
    </Box>
  );
};

export default Editor;
