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
  const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
  const articles = db.prepare(
    "SELECT title FROM articles WHERE published > ? ORDER BY published DESC"
  ).all(since);

  // Umfangreiche Stopwort-Liste: Artikel, Pronomen, Präpositionen, Konjunktionen,
  // Hilfsverben, häufige Adverbien, Fragewörter, Zahlen, Nachrichtenfloskeln
  const stopWords = new Set([
    // Artikel & Pronomen
    "der", "die", "das", "den", "dem", "des", "ein", "eine", "einer", "einem", "einen",
    "er", "sie", "es", "wir", "ihr", "uns", "ihm", "ihn", "mir", "ich", "mich", "dir",
    "sich", "man", "seine", "seiner", "seinem", "seinen", "ihre", "ihrer", "ihrem", "ihren",
    "diese", "dieser", "diesem", "diesen", "dieses", "jede", "jeder", "jedem", "jeden",
    "alle", "allem", "allen", "aller", "alles", "andere", "anderer", "anderen", "anderem",
    "welche", "welcher", "welchem", "welchen", "welches", "solche", "solcher", "solchem",
    // Präpositionen
    "in", "von", "zu", "für", "mit", "auf", "an", "nach", "aus", "bei", "über", "unter",
    "vor", "um", "durch", "vom", "zum", "zur", "bis", "ohne", "zwischen", "neben",
    "gegen", "seit", "während", "wegen", "trotz", "statt", "außer", "innerhalb",
    // Konjunktionen
    "und", "oder", "aber", "denn", "dass", "weil", "wenn", "als", "ob", "damit",
    "sondern", "doch", "jedoch", "weder", "noch", "sowohl", "bevor", "nachdem",
    // Hilfs- & Modalverben
    "ist", "sind", "war", "wird", "hat", "haben", "hatte", "werden", "worden", "wurde",
    "kann", "können", "könnte", "will", "wollen", "wollte", "soll", "sollen", "sollte",
    "muss", "müssen", "musste", "darf", "dürfen", "mag", "möchte", "sein", "sei", "wäre",
    "würde", "würden", "lässt", "lassen", "bleibt", "geht", "gibt", "geben", "kommt",
    "kommen", "macht", "machen", "sagt", "sagen", "steht", "stehen", "heißt",
    // Adverbien & häufige Wörter
    "nicht", "auch", "noch", "schon", "nur", "mehr", "sehr", "so", "wie", "dann",
    "dort", "hier", "jetzt", "immer", "wieder", "bereits", "etwa", "rund", "fast",
    "ganz", "wohl", "kaum", "eben", "erst", "lange", "weiter", "zudem", "daher",
    "dabei", "dazu", "darum", "davor", "danach", "davon", "darauf", "darüber",
    "deshalb", "dennoch", "allerdings", "offenbar", "laut", "sowie", "insgesamt",
    // Fragewörter
    "was", "wer", "wen", "wem", "warum", "wieso", "weshalb", "wann", "wohin", "woher",
    // Zahlen & Maße
    "prozent", "milliarden", "millionen", "tausend", "euro", "jahr", "jahre", "jahren",
    "monat", "monate", "monaten", "woche", "wochen", "tag", "tage", "tagen",
    // Nachrichtenfloskeln
    "neue", "neuer", "neues", "neuem", "neuen", "viele", "vielen", "ersten", "erste",
    "erster", "laut", "zwei", "drei", "vier", "fünf", "sechs", "nach", "beim",
    "teil", "seite", "ende", "anfang", "grund", "fall", "frage", "thema",
    // Sonderzeichen
    "–", "-", "—", "|", "/", ":", "the", "and", "for", "with",
  ]);

  /**
   * Einfache Normalisierung: entfernt deutsche Endungen wie -s, -es, -en, -er, -em
   * damit "Israels" → "israel", "deutschen" → "deutsch" etc.
   */
  function normalize(word) {
    let w = word.toLowerCase().trim();
    // Genitiv-s: "israels" → "israel", "deutschlands" → "deutschland"
    if (w.length > 4 && w.endsWith("s") && !w.endsWith("ss") && !w.endsWith("us")) {
      w = w.slice(0, -1);
    }
    return w;
  }

  const wordCounts = {};
  for (const { title } of articles) {
    const words = title.replace(/[^\wäöüßÄÖÜ\s-]/g, "").split(/\s+/);
    const seen = new Set(); // ein Wort pro Titel nur einmal zählen
    for (const raw of words) {
      const word = normalize(raw);
      if (word.length < 4) continue; // mindestens 4 Buchstaben
      if (stopWords.has(word)) continue;
      if (/^\d+$/.test(word)) continue; // reine Zahlen ignorieren
      if (seen.has(word)) continue;
      seen.add(word);
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    }
  }

  // Nur Wörter die in mindestens 2 Artikeln vorkommen
  return Object.entries(wordCounts)
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word, count]) => ({ word: word.charAt(0).toUpperCase() + word.slice(1), count }));
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

// Stopwörter die beim Clustering ignoriert werden
const CLUSTER_STOP = new Set([
  // Grammatik
  "der", "die", "das", "den", "dem", "des", "ein", "eine", "einer", "einem", "einen",
  "und", "oder", "aber", "denn", "dass", "weil", "wenn", "als", "nach", "sich",
  "nicht", "auch", "noch", "schon", "nur", "mehr", "sehr", "wird", "hat", "haben",
  "ist", "sind", "war", "kann", "will", "soll", "muss", "gibt", "macht", "geht",
  "über", "unter", "vor", "für", "mit", "auf", "aus", "bei", "von", "zum", "zur",
  "wie", "was", "wer", "alle", "alle", "viele", "neue", "neuer", "neues", "neuen",
  "erste", "ersten", "erster", "zwei", "drei", "vier", "fünf", "teil", "seit",
  "wieder", "bereits", "damit", "dabei", "dazu", "darum", "durch", "immer", "gegen",
  "könnte", "könnten", "müssen", "sollte", "worden", "wurden", "würde", "worden",
  "laut", "rund", "etwa", "fast", "wohl", "kaum", "ganz", "weiter", "jetzt",
  "prozent", "euro", "millionen", "milliarden", "jahr", "jahre", "jahren",
  "deutsche", "deutschen", "deutscher", "deutschland", "berlin",
  // Nachrichtenfloskeln die zu viel matchen
  "krieg", "kriege", "kriegs", "news", "heute", "tages",
  "nahen", "osten", "mittleren", "landes", "regierung", "bundesregierung",
  "warum", "kommentar", "analyse", "bericht", "interview", "liveblog",
  "folgen", "krise", "konflikt", "politik", "land",
  "frau", "mann", "kind", "kinder", "menschen", "leben", "welt",
  "sagt", "sagen", "sagte", "sieht", "zeigt", "macht", "kommt",
  "lässt", "steht", "heißt", "bleibt", "stellt", "nimmt",
  "doch", "recht", "noch", "fall", "frage", "grund",
  "kritik", "kritisiert", "fordert", "warnt", "droht",
]);

/**
 * Extrahiert signifikante Wörter aus einem Titel.
 * Filtert Stopwörter, normalisiert Genitiv-s, min 4 Buchstaben.
 */
function extractKeywords(title) {
  return title
    .toLowerCase()
    .replace(/[^\wäöüßÄÖÜ\s]/g, "")
    .split(/\s+/)
    .map(w => w.length > 4 && w.endsWith("s") && !w.endsWith("ss") && !w.endsWith("us") ? w.slice(0, -1) : w)
    .filter(w => w.length >= 4 && !CLUSTER_STOP.has(w) && !/^\d+$/.test(w));
}

/**
 * Berechnet Ähnlichkeit zwischen zwei Keyword-Sets.
 * Gibt einen Score von 0-1 zurück (Jaccard-ähnlich, gewichtet nach Wortlänge).
 */
function similarity(wordsA, wordsB) {
  if (wordsA.length === 0 || wordsB.length === 0) return 0;

  const setB = new Set(wordsB);
  let sharedWeight = 0;
  let sharedCount = 0;

  for (const w of wordsA) {
    if (setB.has(w)) {
      // Längere Wörter sind spezifischer und zählen mehr
      sharedWeight += w.length;
      sharedCount++;
    }
  }

  if (sharedCount < 2) return 0; // mindestens 2 gemeinsame spezifische Wörter

  const totalWords = new Set([...wordsA, ...wordsB]).size;
  // Jaccard: Anteil gemeinsamer Wörter am Gesamtvokabular
  const jaccardScore = sharedCount / totalWords;
  // Bonus für längere (= spezifischere) gemeinsame Wörter
  const avgSharedLen = sharedWeight / sharedCount;
  const lengthBonus = Math.min(avgSharedLen / 6, 2); // Wörter > 6 Zeichen geben vollen Bonus

  return jaccardScore * lengthBonus;
}

const SIMILARITY_THRESHOLD = 0.2; // Schwellenwert für "gleiche Story" (strenger)

export function findSimilarArticles(articleId) {
  const article = db.prepare("SELECT * FROM articles WHERE id = ?").get(articleId);
  if (!article) return [];

  const keywords = extractKeywords(article.title);
  if (keywords.length === 0) return [];

  // Hole Artikel der letzten 48 Stunden von anderen Quellen
  const since = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
  const candidates = db.prepare(
    "SELECT * FROM articles WHERE id != ? AND source != ? AND published > ? ORDER BY published DESC"
  ).all(article.id, article.source, since);

  return candidates
    .map(c => ({ ...c, score: similarity(keywords, extractKeywords(c.title)) }))
    .filter(c => c.score >= SIMILARITY_THRESHOLD)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

export function getStoryClusters(hours = 48, minClusterSize = 2) {
  const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
  const articles = db.prepare(
    "SELECT * FROM articles WHERE published > ? ORDER BY published DESC"
  ).all(since);

  // Keyword-Cache pro Artikel
  const keywordMap = new Map();
  for (const a of articles) {
    keywordMap.set(a.id, extractKeywords(a.title));
  }

  const clusters = [];
  const used = new Set();

  for (let i = 0; i < articles.length; i++) {
    if (used.has(articles[i].id)) continue;
    const wordsA = keywordMap.get(articles[i].id);
    if (wordsA.length < 2) continue;

    const cluster = [articles[i]];

    for (let j = i + 1; j < articles.length; j++) {
      if (used.has(articles[j].id)) continue;
      if (articles[j].source === articles[i].source) continue;

      const wordsB = keywordMap.get(articles[j].id);
      const score = similarity(wordsA, wordsB);

      if (score >= SIMILARITY_THRESHOLD) {
        cluster.push(articles[j]);
        used.add(articles[j].id);
      }
    }

    if (cluster.length >= minClusterSize) {
      used.add(articles[i].id);

      // Finde den besten Titel (der mit den meisten Keywords)
      const bestTitle = cluster
        .map(a => ({ title: a.title, len: keywordMap.get(a.id).length }))
        .sort((a, b) => b.len - a.len)[0].title;

      clusters.push({
        topic: bestTitle,
        articles: cluster,
        sourceCount: new Set(cluster.map(a => a.source)).size,
      });
    }
  }

  return clusters.sort((a, b) => b.sourceCount - a.sourceCount || b.articles.length - a.articles.length);
}

export default db;
