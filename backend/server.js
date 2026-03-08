require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const authRoutes = require("./routes/authRoutes");
const voterRoutes = require("./routes/voterRoutes");
const candidateRoutes = require("./routes/candidateRoutes");
const votingRoutes = require("./routes/votingRoutes");
const otpRoutes = require("./routes/otpRoutes");

const app = express();
const server = http.createServer(app);


// ===== CORS CONFIGURATION =====
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://voting-system-b659.onrender.com"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true
  })
);


// ===== SOCKET.IO SETUP =====
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});


// ===== CREATE UPLOADS FOLDER =====
const uploadsDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}


// ===== MIDDLEWARE =====
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(uploadsDir));


// Attach socket instance to requests
app.use((req, res, next) => {
  req.io = io;
  next();
});


// ===== API ROUTES =====
app.use("/api/auth", authRoutes);
app.use("/api/voters", voterRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/voting", votingRoutes);
app.use("/api/otp", otpRoutes);


// ===== SOCKET CONNECTION =====
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});


// ===== DATABASE CONNECTION =====
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");

    server.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });
