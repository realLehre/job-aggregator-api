import { IJob } from "./job.interface";

export interface JobScrapper {
  name: string;
  scrape(onBatch?: (jobs: IJob[]) => Promise<void>): Promise<number>;
}
