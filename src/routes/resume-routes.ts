import express from "express";
import { analyzeResume, uploadResume } from "../controllers/resume-controller";
import resumeUpload from "../utils/resume-upload";

const resumeRoutes = express.Router();

resumeRoutes
  .post("/upload", resumeUpload.single("resume"), uploadResume)
  .post("/analyze", analyzeResume);

export default resumeRoutes;
