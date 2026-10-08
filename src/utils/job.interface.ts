export interface IJob {
  title: string;
  company?: string;
  description: string;
  location?: string;
  remote?: boolean;
  salary?: {
    min?: number;
    max?: number;
    currency?: string;
  };
  employmentType?: string[];
  skills: string[];
  source: string;
  sourceJobId?: string;
  url: string;
  postedAt?: Date;
  scrapedAt: Date;
  lastSeenAt?: Date;
  active?: boolean;
}

export interface Query {
  search: string;
  remote: boolean;
  page: number;
  limit: number;
  source: string;
  salary: string;
  startDate: Date;
  endDate: Date;
}

export interface JobMatchResult {
  overallScore: number;
  summary: string;
  strengths: string[];
  missingSkills: string[];
  skillMatch: {
    skill: string;
    matched: boolean;
  }[];
  recommendations: string[];
}
