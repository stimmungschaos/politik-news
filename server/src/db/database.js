import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, "..", "..", "politik-news.db");

const db = new Database(dbPath);

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS sources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    url TEXT NOT NULL UNIQUE,
    logo TEXT,
    categories TEXT NOT NULL DEFAULT '[]'
  );

  CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    url TEXT NOT NULL UNIQUE,
    summary TEXT,
    source TEXT NOT NULL,
    category TEXT NOT NULL,
    image_url TEXT,
    published TEXT NOT NULL,
    fetched_at TEXT NOT NULL,
    ai_summary INTEGER NOT NULL DEFAULT 0
  );

  CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published DESC);
  CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
  CREATE INDEX IF NOT EXISTS idx_articles_source ON articles(source);
`);

export function insertArticle(article) {
  const stmt = db.prepare(`
    INSERT OR IGNORE INTO articles (title, url, summary, source, category, image_url, published, fetched_at, ai_summary)
    VALUES (@title, @url, @summary, @source, @category, @imageUrl, @published, @fetchedAt, @aiSummary)
  `);
  return stmt.run(article);
}

export function getArticles({ page = 1, limit = 20, category = null }) {
  const offset = (page - 1) * limit;
  // Interleave: Jede Quelle bekommt einen Rang (1. neuester Artikel, 2. neuester etc.)
  // Dann sortieren wir nach Rang → Quellen wechseln sich ab
  const query = category
    ? `SELECT * FROM (
        SELECT *, ROW_NUMBER() OVER (PARTITION BY source ORDER BY published DESC) as src_rank
        FROM articles WHERE category = ?
      ) ORDER BY src_rank, published DESC LIMIT ? OFFSET ?`
    : `SELECT * FROM (
        SELECT *, ROW_NUMBER() OVER (PARTITION BY source ORDER BY published DESC) as src_rank
        FROM articles
      ) ORDER BY src_rank, published DESC LIMIT ? OFFSET ?`;

  const rows = category
    ? db.prepare(query).all(category, limit, offset)
    : db.prepare(query).all(limit, offset);

  const total = category
    ? db.prepare("SELECT COUNT(*) as count FROM articles WHERE category = ?").get(category).count
    : db.prepare("SELECT COUNT(*) as count FROM articles").get().count;

  return { articles: rows, total };
}

export function searchArticles({ q, source, category, page = 1, limit = 20 }) {
  const offset = (page - 1) * limit;
  let where = "WHERE 1=1";
  const params = [];

  if (q) {
    where += " AND (title LIKE ? OR summary LIKE ?)";
    params.push(`%${q}%`, `%${q}%`);
  }
  if (source) {
    where += " AND source = ?";
    params.push(source);
  }
  if (category) {
    where += " AND category = ?";
    params.push(category);
  }

  const rows = db.prepare(
    `SELECT * FROM articles ${where} ORDER BY published DESC LIMIT ? OFFSET ?`
  ).all(...params, limit, offset);
  const total = db.prepare(
    `SELECT COUNT(*) as count FROM articles ${where}`
  ).all(...params)[0].count;
  return { articles: rows, total };
}

export function getCategories() {
  return db.prepare(
    "SELECT category, COUNT(*) as count FROM articles GROUP BY category ORDER BY count DESC"
  ).all();
}

export function getSources() {
  return db.prepare("SELECT * FROM sources").all();
}

export function upsertSource(source) {
  db.prepare(`
    INSERT INTO sources (name, url, logo, categories)
    VALUES (@name, @url, @logo, @categories)
    ON CONFLICT(url) DO UPDATE SET name=@name, logo=@logo, categories=@categories
  `).run(source);
}

export function getTrendingTopics(hours = 24, limit = 15) {
  // Get articles from last N hours, extract common words from titles
  const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
  const articles = db.prepare(
    "SELECT title FROM articles WHERE published > ? ORDER BY published DESC"
  ).all(since);

  // Count word frequency (ignore short/common words)
  const stopWords = new Set([
    "der", "die", "das", "und", "in", "von", "zu", "für", "mit", "auf",
    "ist", "im", "den", "des", "ein", "eine", "einer", "einem", "einen",
    "nicht", "sich", "als", "auch", "es", "an", "nach", "wie", "aus",
    "bei", "über", "wird", "hat", "zum", "zur", "noch", "vor", "um",
    "dass", "aber", "oder", "so", "wenn", "kann", "mehr", "nur", "schon",
    "war", "sind", "werden", "einem", "seine", "seine", "ihre", "will",
    "neue", "neuer", "neues", "neuem", "neuen", "gibt", "gegen", "haben",
    "wir", "sie", "ich", "was", "man", "durch", "vom", "bis", "dem",
    "–", "-", "—", "|", "/", ":", "the", "and", "for"
  ]);

  const wordCounts = {};
  for (const { title } of articles) {
    const words = title.toLowerCase().replace(/[^\wäöüß\s-]/g, "").split(/\s+/);
    for (const word of words) {
      if (word.length > 2 && !stopWords.has(word)) {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
      }
    }
  }

  return Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word, count]) => ({ word, count }));
}

export function getBreakingNews(limit = 1) {
  return db.prepare(
    "SELECT * FROM articles ORDER BY published DESC LIMIT ?"
  ).all(limit);
}

export function getStats() {
  const totalArticles = db.prepare("SELECT COUNT(*) as count FROM articles").get().count;
  const totalSources = db.prepare("SELECT COUNT(*) as count FROM sources").get().count;

  const bySource = db.prepare(
    "SELECT source, COUNT(*) as count FROM articles GROUP BY source ORDER BY count DESC"
  ).all();

  const byCategory = db.prepare(
    "SELECT category, COUNT(*) as count FROM articles GROUP BY category ORDER BY count DESC"
  ).all();

  const today = new Date().toISOString().slice(0, 10);
  const todayCount = db.prepare(
    "SELECT COUNT(*) as count FROM articles WHERE published >= ?"
  ).get(today + "T00:00:00").count;

  const aiSummaryCount = db.prepare(
    "SELECT COUNT(*) as count FROM articles WHERE ai_summary = 1"
  ).get().count;

  const hourlyActivity = db.prepare(`
    SELECT substr(published, 12, 2) as hour, COUNT(*) as count
    FROM articles WHERE published >= ?
    GROUP BY hour ORDER BY hour
  `).all(today + "T00:00:00");

  return { totalArticles, totalSources, todayCount, aiSummaryCount, bySource, byCategory, hourlyActivity };
}

export function getDailyDigest(limit = 5) {
  const today = new Date().toISOString().slice(0, 10);
  // Get today's articles, one per source to get variety, ordered by newest
  return db.prepare(`
    SELECT * FROM (
      SELECT *, ROW_NUMBER() OVER (PARTITION BY source ORDER BY published DESC) as rn
      FROM articles WHERE published >= ?
    ) WHERE rn = 1 ORDER BY published DESC LIMIT ?
  `).all(today + "T00:00:00", limit);
}

export function findSimilarArticles(articleId) {
  const article = db.prepare("SELECT * FROM articles WHERE id = ?").get(articleId);
  if (!article) return [];

  // Extract significant words from the title
  const words = article.title.toLowerCase()
    .replace(/[^\wäöüß\s]/g, "")
    .split(/\s+/)
    .filter(w => w.length > 3);

  if (words.length === 0) return [];

  // Find articles that share title words (from different sources)
  const conditions = words.slice(0, 5).map(() => "LOWER(title) LIKE ?").join(" OR ");
  const params = words.slice(0, 5).map(w => `%${w}%`);

  return db.prepare(`
    SELECT * FROM articles
    WHERE id != ? AND source != ? AND (${conditions})
    ORDER BY published DESC LIMIT 5
  `).all(article.id, article.source, ...params);
}

export function getStoryClusters(hours = 24, minClusterSize = 2) {
  const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
  const articles = db.prepare(
    "SELECT * FROM articles WHERE published > ? ORDER BY published DESC"
  ).all(since);

  // Simple clustering: group articles that share 2+ significant words in title
  const clusters = [];
  const used = new Set();

  for (let i = 0; i < articles.length; i++) {
    if (used.has(articles[i].id)) continue;

    const wordsA = articles[i].title.toLowerCase()
      .replace(/[^\wäöüß\s]/g, "").split(/\s+/).filter(w => w.length > 3);

    const cluster = [articles[i]];

    for (let j = i + 1; j < articles.length; j++) {
      if (used.has(articles[j].id)) continue;
      if (articles[j].source === articles[i].source) continue;

      const wordsB = articles[j].title.toLowerCase()
        .replace(/[^\wäöüß\s]/g, "").split(/\s+/).filter(w => w.length > 3);

      const shared = wordsA.filter(w => wordsB.includes(w)).length;
      if (shared >= 2) {
        cluster.push(articles[j]);
        used.add(articles[j].id);
      }
    }

    if (cluster.length >= minClusterSize) {
      used.add(articles[i].id);
      clusters.push({
        topic: articles[i].title,
        articles: cluster,
        sourceCount: new Set(cluster.map(a => a.source)).size,
      });
    }
  }

  return clusters.sort((a, b) => b.articles.length - a.articles.length);
}

export default db;
