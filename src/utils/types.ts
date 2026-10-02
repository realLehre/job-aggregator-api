import { IJob } from "./job.interface";

export interface JobScrapper {
  name: string;
  scrap(): Promise<IJob[]>;
}
