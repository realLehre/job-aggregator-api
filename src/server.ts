import express from "express";
import "dotenv/config";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import jobsRoutes from "./routes/jobs-routes";

const app = express();
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use("/api/jobs/", jobsRoutes);

export default app;
