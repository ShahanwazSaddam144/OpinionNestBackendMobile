const express = require("express");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const Auth = require("./controllers/auth");
const chatHistory = require("./controllers/chatHistory");

dotenv.config();

const app = express();

/* =========================
   GLOBAL ERROR HANDLERS
========================= */
process.on("uncaughtException", (err) => {
  console.error("🔥 Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("🔥 Unhandled Rejection:", err);
});

/* =========================
   BASIC CONFIG
========================= */
const PORT = process.env.PORT || 5000;

/* =========================
   MIDDLEWARE
========================= */
app.use(cors({
  origin: "*", // tighten later in production
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* =========================
   RATE LIMITER (GLOBAL SAFE)
========================= */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/* Apply limiter globally (BEST FOR VPS STABILITY) */
app.use(limiter);

/* =========================
   ROUTES
========================= */
app.use("/api/auth", Auth);
app.use("/api", chatHistory);

/* =========================
   HEALTH CHECK (IMPORTANT FOR VPS)
========================= */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running ✅",
  });
});

/* =========================
   MONGODB CONNECTION (STABLE)
========================= */
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
    maxPoolSize: 10,
  })
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
  });

/* =========================
   START SERVER
========================= */
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

/* =========================
   HANDLE SERVER CRASH SAFELY
========================= */
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    console.log("Process terminated");
  });
});
