import { Request, Response } from "express";

export const notFoundRoute = async (req: Request, res: Response) => {
  res.status(404).send(`Route ${req.originalUrl} not found`);
};
