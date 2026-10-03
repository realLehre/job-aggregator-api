import { JobScrapper } from "../utils/types";
import { IJob, Query } from "../utils/job.interface";
import { deDuplicator } from "../utils/deduplicator";
import Jobs from "../models/job-model";

const scrapAllJobs = async (scapers: JobScrapper[]): Promise<any> => {
  const result = await Promise.allSettled(scapers.map((s) => s.scrap()));

  const jobs: IJob[] = [];

  result.forEach((r, index) => {
    const scraper = scapers[index];

    if (r.status === "fulfilled") {
      jobs.push(...r.value);
    } else {
      console.error(`Error occurred while scraping ${scraper.name}:`, r.reason);
    }
  });

  return deDuplicator(jobs);
};

const saveJobs = async (jobs: IJob[]) => {
  const operations = jobs.map((job) => ({
    updateOne: {
      filter: {
        source: job.source,
        url: job.url,
      },
      update: {
        $set: {
          ...job,
          lastSeenAt: new Date(),
        },
      },
      upsert: true,
    },
  }));

  if (operations.length === 0) {
    return {
      matched: 0,
      modified: 0,
      upserted: 0,
    };
  }

  const result = await Jobs.bulkWrite(operations);

  return {
    inserted: result.insertedCount,
    upserted: result.upsertedCount,
  };
};

const getAllJobs = async (query: Partial<Query>) => {
  const filter: Record<string, unknown> = {};

  if (query.search) {
    filter.$or = [
      { title: { $regex: query.search, $options: "i" } },
      { company: { $regex: query.search, $options: "i" } },
      { description: { $regex: query.search, $options: "i" } },
      { skills: { $regex: query.search, $options: "i" } },
    ];
  }

  if (query.remote !== undefined) {
    filter.remote = query.remote;
  }

  const page = Math.max(query.page || 1, 1);
  const limit = Math.min(query.limit || 20, 50);
  const skip = (page - 1) * limit;

  const [jobs, totalJobs] = await Promise.all([
    Jobs.find(filter).sort({ postedAt: -1 }).skip(skip).limit(limit),

    Jobs.countDocuments(filter),
  ]);

  return {
    jobs,
    count: jobs.length,
    totalJobs,
    page: +page,
    limit: +limit,
    totalPages: Math.ceil(totalJobs / limit),
  };
};

const updateJobs = async () => {
  await Jobs.updateMany(
    {
      lastSeenAt: {
        $lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    },
    {
      $set: {
        active: false,
      },
    },
  );
};

export { scrapAllJobs, getAllJobs, saveJobs, updateJobs };
