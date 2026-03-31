import Parser from "rss-parser";
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { insertArticle, upsertSource } from "../db/database.js";
import { createSummary } from "./summaryService.js";
import { categorizeArticle } from "./categoryService.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const parser = new Parser({
  customFields: {
    item: [
      ["media:content", "mediaContent", { keepArray: true }],
      ["media:thumbnail", "mediaThumbnail"],
      ["media:group", "mediaGroup"],
      ["content:encoded", "contentEncoded"],
    ],
  },
});

/**
 * Versucht ein Bild aus verschiedenen RSS-Feldern zu extrahieren.
 * Prüft: enclosure, media:content, media:thumbnail, und <img> im HTML-Content.
 */
function extractImageUrl(item) {
  // 1. Enclosure (Standard-RSS)
  if (item.enclosure?.url) return item.enclosure.url;

  // 2. media:content (häufig bei Spiegel, Tagesschau etc.)
  if (item.mediaContent) {
    const media = Array.isArray(item.mediaContent) ? item.mediaContent : [item.mediaContent];
    for (const m of media) {
      const url = m.$?.url || m.url;
      if (url) return url;
    }
  }

  // 3. media:thumbnail
  if (item.mediaThumbnail) {
    const url = item.mediaThumbnail.$?.url || item.mediaThumbnail.url;
    if (url) return url;
  }

  // 4. media:group > media:content
  if (item.mediaGroup?.["media:content"]) {
    const content = item.mediaGroup["media:content"];
    const media = Array.isArray(content) ? content : [content];
    for (const m of media) {
      const url = m.$?.url || m.url;
      if (url) return url;
    }
  }

  // 5. <img> Tag im HTML-Content extrahieren (inkl. content:encoded für Tagesschau etc.)
  const htmlSources = [
    item.contentEncoded,
    item["content:encoded"],
    item.content,
    item.description,
  ];
  for (const html of htmlSources) {
    if (!html) continue;
    const imgMatch = html.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (imgMatch?.[1]) return imgMatch[1];
  }

  return null;
}

/**
 * Fallback: Holt das og:image von der Artikelseite selbst.
 * Nur für Quellen die kein Bild im RSS-Feed haben (z.B. Perspektive Online).
 */
async function fetchOgImage(url) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "Mozilla/5.0 (compatible; PolitikNews/1.0)" },
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const html = await res.text();
    // Suche die meta-Zeile mit og:image und extrahiere die URL
    const ogLine = html.match(/<meta[^>]*og:image[^>]*>/i)?.[0];
    if (!ogLine) return null;
    const contentMatch = ogLine.match(/content=["']([^"']+)["']/i);
    return contentMatch?.[1] || null;
  } catch {
    return null;
  }
}

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

        const category = categorizeArticle(item, source.categories);

        let imageUrl = extractImageUrl(item);
        // Fallback: OG-Image von der Artikelseite holen
        if (!imageUrl && item.link) {
          imageUrl = await fetchOgImage(item.link);
        }

        const result = insertArticle({
          title: item.title || "Ohne Titel",
          url: item.link,
          summary,
          source: source.name,
          category,
          imageUrl,
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
