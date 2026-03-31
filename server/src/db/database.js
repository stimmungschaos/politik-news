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
  if (category) {
    const rows = db.prepare(
      "SELECT * FROM articles WHERE category = ? ORDER BY published DESC LIMIT ? OFFSET ?"
    ).all(category, limit, offset);
    const total = db.prepare(
      "SELECT COUNT(*) as count FROM articles WHERE category = ?"
    ).get(category).count;
    return { articles: rows, total };
  }
  const rows = db.prepare(
    "SELECT * FROM articles ORDER BY published DESC LIMIT ? OFFSET ?"
  ).all(limit, offset);
  const total = db.prepare("SELECT COUNT(*) as count FROM articles").get().count;
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

export default db;
