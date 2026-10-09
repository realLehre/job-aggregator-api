import express from "express";
import {
  allJobs,
  getArbeitnowJobs,
  getHimalayasJobs,
  getRemoteOkJobs,
  getRemotiveJobs,
  getWWRJobs,
  scrapeAll,
  getJob,
} from "../controllers/jobs-controller";
import { requireScraperSecret } from "../utils/scrape-protection";

const jobsRoutes = express.Router();

jobsRoutes
  .get("/", allJobs)
  .get("/remote-ok", getRemoteOkJobs)
  .get("/himalayas", getHimalayasJobs)
  .get("/wwr", getWWRJobs)
  .get("/arbeitnow", getArbeitnowJobs)
  .get("/remotive", getRemotiveJobs)
  .get("/:id", getJob)
  .post("/scrape/all", requireScraperSecret, scrapeAll);

export default jobsRoutes;
