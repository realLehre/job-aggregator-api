import express from "express";
import {
  getArbeitnowJobs,
  getHimalayasJobs,
  getRemoteOkJobs,
  getWWRJobs,
  scrapeAll,
} from "../controllers/jobs-controller";

const jobsRoutes = express.Router();

jobsRoutes.get("/remote-ok", getRemoteOkJobs);
jobsRoutes.get("/himalayas", getHimalayasJobs);
jobsRoutes.get("/wwr", getWWRJobs);
jobsRoutes.get("/arbeitnow", getArbeitnowJobs);
jobsRoutes.get("/all", scrapeAll);

export default jobsRoutes;
