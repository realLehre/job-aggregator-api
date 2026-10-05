import express from "express";
import {
  allJobs,
  getArbeitnowJobs,
  getHimalayasJobs,
  getRemoteOkJobs,
  getRemotiveJobs,
  getWWRJobs,
  scrapeAll,
} from "../controllers/jobs-controller";

const jobsRoutes = express.Router();

jobsRoutes
  .get("/all", allJobs)
  .get("/remote-ok", getRemoteOkJobs)
  .get("/himalayas", getHimalayasJobs)
  .get("/wwr", getWWRJobs)
  .get("/arbeitnow", getArbeitnowJobs)
  .get("/remotive", getRemotiveJobs)
  .post("/scrape/all", scrapeAll);

export default jobsRoutes;
