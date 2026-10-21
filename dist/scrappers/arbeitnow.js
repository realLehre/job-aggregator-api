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
exports.arbeitnowScrapper = void 0;
const jobs_service_1 = require("../services/jobs-service");
const http_safety_1 = require("../utils/http-safety");
const ARBEITNOW_URL = "https://www.arbeitnow.com/api/job-board-api";
const scrapeArbeitnow = (onBatch) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let page = 1;
    let total = 0;
    const jobs = [];
    while (page <= 200) {
        let data;
        try {
            data = yield (0, http_safety_1.fetchJson)(`${ARBEITNOW_URL}?page=${page}`);
        }
        catch (err) {
            console.error(`Arbeitnow: page ${page} failed after retries`, err);
            break; // keep what we already saved
        }
        const items = (_a = data === null || data === void 0 ? void 0 : data.data) !== null && _a !== void 0 ? _a : [];
        if (items.length === 0)
            break;
        if (!items || items.length === 0) {
            break;
        }
        const pageJobs = items.map((item) => {
            var _a, _b, _c, _d, _e;
            return ({
                title: item.title,
                company: item.company_name,
                description: (_a = item.description) !== null && _a !== void 0 ? _a : "",
                location: item.location || null,
                remote: (_b = item.remote) !== null && _b !== void 0 ? _b : false,
                employmentType: (_c = item.job_type) !== null && _c !== void 0 ? _c : [],
                skills: (_d = item.tags) !== null && _d !== void 0 ? _d : [],
                salary: undefined,
                source: "Arbeitnow",
                sourceJobId: (_e = item.slug) !== null && _e !== void 0 ? _e : null,
                url: item.url,
                postedAt: item.created_at ? new Date(item.created_at * 1000) : undefined,
                scrapedAt: new Date(),
            });
        });
        if (onBatch) {
            yield onBatch(pageJobs);
        }
        jobs.push(...pageJobs);
        yield (0, jobs_service_1.saveJobs)(pageJobs);
        page++;
        yield (0, http_safety_1.sleep)(500);
    }
    return jobs.length;
});
exports.arbeitnowScrapper = {
    name: "Arbeitnow",
    scrape: scrapeArbeitnow,
};
