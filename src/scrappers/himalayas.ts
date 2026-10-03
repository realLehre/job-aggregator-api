import { JobScrapper } from "../utils/types";
import { IJob } from "../utils/job.interface";
import { isAngularJob } from "../utils/angular-filter";
import { saveJobs } from "../services/jobs-service";

const HIMALAYAS_URL = "https://himalayas.app/jobs/api/search?q=angular";

const scrapeHimalayas = async () => {
  let hasNexPage: boolean = true;
  let page = 1;
  const jobs: IJob[] = [];
  let cursor: string | null = null;

  while (true) {
    const url: string = cursor
      ? `${HIMALAYAS_URL}&cursor=${encodeURIComponent(cursor)}`
      : HIMALAYAS_URL;
    const url2 = `${HIMALAYAS_URL}&page=${page}`;
    const response = await fetch(url2);

    const pageResponse = await response.json();

    const lastJob = pageResponse.jobs[pageResponse.jobs.length - 1];
    const isTooOld = lastJob ? isOlderThanTwoMonths(lastJob) : true;

    if (!pageResponse.jobs || pageResponse.jobs.length === 0 || page >= 20) {
      break;
    }

    jobs.push(
      ...pageResponse.jobs.map((item: any): any => ({
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
      })),
    );

    // cursor = pageResponse.nextCursor ?? null;
    //
    // if (!cursor) {
    //   break;
    // }

    await saveJobs(jobs);

    console.log({
      page: {
        index: page,
        jobs: pageResponse.jobs.length,
        totalCount: pageResponse.totalCount,
        nextCursor: pageResponse.nextCursor,
      },
    });

    page++;
  }

  return [];
};

const isOlderThanTwoMonths = (timeStamp: number): boolean => {
  const date = new Date(timeStamp * 1000);
  const now = new Date();
  const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
  return date < twoMonthsAgo;
};

export const himalayasScrapper: JobScrapper = {
  name: "Himalayas",
  scrap: scrapeHimalayas,
};
