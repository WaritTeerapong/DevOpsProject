import "dotenv/config";
import express from "express";
import next from "next";
import http from "http";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const port = process.env.PORT || 3000;

app.prepare().then(() => {
  const server = express();
  const httpServer = http.createServer(server);

  // Initialize Socket.io
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A client connected to Monolith WS:", socket.id);
    socket.on("disconnect", () => {
      console.log("Client disconnected from Monolith WS:", socket.id);
    });
  });

  // Middleware
  server.use(express.json());

  // Next.js Catch-all Handler (Must be last)
  server.all("/*splat", (req, res) => {
    return handle(req, res);
  });

  httpServer.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Monolith Ready on http://localhost:${port}`);
  });
});
