import { IJob } from "./job.interface";

export const deDuplicator = (jobs: IJob[]): IJob[] => {
  const jobSeen = new Set<string>();

  return jobs.filter((j) => {
    const jobKey = duplicateKey(j);
    if (jobSeen.has(jobKey)) {
      return false;
    }
    jobSeen.add(jobKey);
    return true;
  });
};

const duplicateKey = (job: IJob) => {
  return `${job.title}-${job.company}-${job.url}`;
};
