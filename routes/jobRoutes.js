const express = require("express");
const router = express.Router();
const authenticateUser = require("../middlewares/authMiddleware");
const checkRole = require("../middlewares/roleMiddleware");
const { postJob, getAllJobs, getMyJobs, updateJob, deleteJob   } = require("../controllers/jobController");

// Admin can post a job
router.post(
  "/",
  authenticateUser,
  checkRole(["admin"]),
  postJob
);

// Anyone can see jobs
router.get("/", getAllJobs);
router.get("/my-jobs", authenticateUser, getMyJobs);
router.put("/:id", authenticateUser, updateJob);
router.delete("/delete/:id", authenticateUser, deleteJob);



module.exports = router;
