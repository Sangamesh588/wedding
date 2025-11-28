const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

dotenv.config();

// MODELS
const Guest = require("./models/Guest");
const Wish = require("./models/Wish");
const Admin = require("./models/Admin");

// APP
const app = express();
app.use(express.json());
app.use(cors());

// MONGO
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;

/* ---------------- ADMIN LOGIN ---------------- */
app.post("/api/admin/login", async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username });
  if (!admin) return res.status(400).json({ error: "Invalid username" });

  const match = await bcrypt.compare(password, admin.password);
  if (!match) return res.status(400).json({ error: "Invalid password" });

  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
    expiresIn: "12h",
  });

  res.json({ success: true, token });
});

function adminAuth(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: "No token" });

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

/* ---------------- RSVP ---------------- */
app.post("/api/rsvp", async (req, res) => {
  try {
    const guest = new Guest(req.body);
    res.json(await guest.save());
  } catch {
    res.status(500).json({ error: "Failed to save RSVP" });
  }
});

app.get("/api/admin/rsvps", adminAuth, async (req, res) => {
  res.json(await Guest.find().sort({ createdAt: -1 }));
});

/* ---------------- WISHES ---------------- */
app.post("/api/wishes", async (req, res) => {
  try {
    const wish = new Wish(req.body);
    res.json(await wish.save());
  } catch {
    res.status(500).json({ error: "Failed to save wish" });
  }
});

app.get("/api/admin/wishes", adminAuth, async (req, res) => {
  res.json(await Wish.find().sort({ createdAt: -1 }));
});

/* ---------------- STATIC FRONTEND ---------------- */

// 1. Serve all static files in /public (css, js, html, images)
app.use(express.static(path.join(__dirname, "public")));

// 2. Admin login page
app.get("/admin.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"));
});

// 3. Admin dashboard
app.get("/dashboard.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

// 4. Wedding site fallback — ONLY for normal URLs (not admin, not API)
app.get(/^\/(?!api)(?!admin)(?!dashboard)[^\.]*$/, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// START SERVER
app.listen(PORT, () => console.log("Server running"));
