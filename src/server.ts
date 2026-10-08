import express from "express";
import "dotenv/config";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import jobsRoutes from "./routes/jobs-routes";
import resumeRoutes from "./routes/resume-routes";
import { notFoundRoute } from "./utils/route-not-found";

const app = express();
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use("/api/jobs/", jobsRoutes);
app.use("/api/resume/", resumeRoutes);
app.use(notFoundRoute);

export default app;
