import { JobScrapper } from "../utils/types";
import { IJob } from "../utils/job.interface";
import { deDuplicator } from "../utils/deduplicator";

export const scrapAllJobs = async (scapers: JobScrapper[]): Promise<any> => {
  const result = await Promise.allSettled(scapers.map((s) => s.scrap()));

  const jobs: IJob[] = [];

  result.forEach((r, index) => {
    const scraper = scapers[index];

    if (r.status === "fulfilled") {
      jobs.push(...r.value);
    } else {
      console.error(`Error occurred while scraping ${scraper.name}:`, r.reason);
    }
  });

  return deDuplicator(jobs);
};
