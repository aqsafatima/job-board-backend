const express = require("express");
const router = express.Router();
const authenticateUser = require("../middlewares/authMiddleware");
const checkRole = require("../middlewares/roleMiddleware");

// Protected route
router.get("/dashboard", authenticateUser, (req, res) => {
  res.json({
    msg: `Welcome to the dashboard, ${req.user.role} ${req.user.id}`,
  });
});

// Only Admin Route Example
router.post(
  "/post-job",
  authenticateUser,
  checkRole(["admin"]), // only admin can post
  (req, res) => {
    res.json({ msg: "✅ Job posted successfully (but only by admin)" });
  }
);

module.exports = router;
