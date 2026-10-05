import { JobScrapper } from "../utils/types";
import { remoteOkScrapper } from "./remote-ok";
import { himalayasScrapper } from "./himalayas";
import { wwrScrapper } from "./wwr";
import { arbeitnowScrapper } from "./arbeitnow";
import { remotiveScrapper } from "./remotive";

export const scrappers: JobScrapper[] = [
  remoteOkScrapper,
  himalayasScrapper,
  wwrScrapper,
  arbeitnowScrapper,
  remotiveScrapper,
];
