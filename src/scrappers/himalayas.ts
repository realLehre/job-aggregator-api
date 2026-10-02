import { JobScrapper } from "../utils/types";
import { IJob } from "../utils/job.interface";
import { isAngularJob } from "../utils/angular-filter";

const HIMALAYAS_URL = "https://himalayas.app/jobs/api/search?q=angular";

const scrapeHimalayas = async () => {
  const response = await fetch(HIMALAYAS_URL);

  const data = await response.json();

  const jobs: IJob[] = data.jobs.map((item: any): any => ({
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

  return jobs;
};

export const himalayasScrapper: JobScrapper = {
  name: "Himalayas",
  scrap: scrapeHimalayas,
};
