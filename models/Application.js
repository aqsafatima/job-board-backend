const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  coverLetter: {
    type: String,
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
  resume: {
  type: String,
  default: null
},
status: {
  type: String,
  enum: ["pending", "shortlisted", "rejected", "interviewed", "hired"],
  default: "pending",
},


});

module.exports = mongoose.model("Application", applicationSchema);
