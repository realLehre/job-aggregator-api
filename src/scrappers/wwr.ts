import Parser from "rss-parser";
import { JobScrapper } from "../utils/types";
import { IJob } from "../utils/job.interface";

const parser = new Parser();

const WWR_URL =
  "https://weworkremotely.com/categories/remote-front-end-programming-jobs.rss";

const scrapWWR = async (): Promise<IJob[]> => {
  const response = await parser.parseURL(WWR_URL);

  const jobs: IJob[] = response.items.map((item) => ({
    title: item.title ?? "",
    company: item.company ?? "",
    description: item.content ?? "",

    location: item.location ?? "",

    remote: true,

    employmentType: item.employmentType ?? [],

    skills: item.categories ?? [],

    salary: {
      min: item.salary_min || undefined,
      max: item.salary_max || undefined,
      currency: undefined,
    },

    source: "WeWorkRemotely",

    sourceJobId: String(item.guid),

    url: item.link ?? "",

    postedAt: item.isoDate ? new Date(item.isoDate) : undefined,

    scrapedAt: new Date(),
  }));
  return jobs;
};

export const wwrScrapper: JobScrapper = {
  name: "WWR",
  scrap: scrapWWR,
};
