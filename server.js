import "dotenv/config";
import express from "express";
import next from "next";
import http from "http";
import { Server } from "socket.io";
import passport from "./passport-config";
import authService from "./auth-service";

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
  server.use(passport.initialize());

  // Auth Routes
  server.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] }),
  );

  server.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      session: false,
      failureRedirect: "/login",
    }),
    (req, res) => {
      const token = authService.generateToken(req.user);
      // In a monolith, we can redirect to a frontend route with the token
      // or return JSON if the frontend expects it.
      // The original auth-service returned JSON.
      res.json({
        message: "Authentication successful",
        token: token,
        user: {
          id: req.user.id,
          username: req.user.username,
          email: req.user.email,
        },
      });
    },
  );

  // Next.js Catch-all Handler (Must be last)
  server.all("*", (req, res) => {
    return handle(req, res);
  });

  httpServer.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Monolith Ready on http://localhost:${port}`);
  });
});
