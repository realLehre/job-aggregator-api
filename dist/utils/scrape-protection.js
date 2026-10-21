"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireScraperSecret = requireScraperSecret;
function requireScraperSecret(req, res, next) {
    const secret = req.headers["x-scraper-secret"];
    if (typeof secret !== "string" || secret !== process.env.SCRAPER_SECRET) {
        return res.status(401).json({
            status: "error",
            message: "Unauthorized",
        });
    }
    next();
}
