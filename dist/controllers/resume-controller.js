"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeResume = exports.uploadResume = void 0;
const async_handler_1 = __importDefault(require("../utils/async-handler"));
const resume_service_1 = __importDefault(require("../services/resume-service"));
const success_response_1 = __importDefault(require("../utils/success-response"));
const ai_service_1 = require("../ai/providers/ai-service");
const multer_1 = __importDefault(require("multer"));
const uploadResume = (0, async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        return res.status(400).json({
            error: "Please upload a PDF resume",
        });
    }
    const text = yield (0, resume_service_1.default)(req.file.buffer);
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
    (0, success_response_1.default)({ res, responseData });
}));
exports.uploadResume = uploadResume;
const uploadNone = (0, multer_1.default)().none();
const analyzeResume = [
    uploadNone,
    (0, async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { resumeText, jobTitle, jobSkills, JobDescription } = req.body;
        const analysis = yield (0, ai_service_1.analyzeJobMatch)(resumeText, jobTitle, jobSkills ? JSON.parse(jobSkills) : [], JobDescription);
        const responseData = {
            analysis,
        };
        (0, success_response_1.default)({ res, responseData });
    })),
];
exports.analyzeResume = analyzeResume;
