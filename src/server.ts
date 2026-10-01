import express from "express";

import { scrap } from "./scrappers/books-to-scrape";

const app = express();

scrap();

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

export default app;
