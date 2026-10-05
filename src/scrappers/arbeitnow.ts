import { IJob } from "../utils/job.interface";
import { isAngularJob } from "../utils/angular-filter";
import { JobScrapper } from "../utils/types";
import { saveJobs } from "../services/jobs-service";
import { fetchJson, sleep } from "../utils/http-safety";

const ARBEITNOW_URL = "https://www.arbeitnow.com/api/job-board-api";

const scrapeArbeitnow = async (
  onBatch?: (jobs: IJob[]) => Promise<void>,
): Promise<number> => {
  let page = 1;
  let total = 0;
  const jobs: IJob[] = [];

  while (page <= 200) {
    let data;
    try {
      data = await fetchJson(`${ARBEITNOW_URL}?page=${page}`);
    } catch (err) {
      console.error(`Arbeitnow: page ${page} failed after retries`, err);
      break; // keep what we already saved
    }

    const items: [] = data?.data ?? [];
    if (items.length === 0) break;

    if (!items || items.length === 0) {
      break;
    }

    const pageJobs: IJob[] = items.map((item: any): IJob => ({
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

    if (onBatch) {
      await onBatch(pageJobs);
    }

    jobs.push(...pageJobs);

    await saveJobs(pageJobs);

    page++;
    await sleep(500);
  }

  return jobs.length;
};

export const arbeitnowScrapper: JobScrapper = {
  name: "Arbeitnow",
  scrape: scrapeArbeitnow,
};
