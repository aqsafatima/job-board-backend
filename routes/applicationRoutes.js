const express = require("express");
const router = express.Router();
const { applyToJob, getMyApplications, getApplicantsForMyJobs, updateApplicationStatus } = require("../controllers/applicationController");
const authMiddleware = require("../middlewares/authMiddleware");

const upload = require("../middlewares/upload");

router.post(
  "/apply",
  authMiddleware,
  upload.single("resume"),
  applyToJob
);

router.get("/my-applications", authMiddleware, getMyApplications);
router.get(
  "/applicants",
  authMiddleware,
  (req, res, next) => {
    if (req.user.role !== "employer") {
      return res.status(403).json({ msg: "Only employers can access this route" });
    }
    next();
  },
  getApplicantsForMyJobs
);
router.patch(
  "/status/:applicationId",
  authMiddleware,
  updateApplicationStatus
);




module.exports = router;
