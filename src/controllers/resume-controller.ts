import { Request, Response } from "express";

import asyncWrapper from "../utils/async-handler";
import extractResumeText from "../services/resume-service";
import successResponse from "../utils/success-response";
import { analyzeJobMatch } from "../ai/providers/ai-service";
import multer from "multer";

const uploadResume = asyncWrapper(async (req: any, res: Response) => {
  if (!req.file) {
    return res.status(400).json({
      error: "Please upload a PDF resume",
    });
  }

  const text = await extractResumeText(req.file.buffer);

  if (!text.trim()) {
    return res.status(400).json({
      error: "Could not extract text from the PDF",
    });
  }

  const responseData = {
    status: "success",
    fileName: req.file.originalname,
    text,
  };

  successResponse({ res, responseData });
});

const uploadNone = multer().none();

const analyzeResume = [
  uploadNone,
  asyncWrapper(async (req: Request, res: Response) => {
    const { resumeText, jobTitle, jobSkills, JobDescription } = req.body;

    const analysis = await analyzeJobMatch(
      resumeText,
      jobTitle,
      jobSkills ? JSON.parse(jobSkills) : [],
      JobDescription,
    );

    const responseData = {
      analysis,
    };

    successResponse({ res, responseData });
  }),
];

export { uploadResume, analyzeResume };
