"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jobs_controller_1 = require("../controllers/jobs-controller");
const scrape_protection_1 = require("../utils/scrape-protection");
const jobsRoutes = express_1.default.Router();
jobsRoutes
    .get("/", jobs_controller_1.allJobs)
    .get("/remote-ok", jobs_controller_1.getRemoteOkJobs)
    .get("/himalayas", jobs_controller_1.getHimalayasJobs)
    .get("/wwr", jobs_controller_1.getWWRJobs)
    .get("/arbeitnow", jobs_controller_1.getArbeitnowJobs)
    .get("/remotive", jobs_controller_1.getRemotiveJobs)
    .get("/:id", jobs_controller_1.getJob)
    .post("/scrape/all", scrape_protection_1.requireScraperSecret, jobs_controller_1.scrapeAll)
    .delete("/old", scrape_protection_1.requireScraperSecret, jobs_controller_1.deleteOldJobsController);
exports.default = jobsRoutes;
