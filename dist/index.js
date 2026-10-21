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
const server_1 = __importDefault(require("./server"));
const db_connect_1 = require("./db/db-connect");
const cron_1 = require("./utils/cron");
const port = process.env.PORT || "8080";
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, db_connect_1.dbConnect)(process.env.MONGODB_URI);
        yield (0, cron_1.startJobScraper)();
        yield (0, cron_1.updateJobsInDb)();
        (0, cron_1.deleteOldJobsCron)();
        server_1.default.listen(port, () => {
            console.log(`Server is running on port ${port} ok`);
        });
    }
    catch (error) {
        console.error("Error connecting to the database:", error);
    }
});
startServer();
