require("dotenv").config();
const express = require("express");
const next = require("next");
const http = require("http");
const { Server } = require("socket.io");
const Redis = require("ioredis");
const passport = require("./passport-config");
const authService = require("./auth-service");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const port = process.env.PORT || 3000;
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

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

  // Redis Subscriber for Real-time updates
  const redisSubscriber = new Redis(REDIS_URL, {
    maxRetriesPerRequest: null,
  });

  redisSubscriber.on("error", (err) => {
    console.error("Redis Subscriber Error:", err);
  });

  redisSubscriber.subscribe("ctf:solves", (err, count) => {
    if (err) {
      console.error("Failed to subscribe to Redis channel:", err);
    } else {
      console.log(`Subscribed to ${count} Redis channel(s).`);
    }
  });

  redisSubscriber.on("message", (channel, message) => {
    if (channel === "ctf:solves") {
      try {
        const data = JSON.parse(message);
        io.emit("new-solve", data);
      } catch (error) {
        console.error("Error parsing Redis message:", error);
      }
    }
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

  // Next.js Handler
  server.all("/*", (req, res) => {
    return handle(req, res);
  });

  httpServer.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Monolith Ready on http://localhost:${port}`);
  });
});
