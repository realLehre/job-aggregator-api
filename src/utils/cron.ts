import cron from "node-cron";

import {
  saveJobs,
  scrapAllJobs,
  updateJobs,
  deleteOldJobs,
} from "../services/jobs-service";
import { scrappers } from "../scrappers";

const startJobScraper = () => {
  cron.schedule("0 */6 * * *", async () => {
    try {
      await scrapAllJobs(scrappers);
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

const deleteOldJobsCron = () => {
  cron.schedule("0 */8 * * *", async () => {
    try {
      const count = await deleteOldJobs();
      console.log(
        `Scheduled delete old jobs completed: ${count} jobs deleted.`,
      );
    } catch (error) {
      console.error("Scheduled delete old jobs failed:", error);
    }
  });
};

export { startJobScraper, updateJobsInDb, deleteOldJobsCron };
