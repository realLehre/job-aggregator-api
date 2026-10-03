import mongoose from "mongoose";

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String },
  description: { type: String, required: true },

  location: { type: String },
  remote: { type: Boolean },

  salary: {
    min: { type: Number },
    max: { type: Number },
    currency: { type: String },
  },

  employmentType: [{ type: String }],
  skills: { type: [String], required: true },

  source: { type: String, required: true },
  sourceJobId: { type: String },
  url: { type: String, required: true },

  postedAt: { type: Date },
  scrapedAt: { type: Date, required: true },
  lastSeenAt: { type: Date, required: true },
  active: { type: Boolean, default: true },
});

const Jobs = mongoose.model("Jobs", JobSchema);

export default Jobs;
