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
exports.deleteOldJobsController = exports.getJob = exports.allJobs = exports.scrapeAll = exports.getRemotiveJobs = exports.getArbeitnowJobs = exports.getWWRJobs = exports.getHimalayasJobs = exports.getRemoteOkJobs = void 0;
const async_handler_1 = __importDefault(require("../utils/async-handler"));
const remote_ok_1 = require("../scrappers/remote-ok");
const success_response_1 = __importDefault(require("../utils/success-response"));
const himalayas_1 = require("../scrappers/himalayas");
const jobs_service_1 = require("../services/jobs-service");
const scrappers_1 = require("../scrappers");
const wwr_1 = require("../scrappers/wwr");
const arbeitnow_1 = require("../scrappers/arbeitnow");
const remotive_1 = require("../scrappers/remotive");
const getRemoteOkJobs = (0, async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const total = yield remote_ok_1.remoteOkScrapper.scrape();
    if (!total)
        throw new Error("No data found");
    const responseData = { total };
    (0, success_response_1.default)({ res, responseData });
}));
exports.getRemoteOkJobs = getRemoteOkJobs;
const getHimalayasJobs = (0, async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const total = yield himalayas_1.himalayasScrapper.scrape();
    if (!total)
        throw new Error("No data found");
    const responseData = { total };
    (0, success_response_1.default)({ res, responseData });
}));
exports.getHimalayasJobs = getHimalayasJobs;
const getWWRJobs = (0, async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const total = yield wwr_1.wwrScrapper.scrape();
    if (!total)
        throw new Error("No data found");
    const responseData = { total };
    (0, success_response_1.default)({ res, responseData });
}));
exports.getWWRJobs = getWWRJobs;
const getArbeitnowJobs = (0, async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const total = yield arbeitnow_1.arbeitnowScrapper.scrape();
    if (!total)
        throw new Error("No data found");
    const responseData = { total };
    (0, success_response_1.default)({ res, responseData });
}));
exports.getArbeitnowJobs = getArbeitnowJobs;
const getRemotiveJobs = (0, async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const total = yield (0, remotive_1.scrapRemotive)();
    if (!total)
        throw new Error("No data found");
    const responseData = { total };
    (0, success_response_1.default)({ res, responseData });
}));
exports.getRemotiveJobs = getRemotiveJobs;
const scrapeAll = (0, async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const totalJobs = yield (0, jobs_service_1.scrapAllJobs)(scrappers_1.scrappers);
    if (!totalJobs)
        throw new Error("An error occured");
    const responseData = { total: totalJobs };
    (0, success_response_1.default)({ res, responseData });
}));
exports.scrapeAll = scrapeAll;
const allJobs = (0, async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("query", req.query);
    const jobs = yield (0, jobs_service_1.getAllJobs)(req.query);
    if (!jobs)
        throw new Error("Something went wrong");
    const responseData = { data: jobs };
    (0, success_response_1.default)({ res, responseData });
}));
exports.allJobs = allJobs;
const getJob = (0, async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const job = yield (0, jobs_service_1.getSingleJob)(id);
    if (!job)
        return res.status(404).json({ error: "Job not found" });
    const responseData = { data: job };
    (0, success_response_1.default)({ res, responseData });
}));
exports.getJob = getJob;
const deleteOldJobsController = (0, async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedCount = yield (0, jobs_service_1.deleteOldJobs)();
    const responseData = { deletedCount };
    (0, success_response_1.default)({ res, responseData, message: "Old jobs deleted successfully" });
}));
exports.deleteOldJobsController = deleteOldJobsController;
