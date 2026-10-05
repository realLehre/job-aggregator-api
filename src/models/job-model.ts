import mongoose from "mongoose";

const SourceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sourceJobId: { type: String, default: null },
    url: { type: String },
    canonicalUrl: { type: String, default: null },
  },
  { _id: false },
);

const JobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String },
    description: { type: String, required: true },
    location: { type: String },
    remote: { type: Boolean },
    salary: {
      min: Number,
      max: Number,
      currency: String,
    },
    employmentType: [{ type: String }],
    skills: { type: [String], required: true },

    source: { type: String, required: true },
    sourceJobId: { type: String },
    url: { type: String, required: true },

    fingerprint: { type: String, required: true, unique: true },
    sources: [SourceSchema],

    postedAt: { type: Date },
    scrapedAt: { type: Date, required: true },
    lastSeenAt: { type: Date, required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

JobSchema.index({ "sources.canonicalUrl": 1 });

const Jobs = mongoose.model("Jobs", JobSchema);

export default Jobs;
