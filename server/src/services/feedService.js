import Parser from "rss-parser";
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { insertArticle, upsertSource } from "../db/database.js";
import { createSummary } from "./summaryService.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const parser = new Parser();

function loadSources() {
  const filePath = path.join(__dirname, "..", "config", "sources.json");
  return JSON.parse(readFileSync(filePath, "utf-8"));
}

export function syncSourcesToDb() {
  const sources = loadSources();
  for (const source of sources) {
    upsertSource({
      name: source.name,
      url: source.url,
      logo: source.logo || null,
      categories: JSON.stringify(source.categories),
    });
  }
}

export async function fetchAllFeeds() {
  const sources = loadSources();
  let newArticles = 0;

  for (const source of sources) {
    try {
      console.log(`Fetching: ${source.name}...`);
      const feed = await parser.parseURL(source.url);

      for (const item of feed.items.slice(0, 20)) {
        const { summary, aiGenerated } = await createSummary(item);

        const category =
          source.categories[Math.floor(Math.random() * source.categories.length)];

        const result = insertArticle({
          title: item.title || "Ohne Titel",
          url: item.link,
          summary,
          source: source.name,
          category,
          imageUrl: item.enclosure?.url || null,
          published: item.isoDate || new Date().toISOString(),
          fetchedAt: new Date().toISOString(),
          aiSummary: aiGenerated ? 1 : 0,
        });

        if (result.changes > 0) newArticles++;
      }
    } catch (error) {
      console.error(`Error fetching ${source.name}:`, error.message);
    }
  }

  console.log(`Fetch complete. ${newArticles} new articles added.`);
  return newArticles;
}
