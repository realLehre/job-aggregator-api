"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAngularJob = void 0;
const ANGULAR_KEYWORDS = ["angular", "angularjs"];
const isAngularJob = (job) => {
    const searchTerms = [job.title, job.company, job.description, job.skills]
        .join(" ")
        .toLowerCase();
    return ANGULAR_KEYWORDS.some((keyword) => {
        return searchTerms.includes(keyword);
    });
};
exports.isAngularJob = isAngularJob;
