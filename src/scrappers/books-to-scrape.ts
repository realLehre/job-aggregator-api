import fs from "fs";
import path from "path";
import * as cheerio from "cheerio";

const url = "https://books.toscrape.com/";

export const scrap = async () => {
  const response = await fetch(url);

  if (!response) {
    console.log("Error fetching the URL");
  }

  try {
    const html = await response.text();

    const C = cheerio.load(html);

    console.log(html);

    let books: any[] = [];

    C("article.prod_pod").each((i, el) => {
      const title = C(el).find("h3 a").attr("title");
      const price = C(el).find(".price_color").text().trim();

      console.log({ title, price });

      books.push({ title, price });
    });

    const filePath = path.join(__dirname, "books-to-scrape.json");

    const jsonString = JSON.stringify(books, null, 2);

    fs.writeFile(filePath, jsonString, (err) => {
      if (err) {
        console.error("Error writing file", err);
      } else {
        console.log("File written successfully");
      }
    });
  } catch (e) {}
};
