import { Request, Response, NextFunction } from "express";

export function requireScraperSecret(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const secret = req.headers["x-scraper-secret"];

  if (typeof secret !== "string" || secret !== process.env.SCRAPER_SECRET) {
    return res.status(401).json({
      status: "error",
      message: "Unauthorized",
    });
  }

  next();
}
