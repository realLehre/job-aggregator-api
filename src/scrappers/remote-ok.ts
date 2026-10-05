import { IJob } from "../utils/job.interface";
import { isAngularJob } from "../utils/angular-filter";
import { JobScrapper } from "../utils/types";
import { saveJobs } from "../services/jobs-service";
import { fetchJson } from "../utils/http-safety";

const REMOTE_OK_URL = "https://remoteok.com/api";
const TAGS = [
  "angular",
  "frontend",
  "javascript",
  "typescript",
  "react",
  "dev",
  "engineer",
];

const scrapRemoteOk = async (
  onBatch?: (jobs: IJob[]) => Promise<void>,
): Promise<number> => {
  let total = 0;
  const response = await fetchJson(`${REMOTE_OK_URL}?tag=${TAGS.join(",")}`);

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

  const angularJobs = jobs.filter(isAngularJob);

  await saveJobs(angularJobs);

  if (onBatch) {
    await onBatch(angularJobs);
  }

  return angularJobs.length;
};

export const remoteOkScrapper: JobScrapper = {
  name: "Remote Ok",
  scrape: scrapRemoteOk,
};
