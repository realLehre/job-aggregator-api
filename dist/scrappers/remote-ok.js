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
Object.defineProperty(exports, "__esModule", { value: true });
exports.remoteOkScrapper = void 0;
const angular_filter_1 = require("../utils/angular-filter");
const jobs_service_1 = require("../services/jobs-service");
const http_safety_1 = require("../utils/http-safety");
const REMOTE_OK_URL = "https://remoteok.com/api";
const TAGS = [
    "angular",
    "frontend",
    "javascript",
    "typescript",
    "react",
    "dev",
    "engineer",
];
const scrapRemoteOk = (onBatch) => __awaiter(void 0, void 0, void 0, function* () {
    let total = 0;
    const response = yield (0, http_safety_1.fetchJson)(`${REMOTE_OK_URL}?tag=${TAGS.join(",")}`);
    if (!response) {
        throw new Error("Failed to fetch data from RemoteOK");
    }
    const data = yield response.json();
    const jobs = data
        .filter((item) => item.id)
        .map((item) => {
        var _a, _b, _c;
        return ({
            title: item.position,
            company: item.company,
            description: (_a = item.description) !== null && _a !== void 0 ? _a : "",
            location: item.location || null,
            remote: true,
            employmentType: (_b = item.employmentType) !== null && _b !== void 0 ? _b : [],
            skills: (_c = item.tags) !== null && _c !== void 0 ? _c : [],
            salary: {
                min: item.salary_min || undefined,
                max: item.salary_max || undefined,
                currency: undefined,
            },
            source: "Remote OK",
            sourceJobId: String(item.id),
            url: item.url,
            postedAt: item.date ? new Date(item.date) : null,
            scrapedAt: new Date(),
        });
    });
    const angularJobs = jobs.filter(angular_filter_1.isAngularJob);
    yield (0, jobs_service_1.saveJobs)(angularJobs);
    if (onBatch) {
        yield onBatch(angularJobs);
    }
    return angularJobs.length;
});
exports.remoteOkScrapper = {
    name: "Remote Ok",
    scrape: scrapRemoteOk,
};
