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
exports.wwrScrapper = void 0;
const rss_parser_1 = __importDefault(require("rss-parser"));
const jobs_service_1 = require("../services/jobs-service");
const parser = new rss_parser_1.default();
const WWR_FEEDS = [
    "https://weworkremotely.com/remote-jobs.rss",
    "https://weworkremotely.com/categories/remote-programming-jobs.rss",
    "https://weworkremotely.com/categories/remote-front-end-programming-jobs.rss",
    "https://weworkremotely.com/categories/remote-full-stack-programming-jobs.rss",
    "https://weworkremotely.com/categories/remote-back-end-programming-jobs.rss",
    "https://weworkremotely.com/categories/remote-devops-sysadmin-jobs.rss",
    "https://weworkremotely.com/categories/all-other-remote-jobs.rss",
];
const scrapWWR = (onBatch) => __awaiter(void 0, void 0, void 0, function* () {
    let total = 0;
    for (const url of WWR_FEEDS) {
        const response = yield parser.parseURL(url);
        total += response.items.length;
        const jobs = response.items.map((item) => {
            var _a, _b, _c, _d, _e, _f, _g;
            return ({
                title: (_a = item.title) !== null && _a !== void 0 ? _a : "",
                company: (_b = item.company) !== null && _b !== void 0 ? _b : "",
                description: (_c = item.content) !== null && _c !== void 0 ? _c : "",
                location: (_d = item.location) !== null && _d !== void 0 ? _d : "",
                remote: true,
                employmentType: (_e = item.employmentType) !== null && _e !== void 0 ? _e : [],
                skills: (_f = item.categories) !== null && _f !== void 0 ? _f : [],
                salary: {
                    min: item.salary_min || undefined,
                    max: item.salary_max || undefined,
                    currency: undefined,
                },
                source: "WeWorkRemotely",
                sourceJobId: String(item.guid),
                url: (_g = item.link) !== null && _g !== void 0 ? _g : "",
                postedAt: item.isoDate ? new Date(item.isoDate) : undefined,
                scrapedAt: new Date(),
            });
        });
        if (onBatch) {
            yield onBatch(jobs);
        }
        yield (0, jobs_service_1.saveJobs)(jobs);
        total += jobs.length;
    }
    return total;
});
exports.wwrScrapper = {
    name: "WWR",
    scrape: scrapWWR,
};
