import { createHash } from "crypto";
import { IJob } from "./job.interface";

const COMPANY_SUFFIXES =
  /\b(inc|llc|ltd|limited|gmbh|corp|corporation|co|plc|sa|bv)\b/g;

const normalize = (s: string) =>
  s
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents
    .toLowerCase()
    .replace(/\(.*?\)|\[.*?\]/g, " ") // drop "(Remote)", "[Hiring]"
    .replace(/[^a-z0-9\s]/g, " ") // punctuation
    .replace(/\s+/g, " ")
    .trim();

export const makeFingerprint = (job: IJob): string => {
  const company = normalize(job.company!).replace(COMPANY_SUFFIXES, "").trim();
  const title = normalize(job.title)
    .replace(/\b(developer|engineer)\b/g, "engineer") // fold common synonyms
    .replace(/\bsr\b/g, "senior");
  return createHash("sha1").update(`${company}|${title}`).digest("hex");
};

export const canonicalUrl = (raw?: string): string | null => {
  if (!raw) return null;
  try {
    const u = new URL(raw);
    u.hash = "";
    [...u.searchParams.keys()]
      .filter((k) => /^(utm_|ref|source|gh_src)/i.test(k))
      .forEach((k) => u.searchParams.delete(k));
    return (u.origin + u.pathname).replace(/\/$/, "").toLowerCase() + u.search;
  } catch {
    return null;
  }
};
