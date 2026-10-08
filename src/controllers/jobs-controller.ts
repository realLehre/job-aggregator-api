import { Request, Response } from "express";

import asyncWrapper from "../utils/async-handler";
import { remoteOkScrapper } from "../scrappers/remote-ok";
import successResponse from "../utils/success-response";
import { himalayasScrapper } from "../scrappers/himalayas";
import {
  getAllJobs,
  getSingleJob,
  scrapAllJobs,
} from "../services/jobs-service";
import { scrappers } from "../scrappers";
import { wwrScrapper } from "../scrappers/wwr";
import { arbeitnowScrapper } from "../scrappers/arbeitnow";
import { Query } from "../utils/job.interface";
import { scrapRemotive } from "../scrappers/remotive";

const getRemoteOkJobs = asyncWrapper(async (req: Request, res: Response) => {
  const total = await remoteOkScrapper.scrape();

  if (!total) throw new Error("No data found");

  const responseData = { total };
  successResponse({ res, responseData });
});

const getHimalayasJobs = asyncWrapper(async (req: Request, res: Response) => {
  const total = await himalayasScrapper.scrape();

  if (!total) throw new Error("No data found");

  const responseData = { total };
  successResponse({ res, responseData });
});

const getWWRJobs = asyncWrapper(async (req: Request, res: Response) => {
  const total = await wwrScrapper.scrape();

  if (!total) throw new Error("No data found");

  const responseData = { total };
  successResponse({ res, responseData });
});

const getArbeitnowJobs = asyncWrapper(async (req: Request, res: Response) => {
  const total = await arbeitnowScrapper.scrape();

  if (!total) throw new Error("No data found");

  const responseData = { total };
  successResponse({ res, responseData });
});

const getRemotiveJobs = asyncWrapper(async (req: Request, res: Response) => {
  const total = await scrapRemotive();

  if (!total) throw new Error("No data found");

  const responseData = { total };
  successResponse({ res, responseData });
});

const scrapeAll = asyncWrapper(async (req: Request, res: Response) => {
  const totalJobs = await scrapAllJobs(scrappers);

  if (!totalJobs) throw new Error("An error occured")!;

  const responseData = { total: totalJobs };
  successResponse({ res, responseData });
});

const allJobs = asyncWrapper(async (req: Request, res: Response) => {
  console.log("query", req.query);
  const jobs = await getAllJobs(req.query);

  if (!jobs) throw new Error("Something went wrong");

  const responseData = { data: jobs };
  successResponse({ res, responseData });
});

const getJob = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const job = await getSingleJob(id);

  if (!job) return res.status(404).json({ error: "Job not found" });

  const responseData = { data: job };
  successResponse({ res, responseData });
});

export {
  getRemoteOkJobs,
  getHimalayasJobs,
  getWWRJobs,
  getArbeitnowJobs,
  getRemotiveJobs,
  scrapeAll,
  allJobs,
  getJob,
};
