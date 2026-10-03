import cron from "node-cron";

import { saveJobs, scrapAllJobs, updateJobs } from "../services/jobs-service";
import { scrappers } from "../scrappers";

const startJobScraper = () => {
  cron.schedule("0 */6 * * *", async () => {
    try {
      const jobs = await scrapAllJobs(scrappers);
      await saveJobs(jobs);
    } catch (error) {
      console.error("Scheduled job scrape failed:", error);
    }
  });
};

const updateJobsInDb = () => {
  cron.schedule("1 0 * * *", async () => {
    try {
      await updateJobs();
    } catch (error) {
      console.error("Scheduled update job failed:", error);
    }
  });
};

export { startJobScraper, updateJobsInDb };
