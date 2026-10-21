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
exports.deleteOldJobsCron = exports.updateJobsInDb = exports.startJobScraper = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const jobs_service_1 = require("../services/jobs-service");
const scrappers_1 = require("../scrappers");
const startJobScraper = () => {
    node_cron_1.default.schedule("0 */6 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield (0, jobs_service_1.scrapAllJobs)(scrappers_1.scrappers);
        }
        catch (error) {
            console.error("Scheduled job scrape failed:", error);
        }
    }));
};
exports.startJobScraper = startJobScraper;
const updateJobsInDb = () => {
    node_cron_1.default.schedule("1 0 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield (0, jobs_service_1.updateJobs)();
        }
        catch (error) {
            console.error("Scheduled update job failed:", error);
        }
    }));
};
exports.updateJobsInDb = updateJobsInDb;
const deleteOldJobsCron = () => {
    node_cron_1.default.schedule("2 0 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const count = yield (0, jobs_service_1.deleteOldJobs)();
            console.log(`Scheduled delete old jobs completed: ${count} jobs deleted.`);
        }
        catch (error) {
            console.error("Scheduled delete old jobs failed:", error);
        }
    }));
};
exports.deleteOldJobsCron = deleteOldJobsCron;
