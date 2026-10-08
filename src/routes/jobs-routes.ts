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

const jobsRoutes = express.Router();

jobsRoutes
  .get("/", allJobs)
  .get("/remote-ok", getRemoteOkJobs)
  .get("/himalayas", getHimalayasJobs)
  .get("/wwr", getWWRJobs)
  .get("/arbeitnow", getArbeitnowJobs)
  .get("/remotive", getRemotiveJobs)
  .get("/:id", getJob)
  .post("/scrape/all", scrapeAll);

export default jobsRoutes;
