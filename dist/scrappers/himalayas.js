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
exports.himalayasScrapper = void 0;
const jobs_service_1 = require("../services/jobs-service");
const http_safety_1 = require("../utils/http-safety");
const HIMALAYAS_URL = "https://himalayas.app/jobs/api";
const scrapeHimalayas = (onBatch) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let page = 1;
    const jobs = [];
    let total = 0;
    while (page <= 200) {
        let data;
        try {
            data = yield (0, http_safety_1.fetchJson)(`${HIMALAYAS_URL}?page=${page}`);
        }
        catch (err) {
            console.error(`Himalayas: page ${page} failed after retries`, err);
            break; // keep what we already saved
        }
        const items = (_a = data === null || data === void 0 ? void 0 : data.jobs) !== null && _a !== void 0 ? _a : [];
        if (items.length === 0)
            break;
        if (!items || items.length === 0) {
            break;
        }
        const pageJobs = items.map((item) => {
            var _a, _b;
            return ({
                title: item.title,
                company: item.companyName,
                description: (_a = item.description) !== null && _a !== void 0 ? _a : "",
                location: item.locationRestrictions
                    ? item.locationRestrictions.join(", ")
                    : null,
                remote: true,
                employmentType: item.employmentType || [],
                skills: (_b = item.categories) !== null && _b !== void 0 ? _b : [],
                salary: {
                    min: item.minSalary || undefined,
                    max: item.maxSalary || undefined,
                    currency: item.currency || undefined,
                },
                source: "Himalayas",
                sourceJobId: String(item.guid),
                url: item.applicationLink,
                postedAt: item.pubDate ? new Date(item.pubDate * 1000) : null,
                scrapedAt: new Date(),
            });
        });
        if (onBatch) {
            yield onBatch(pageJobs);
        }
        jobs.push(...pageJobs);
        total += jobs.length;
        yield (0, jobs_service_1.saveJobs)(pageJobs);
        page++;
        yield (0, http_safety_1.sleep)(500);
    }
    return total;
});
const isOlderThanTwoMonths = (timeStamp) => {
    const date = new Date(timeStamp * 1000);
    const now = new Date();
    const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    return date < twoMonthsAgo;
};
exports.himalayasScrapper = {
    name: "Himalayas",
    scrape: scrapeHimalayas,
};
