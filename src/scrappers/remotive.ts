import Parser from "rss-parser";
import { JobScrapper } from "../utils/types";
import { IJob } from "../utils/job.interface";
import { saveJobs } from "../services/jobs-service";

const parser = new Parser();

const REMOTIVE_FEEDS = [
  "https://remotive.com/remote-jobs/feed/software-development",
];

export const scrapRemotive = async (
  onBatch?: (jobs: IJob[]) => Promise<void>,
): Promise<any> => {
  let total = 0;
  let testJobs: IJob[] = [];

  for (const url of REMOTIVE_FEEDS) {
    const response = await parser.parseURL(url);
    total += response.items.length;

    const jobs: IJob[] = response.items.map((item) => ({
      title: item.title ?? "",
      company: item.company ?? "",
      description: item.content ?? "",

      location: item.location ?? "",

      remote: true,

      employmentType: [item.type ?? []],

      skills: item.categories ?? [],

      salary: {
        min: item.salary_min || undefined,
        max: item.salary_max || undefined,
        currency: undefined,
      },

      source: "Remotive",

      sourceJobId: String(item.guid),

      url: item.link ?? "",

      postedAt: item.pubDate ? new Date(item.pubDate) : undefined,

      scrapedAt: new Date(),
    }));

    if (onBatch) {
      await onBatch(jobs);
    }

    await saveJobs(jobs);

    testJobs.push(...jobs);

    total += jobs.length;
  }
  return testJobs;
};

export const remotiveScrapper: JobScrapper = {
  name: "Remotive",
  scrape: scrapRemotive,
};
