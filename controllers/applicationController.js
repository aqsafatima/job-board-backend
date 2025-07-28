const Application = require("../models/Application");
const Job = require("../models/Job");
const User = require("../models/User");

const applyToJob = async (req, res) => {
  const { jobId, coverLetter } = req.body;
   console.log("ApplyToJob route hit"); // ✅ add this
  console.log("File:", req.file);
  console.log("Body:", req.body);

  try {
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ msg: "Job not found" });

    const alreadyApplied = await Application.findOne({
      job: jobId,
      applicant: req.user.id,
    });

    if (alreadyApplied)
      return res.status(400).json({ msg: "You already applied to this job" });

    const resumePath = req.file ? req.file.path : null;

    const application = new Application({
      job: jobId,
      applicant: req.user.id,
      coverLetter,
      resume: resumePath,
    });

    await application.save();

    res.status(201).json({ msg: "✅ Application submitted", application });
  } catch (err) {
    res.status(500).json({ msg: "❌ Server error", error: err.message });
  }
};


const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user.id })
      .populate("job")
      .sort({ appliedAt: -1 });

    res.status(200).json(applications);
  } catch (err) {
    res.status(500).json({ msg: "❌ Server error", error: err.message });
  }
};
const getApplicantsForMyJobs = async (req, res) => {
  try {
    const myJobs = await Job.find({ postedBy: req.user.id });
    const jobIds = myJobs.map((job) => job._id);

    const applications = await Application.find({ job: { $in: jobIds } })
      .populate("job", "title company") // to show job title & company
      .populate("applicant", "name email"); // to show applicant info

    res.status(200).json(applications);
  } catch (err) {
    res.status(500).json({ msg: "❌ Server error", error: err.message });
  }
};
const updateApplicationStatus = async (req, res) => {
  const { applicationId } = req.params;
  const { status } = req.body;

  const validStatuses = ["pending", "shortlisted", "rejected", "interviewed", "hired"];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ msg: "Invalid status" });
  }
  

  try {
    const application = await Application.findById(applicationId).populate("job");
    const job = await Job.findById(application.job);

if (!job) {
  return res.status(404).json({ msg: "Job not found" });
}

if (job.postedBy.toString() !== req.user.id) {
  return res.status(403).json({ msg: "Not authorized to update this application" });
}

    if (!application) {
      return res.status(404).json({ msg: "Application not found" });
    }

    // Only job owner can update status
    if (application.job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized to update this application" });
    }

    application.status = status;
    await application.save();

    res.status(200).json({ msg: "✅ Status updated", application });
  } catch (err) {
    res.status(500).json({ msg: "❌ Server error", error: err.message });
  }
};


module.exports = { applyToJob, getMyApplications, getApplicantsForMyJobs, updateApplicationStatus };
