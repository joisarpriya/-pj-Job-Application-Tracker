const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const path = require("path");

// ensure DB tables exist (idempotent)
require("./setup/dbInit");

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "ApplyFlow backend running 🚀",
  });
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/applications", require("./routes/applications"));
app.use("/api/interviews", require("./routes/interviews"));
app.use("/api/stats", require("./routes/stats"));
app.use("/api/resumes", require("./routes/resumes"));
app.use("/api/quizzes", require("./routes/quizzes"));
app.use("/api/matches", require("./routes/matches"));
app.use("/api/prep", require("./routes/prep"));
app.use("/api/messages", require("./routes/messages"));

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";

const server = app.listen(PORT, HOST, () => {
  let addr = null;
  if (server && typeof server.address === 'function') {
    addr = server.address();
  }
  if (addr && addr.address && addr.port) {
    console.log(`Backend running on ${addr.address}:${addr.port}`);
    console.log("Server address:", addr);
  } else {
    console.log(`Backend running, but address info unavailable. HOST: ${HOST}, PORT: ${PORT}`);
  }
});

server.on('error', (err) => {
  if (err && err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Stop the conflicting process or set a different PORT and restart.`);
  } else {
    console.error('Server error:', err);
  }
  // Exit so the process manager or user can see and fix the failure quickly
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
});
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
});
