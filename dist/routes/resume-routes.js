"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const resume_controller_1 = require("../controllers/resume-controller");
const resume_upload_1 = __importDefault(require("../utils/resume-upload"));
const resumeRoutes = express_1.default.Router();
resumeRoutes
    .post("/upload", resume_upload_1.default.single("resume"), resume_controller_1.uploadResume)
    .post("/analyze", resume_controller_1.analyzeResume);
exports.default = resumeRoutes;
