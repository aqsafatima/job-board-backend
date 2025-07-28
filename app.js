const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jobRoutes = require("./routes/jobRoutes");
require("dotenv").config();


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/jobs", jobRoutes);
app.use("/uploads", express.static("uploads"));


const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);

const userRoutes = require("./routes/userRoutes"); // if it's in userRoutes.js
app.use("/api/user", userRoutes);

const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);

const applicationRoutes = require("./routes/applicationRoutes");
app.use("/api/applications", applicationRoutes);


// Test route
app.get("/", (req, res) => {
  res.send("🌐 Job Board API is running");
});

// DB connect
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅ MongoDB connected");
  app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
})
.catch(err => console.error("❌ DB error:", err));
