import { IJob } from "../utils/job.interface";
import { isAngularJob } from "../utils/angular-filter";
import { JobScrapper } from "../utils/types";

const REMOTE_OK_URL = "https://remoteok.com/api";

const scrapRemoteOk = async (): Promise<IJob[]> => {
  const response = await fetch(REMOTE_OK_URL);

  if (!response) {
    throw new Error("Failed to fetch data from RemoteOK");
  }

  const data = await response.json();

  const jobs: IJob[] = data
    .filter((item: any) => item.id)
    .map((item: any): any => ({
      title: item.position,
      company: item.company,
      description: item.description ?? "",

      location: item.location || null,

      remote: true,

      employmentType: item.employmentType ?? [],

      skills: item.tags ?? [],

      salary: {
        min: item.salary_min || undefined,
        max: item.salary_max || undefined,
        currency: undefined,
      },

      source: "Remote OK",

      sourceJobId: String(item.id),

      url: item.url,

      postedAt: item.date ? new Date(item.date) : null,

      scrapedAt: new Date(),
    }));

  return jobs.filter(isAngularJob);
};

export const remoteOkScrapper: JobScrapper = {
  name: "Remote Ok",
  scrap: scrapRemoteOk,
};
