"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOldJobs = exports.getSingleJob = exports.updateJobs = exports.saveJobs = exports.getAllJobs = exports.scrapAllJobs = void 0;
const job_model_1 = __importDefault(require("../models/job-model"));
const dedub_1 = require("../utils/dedub");
const mongoose_1 = __importDefault(require("mongoose"));
const scrapAllJobs = (scrapers) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Promise.allSettled(scrapers.map((s) => s.scrape()));
    let jobs = 0;
    result.forEach((r, index) => {
        const scraper = scrapers[index];
        if (r.status === "fulfilled") {
            jobs += r.value;
        }
        else {
            console.error(`Error occurred while scraping ${scraper.name}:`, r.reason);
        }
    });
    // return deDuplicator(jobs);
    return jobs;
});
exports.scrapAllJobs = scrapAllJobs;
let totalJobs = 0;
const saveJobs = (jobs) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!jobs.length)
        return;
    totalJobs += jobs.length;
    const ops = jobs.map((job) => {
        var _a;
        const fingerprint = (0, dedub_1.makeFingerprint)(job);
        const cUrl = (0, dedub_1.canonicalUrl)(job.url);
        const useUrl = isSpecificUrl(cUrl);
        const filter = useUrl
            ? { $or: [{ fingerprint }, { "sources.canonicalUrl": cUrl }] }
            : { fingerprint };
        return {
            updateOne: {
                filter,
                update: {
                    // keep the full job, including source/url/scrapedAt, for the first writer
                    $setOnInsert: Object.assign(Object.assign({}, job), { fingerprint }),
                    $set: { lastSeenAt: job.scrapedAt },
                    $addToSet: {
                        sources: {
                            name: job.source,
                            sourceJobId: (_a = job.sourceJobId) !== null && _a !== void 0 ? _a : null,
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
        const result = yield job_model_1.default.bulkWrite(ops, { ordered: false });
        return {
            inserted: result.insertedCount,
            upserted: result.upsertedCount,
        };
    }
    catch (err) {
        if (err.code === 11000 ||
            ((_a = err.writeErrors) === null || _a === void 0 ? void 0 : _a.every((e) => e.code === 11000))) {
            yield job_model_1.default.bulkWrite(ops, { ordered: false });
        }
        else
            throw err;
    }
    console.log(totalJobs);
    // const result = await Jobs.bulkWrite(operations);
});
exports.saveJobs = saveJobs;
const getAllJobs = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const baseFilter = {};
    const searchConditions = [];
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
    const dateFilter = {};
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
    const findFilter = Object.assign({}, baseFilter);
    const findConditions = [];
    if (baseFilter.$and) {
        findConditions.push(...baseFilter.$and);
    }
    if (query.cursor) {
        try {
            const decoded = Buffer.from(query.cursor, "base64").toString("utf-8");
            const cursorObj = JSON.parse(decoded);
            if (cursorObj && cursorObj._id) {
                const cursorDate = cursorObj.postedAt ? new Date(cursorObj.postedAt) : null;
                const cursorId = new mongoose_1.default.Types.ObjectId(cursorObj._id);
                if (cursorDate && !isNaN(cursorDate.getTime())) {
                    findConditions.push({
                        $or: [
                            { postedAt: { $lt: cursorDate } },
                            { postedAt: cursorDate, _id: { $lt: cursorId } },
                        ],
                    });
                }
                else {
                    findConditions.push({ _id: { $lt: cursorId } });
                }
            }
        }
        catch (err) {
            console.error("Invalid cursor provided:", err);
        }
    }
    if (findConditions.length > 0) {
        findFilter.$and = findConditions;
    }
    else {
        delete findFilter.$and;
    }
    const limit = Math.min(query.limit ? Number(query.limit) : 20, 50);
    const fetchLimit = limit + 1;
    const [jobs, totalJobs] = yield Promise.all([
        job_model_1.default.find(findFilter)
            .select("title company skills location remote postedAt source salary employmentType")
            .sort({ postedAt: -1, _id: -1 })
            .limit(fetchLimit)
            .allowDiskUse(true),
        job_model_1.default.countDocuments(baseFilter),
    ]);
    let nextCursor = null;
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
});
exports.getAllJobs = getAllJobs;
const getSingleJob = (jobId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield job_model_1.default.findById(jobId);
});
exports.getSingleJob = getSingleJob;
const updateJobs = () => __awaiter(void 0, void 0, void 0, function* () {
    yield job_model_1.default.updateMany({
        lastSeenAt: {
            $lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
    }, {
        $set: {
            active: false,
        },
    });
});
exports.updateJobs = updateJobs;
const deleteOldJobs = () => __awaiter(void 0, void 0, void 0, function* () {
    const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
    const result = yield job_model_1.default.deleteMany({
        $or: [
            { createdAt: { $lt: twoWeeksAgo } },
            { postedAt: { $lt: twoWeeksAgo } },
            { lastSeenAt: { $lt: twoWeeksAgo } },
        ],
    });
    return result.deletedCount || 0;
});
exports.deleteOldJobs = deleteOldJobs;
const isSpecificUrl = (u) => {
    if (!u)
        return false;
    try {
        const { pathname, search } = new URL(u);
        return pathname.length > 1 || search.length > 0;
    }
    catch (_a) {
        return false;
    }
};
