import { Request, Response } from "express";

import asyncWrapper from "../utils/async-handler";
import { remoteOkScrapper } from "../scrappers/remote-ok";
import successResponse from "../utils/success-response";
import { himalayasScrapper } from "../scrappers/himalayas";
import { getAllJobs, saveJobs, scrapAllJobs } from "../services/jobs-service";
import { scrappers } from "../scrappers";
import { wwrScrapper } from "../scrappers/wwr";
import { arbeitnowScrapper } from "../scrappers/arbeitnow";
import { Query } from "../utils/job.interface";

const getRemoteOkJobs = asyncWrapper(async (req: Request, res: Response) => {
  const data = await remoteOkScrapper.scrap();

  if (!data) throw new Error("No data found");

  const responseData = { total: data.length, data };
  successResponse({ res, responseData });
});

const getHimalayasJobs = asyncWrapper(async (req: Request, res: Response) => {
  const data = await himalayasScrapper.scrap();

  if (!data) throw new Error("No data found");

  const responseData = { total: data.length, data };
  successResponse({ res, responseData });
});

const getWWRJobs = asyncWrapper(async (req: Request, res: Response) => {
  const data = await wwrScrapper.scrap();

  if (!data) throw new Error("No data found");

  const responseData = { total: data?.length, data };
  successResponse({ res, responseData });
});

const getArbeitnowJobs = asyncWrapper(async (req: Request, res: Response) => {
  const data = await arbeitnowScrapper.scrap();

  if (!data) throw new Error("No data found");

  const responseData = { total: data?.length, data };
  successResponse({ res, responseData });
});

const scrapeAll = asyncWrapper(async (req: Request, res: Response) => {
  const jobs = await scrapAllJobs(scrappers);

  if (!jobs) throw new Error("An error occured")!;

  const responseData = { total: jobs.length, data: jobs };
  successResponse({ res, responseData });
});

const allJobs = asyncWrapper(async (req: Request, res: Response) => {
  const jobs = await getAllJobs(req.query);

  if (!jobs) throw new Error("Something went wrong");

  const responseData = { data: jobs };
  successResponse({ res, responseData });
});

export {
  getRemoteOkJobs,
  getHimalayasJobs,
  getWWRJobs,
  getArbeitnowJobs,
  scrapeAll,
  allJobs,
};
