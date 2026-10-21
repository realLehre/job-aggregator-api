"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const SourceSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    sourceJobId: { type: String, default: null },
    url: { type: String },
    canonicalUrl: { type: String, default: null },
}, { _id: false });
const JobSchema = new mongoose_1.default.Schema({
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
}, { timestamps: true });
JobSchema.index({ "sources.canonicalUrl": 1 });
JobSchema.index({ postedAt: -1, _id: -1 });
const Jobs = mongoose_1.default.model("Jobs", JobSchema);
exports.default = Jobs;
