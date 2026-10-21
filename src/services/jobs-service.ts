import { JobScrapper } from "../utils/types";
import { IJob, Query } from "../utils/job.interface";
import Jobs from "../models/job-model";
import { canonicalUrl, makeFingerprint } from "../utils/dedub";
import mongoose, { AnyBulkWriteOperation } from "mongoose";

const scrapAllJobs = async (scrapers: JobScrapper[]): Promise<any> => {
  const result = await Promise.allSettled(scrapers.map((s) => s.scrape()));

  let jobs: number = 0;

  result.forEach((r, index) => {
    const scraper = scrapers[index];

    if (r.status === "fulfilled") {
      jobs += r.value;
    } else {
      console.error(`Error occurred while scraping ${scraper.name}:`, r.reason);
    }
  });

  // return deDuplicator(jobs);
  return jobs;
};

let totalJobs = 0;

const saveJobs = async (jobs: IJob[]) => {
  if (!jobs.length) return;

  totalJobs += jobs.length;

  const ops: AnyBulkWriteOperation<any>[] = jobs.map((job) => {
    const fingerprint = makeFingerprint(job);
    const cUrl = canonicalUrl(job.url);
    const useUrl = isSpecificUrl(cUrl);

    const filter = useUrl
      ? { $or: [{ fingerprint }, { "sources.canonicalUrl": cUrl }] }
      : { fingerprint };

    return {
      updateOne: {
        filter,
        update: {
          // keep the full job, including source/url/scrapedAt, for the first writer
          $setOnInsert: { ...job, fingerprint },
          $set: { lastSeenAt: job.scrapedAt },
          $addToSet: {
            sources: {
              name: job.source,
              sourceJobId: job.sourceJobId ?? null,
              url: job.url,
              canonicalUrl: cUrl,
            },
          },
        },
        upsert: true,
      },
    };
  });

  try {
    const result = await Jobs.bulkWrite(ops, { ordered: false });
    return {
      inserted: result.insertedCount,
      upserted: result.upsertedCount,
    };
  } catch (err: any) {
    if (
      err.code === 11000 ||
      err.writeErrors?.every((e: any) => e.code === 11000)
    ) {
      await Jobs.bulkWrite(ops, { ordered: false });
    } else throw err;
  }

  console.log(totalJobs);

  // const result = await Jobs.bulkWrite(operations);
};

const getAllJobs = async (query: Partial<Query>) => {
  const baseFilter: Record<string, unknown> = {};
  const searchConditions: any[] = [];

  if (query.search) {
    searchConditions.push({
      $or: [
        { title: { $regex: query.search, $options: "i" } },
        { company: { $regex: query.search, $options: "i" } },
        { description: { $regex: query.search, $options: "i" } },
        { skills: { $regex: query.search, $options: "i" } },
      ],
    });
  }

  if (query.remote !== undefined) {
    baseFilter.remote = query.remote;
  }

  if (query.source) {
    baseFilter.source = { $regex: query.source, $options: "i" };
  }

  if (query.salary) {
    baseFilter.salary = { $regex: query.salary, $options: "i" };
  }

  const dateFilter: Record<any, any> = {};

  if (query.startDate) {
    dateFilter.$gte = new Date(query.startDate);
  }

  if (query.endDate) {
    const end = new Date(query.endDate);
    end.setHours(23, 59, 59, 999);
    dateFilter.$lte = end; // Jobs posted on or before endDate
  }

  if (Object.keys(dateFilter).length > 0) {
    baseFilter.postedAt = dateFilter;
  }

  if (searchConditions.length > 0) {
    baseFilter.$and = searchConditions;
  }

  const findFilter: Record<string, unknown> = { ...baseFilter };
  const findConditions: any[] = [];

  if (baseFilter.$and) {
    findConditions.push(...(baseFilter.$and as any[]));
  }

  if (query.cursor) {
    try {
      const decoded = Buffer.from(query.cursor, "base64").toString("utf-8");
      const cursorObj = JSON.parse(decoded);
      if (cursorObj && cursorObj._id) {
        const cursorDate = cursorObj.postedAt
          ? new Date(cursorObj.postedAt)
          : null;
        const cursorId = new mongoose.Types.ObjectId(cursorObj._id);

        if (cursorDate && !isNaN(cursorDate.getTime())) {
          findConditions.push({
            $or: [
              { postedAt: { $lt: cursorDate } },
              { postedAt: cursorDate, _id: { $lt: cursorId } },
            ],
          });
        } else {
          findConditions.push({ _id: { $lt: cursorId } });
        }
      }
    } catch (err) {
      console.error("Invalid cursor provided:", err);
    }
  }

  if (findConditions.length > 0) {
    findFilter.$and = findConditions;
  } else {
    delete findFilter.$and;
  }

  const limit = Math.min(query.limit ? Number(query.limit) : 20, 50);
  const fetchLimit = limit + 1;

  const [jobs, totalJobs] = await Promise.all([
    Jobs.find(findFilter)
      .select(
        "title company skills location remote postedAt source salary employmentType",
      )
      .sort({ postedAt: -1, _id: -1 })
      .limit(fetchLimit)
      .allowDiskUse(true),

    Jobs.countDocuments(baseFilter),
  ]);

  let nextCursor: string | null = null;
  if (jobs.length > limit) {
    const nextItem = jobs.pop();
    if (nextItem) {
      const rawCursor = JSON.stringify({
        postedAt: nextItem.postedAt ? nextItem.postedAt.toISOString() : null,
        _id: nextItem._id.toString(),
      });
      nextCursor = Buffer.from(rawCursor).toString("base64");
    }
  }

  return {
    jobs,
    count: jobs.length,
    totalJobs,
    nextCursor,
    limit,
  };
};

const getSingleJob = async (jobId: string) => {
  return await Jobs.findById(jobId);
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

const deleteOldJobs = async () => {
  const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
  const result = await Jobs.deleteMany({
    $or: [
      { createdAt: { $lt: twoWeeksAgo } },
      { postedAt: { $lt: twoWeeksAgo } },
      { lastSeenAt: { $lt: twoWeeksAgo } },
    ],
  });
  return result.deletedCount || 0;
};

const isSpecificUrl = (u: string | null): u is string => {
  if (!u) return false;
  try {
    const { pathname, search } = new URL(u);
    return pathname.length > 1 || search.length > 0;
  } catch {
    return false;
  }
};

export {
  scrapAllJobs,
  getAllJobs,
  saveJobs,
  updateJobs,
  getSingleJob,
  deleteOldJobs,
};
