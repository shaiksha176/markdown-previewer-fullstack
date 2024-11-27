import express from "express";
import { marked } from "marked";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
const app = express();
const PORT = 5000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins or specify a specific one
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(cors());
io.on("connection", (socket) => {
  console.log("Client connected");

  // Listen for Markdown content
  socket.on("convertMarkdown", (markdown) => {
    try {
      const html = marked(markdown); // Convert Markdown to HTML
      // Emit the HTML back to the client
      socket.emit("htmlUpdate", html);
    } catch (error) {
      console.error("Error converting Markdown:", error);
      socket.emit("error", "Error converting Markdown");
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});
app.post("/convert", (req, res) => {
  const { markdown } = req.body;

  if (!markdown) {
    return res.status(400).json({ error: "Markdown content is required" });
  }

  try {
    const html = marked(markdown);
    res.json({ html });
  } catch (error) {
    res.status(500).json({ error: "Error converting markdown" });
  }
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
