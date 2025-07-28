const Job = require("../models/Job");

const postJob = async (req, res) => {
  const { title, company, description, location, salary } = req.body;

  try {
    const newJob = new Job({
      title,
      company,
      description,
      location,
      salary,
      postedBy: req.user.id, // from authMiddleware
    });
    console.log(newJob);

    await newJob.save();
    res.status(201).json({ msg: "✅ Job posted", job: newJob });
  } catch (err) {
    res.status(500).json({ msg: "❌ Server error", error: err.message });
  }
};

const getAllJobs = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // default to page 1
  const limit = parseInt(req.query.limit) || 5; // default 5 jobs per page
  const skip = (page - 1) * limit;

  try {
    const jobs = await Job.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Job.countDocuments();

    res.status(200).json({
      total,
      page,
      totalPages: Math.ceil(total / limit),
      jobs,
    });
  } catch (err) {
    res.status(500).json({ msg: "❌ Failed to fetch jobs", error: err.message });
  }
};

const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ msg: "❌ Server error", error: err.message });
  }
};
const updateJob = async (req, res) => {
  const { id } = req.params;
  const { title, description, company, location } = req.body;

  try {
    const job = await Job.findById(id);

    if (!job) return res.status(404).json({ msg: "Job not found" });

    // Only allow the user who created the job to update it
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Unauthorized to update this job" });
    }

    // Update the job
    job.title = title || job.title;
    job.description = description || job.description;
    job.company = company || job.company;
    job.location = location || job.location;

    await job.save();
    res.status(200).json({ msg: "✅ Job updated successfully", job });
  } catch (err) {
    res.status(500).json({ msg: "❌ Server error", error: err.message });
  }
};

const deleteJob = async (req, res) => {
  const { id } = req.params;

  try {
    const job = await Job.findById(id);

    if (!job) return res.status(404).json({ msg: "❌ Job not found" });

    // Check if the logged-in user is the owner
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ msg: "❌ Not allowed to delete this job" });
    }

    await Job.findByIdAndDelete(id);

    res.status(200).json({ msg: "🗑️ Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "❌ Server error", error: err.message });
  }
};


module.exports = { postJob, getAllJobs, getMyJobs, updateJob, deleteJob };

