const ANGULAR_KEYWORDS = ["angular", "angularjs"];

export const isAngularJob = (job: any): boolean => {
  const searchTerms = [job.title, job.company, job.description, job.skills]
    .join(" ")
    .toLowerCase();

  return ANGULAR_KEYWORDS.some((keyword) => {
    return searchTerms.includes(keyword);
  });
};
