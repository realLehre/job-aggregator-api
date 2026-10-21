"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrappers = void 0;
const remote_ok_1 = require("./remote-ok");
const himalayas_1 = require("./himalayas");
const wwr_1 = require("./wwr");
const arbeitnow_1 = require("./arbeitnow");
const remotive_1 = require("./remotive");
exports.scrappers = [
    remote_ok_1.remoteOkScrapper,
    himalayas_1.himalayasScrapper,
    wwr_1.wwrScrapper,
    arbeitnow_1.arbeitnowScrapper,
    remotive_1.remotiveScrapper,
];
