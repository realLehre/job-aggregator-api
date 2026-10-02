import cron from "node-cron";

import { scrapAllJobs } from "../services/jobs-service";
import { scrappers } from "../scrappers";

export const startJobScraper = () => {
  cron.schedule("0 */6 * * *", async () => {
    try {
      const jobs = await scrapAllJobs(scrappers);
    } catch (error) {
      console.error("Scheduled job scrape failed:", error);
    }
  });
};
