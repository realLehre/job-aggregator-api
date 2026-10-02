import fs from "fs";
import path from "path";
import * as cheerio from "cheerio";

const url = "https://books.toscrape.com/";

const scrap = async () => {
  const response = await fetch(url);

  if (!response) {
    console.log("Error fetching the URL");
  }

  try {
    const html = await response.text();

    const C = cheerio.load(html);

    let books: any[] = [];

    C("article.product_pod").each((i, el) => {
      const title = C(el).find("h3 a").attr("title");
      const price = C(el).find(".price_color").text().trim();

      books.push({ title, price });
    });

    return books;
  } catch (e) {}
};

export default scrap;
