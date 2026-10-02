import { IJob } from "../utils/job.interface";
import { isAngularJob } from "../utils/angular-filter";
import { JobScrapper } from "../utils/types";

const ARBEITNOW_URL = "https://www.arbeitnow.com/api/job-board-api";

const scrapeArbeitnow = async (): Promise<IJob[]> => {
  const response = await fetch(ARBEITNOW_URL);
  if (!response.ok) {
    throw new Error(`Arbeitnow request failed: ${response.status}`);
  }

  const data = await response.json();

  const jobs: IJob[] = data.data.map((item: any): IJob => ({
    title: item.title,
    company: item.company_name,
    description: item.description ?? "",

    location: item.location || null,

    remote: item.remote ?? false,

    employmentType: item.job_type ?? [],

    skills: item.tags ?? [],

    salary: undefined,

    source: "Arbeitnow",

    sourceJobId: item.slug ?? null,

    url: item.url,

    postedAt: item.created_at ? new Date(item.created_at * 1000) : undefined,

    scrapedAt: new Date(),
  }));

  return jobs.filter(isAngularJob);
};

export const arbeitnowScrapper: JobScrapper = {
  name: "Arbeitnow",
  scrap: scrapeArbeitnow,
};
