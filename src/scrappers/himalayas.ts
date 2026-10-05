import { JobScrapper } from "../utils/types";
import { IJob } from "../utils/job.interface";
import { isAngularJob } from "../utils/angular-filter";
import { saveJobs } from "../services/jobs-service";
import { fetchJson, sleep } from "../utils/http-safety";

const HIMALAYAS_URL = "https://himalayas.app/jobs/api";

const scrapeHimalayas = async (onBatch?: (jobs: IJob[]) => Promise<void>) => {
  let page = 1;
  const jobs: IJob[] = [];
  let total = 0;

  while (page <= 200) {
    let data;
    try {
      data = await fetchJson(`${HIMALAYAS_URL}?page=${page}`);
    } catch (err) {
      console.error(`Himalayas: page ${page} failed after retries`, err);
      break; // keep what we already saved
    }

    const items: [] = data?.jobs ?? [];
    if (items.length === 0) break;

    if (!items || items.length === 0) {
      break;
    }

    const pageJobs: IJob[] = items.map((item: any): any => ({
      title: item.title,
      company: item.companyName,
      description: item.description ?? "",
      location: item.locationRestrictions
        ? item.locationRestrictions.join(", ")
        : null,
      remote: true,
      employmentType: item.employmentType || [],
      skills: item.categories ?? [],
      salary: {
        min: item.minSalary || undefined,
        max: item.maxSalary || undefined,
        currency: item.currency || undefined,
      },
      source: "Himalayas",
      sourceJobId: String(item.guid),
      url: item.applicationLink,
      postedAt: item.pubDate ? new Date(item.pubDate * 1000) : null,
      scrapedAt: new Date(),
    }));

    if (onBatch) {
      await onBatch(pageJobs);
    }

    jobs.push(...pageJobs);

    total += jobs.length;

    await saveJobs(pageJobs);

    page++;
    await sleep(500);
  }

  return total;
};

const isOlderThanTwoMonths = (timeStamp: number): boolean => {
  const date = new Date(timeStamp * 1000);
  const now = new Date();
  const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
  return date < twoMonthsAgo;
};

export const himalayasScrapper: JobScrapper = {
  name: "Himalayas",
  scrape: scrapeHimalayas,
};
