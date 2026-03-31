# Politik News Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a news aggregator that fetches German political news via RSS, creates summaries, and displays them in a modern dark-themed UI with category filtering and search.

**Architecture:** Monorepo with Express.js backend (RSS fetching, SQLite caching, summary generation) and React/Vite frontend (Tailwind CSS dark theme). Backend runs a cron job every 15 minutes to fetch feeds, checks if feed descriptions are usable, falls back to AI summarization if not, and serves articles via REST API.

**Tech Stack:** Node.js, Express, better-sqlite3, rss-parser, node-cron, Anthropic SDK, React, Vite, Tailwind CSS, React Router, Lucide React (icons)

---

## File Structure

### Server

| File | Responsibility |
|------|---------------|
| `server/package.json` | Backend dependencies and scripts |
| `server/src/index.js` | Express server setup, CORS, cron scheduling, route mounting |
| `server/src/db/database.js` | SQLite connection, table creation, query functions |
| `server/src/config/sources.json` | RSS feed source definitions (name, url, categories, logo) |
| `server/src/services/feedService.js` | RSS fetching, parsing, deduplication, storing new articles |
| `server/src/services/summaryService.js` | Summary logic: check feed description quality, AI fallback |
| `server/src/routes/articles.js` | GET /api/articles, /api/articles/search endpoints |
| `server/src/routes/categories.js` | GET /api/categories endpoint |
| `server/src/routes/sources.js` | GET /api/sources endpoint |

### Client

| File | Responsibility |
|------|---------------|
| `client/package.json` | Frontend dependencies and scripts |
| `client/index.html` | Vite entry HTML |
| `client/vite.config.js` | Vite config with API proxy |
| `client/tailwind.config.js` | Tailwind dark theme config |
| `client/src/main.jsx` | React entry point |
| `client/src/App.jsx` | Router setup, layout shell |
| `client/src/components/Header.jsx` | Site header with logo, search bar, category nav |
| `client/src/components/ArticleCard.jsx` | News card: title, summary, source badge, category, date, link |
| `client/src/components/HeroArticle.jsx` | Large featured article with image background |
| `client/src/components/FilterPanel.jsx` | Search filters (source, category, time range) |
| `client/src/pages/HomePage.jsx` | Hero articles + article grid + load more |
| `client/src/pages/CategoryPage.jsx` | Filtered articles by category |
| `client/src/pages/SearchPage.jsx` | Search results with filters |
| `client/src/lib/api.js` | API client helper (fetch wrapper) |
| `client/src/lib/categories.js` | Category definitions with icons and colors |

### Root

| File | Responsibility |
|------|---------------|
| `package.json` | Root workspace scripts (dev, build, start) |
| `.gitignore` | Node modules, SQLite DB, .env |
| `.env.example` | Example env vars (ANTHROPIC_API_KEY) |

---

## Task 1: Project Scaffolding & Root Config

**Files:**
- Create: `package.json`
- Create: `.gitignore`
- Create: `.env.example`

- [ ] **Step 1: Create root package.json**

```json
{
  "name": "politik-news",
  "private": true,
  "scripts": {
    "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\"",
    "dev:server": "cd server && npm run dev",
    "dev:client": "cd client && npm run dev",
    "build": "cd client && npm run build",
    "start": "cd server && npm start"
  },
  "devDependencies": {
    "concurrently": "^9.1.2"
  }
}
```

- [ ] **Step 2: Create .gitignore**

```
node_modules/
dist/
*.db
.env
```

- [ ] **Step 3: Create .env.example**

```
ANTHROPIC_API_KEY=your-api-key-here
```

- [ ] **Step 4: Install root dependencies**

Run: `npm install`
Expected: `node_modules/` created, `package-lock.json` generated

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json .gitignore .env.example
git commit -m "chore: scaffold root project with scripts and gitignore"
```

---

## Task 2: Backend Setup & Database

**Files:**
- Create: `server/package.json`
- Create: `server/src/index.js`
- Create: `server/src/db/database.js`

- [ ] **Step 1: Create server/package.json**

```json
{
  "name": "politik-news-server",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "node --watch src/index.js",
    "start": "node src/index.js"
  },
  "dependencies": {
    "better-sqlite3": "^11.8.1",
    "cors": "^2.8.5",
    "dotenv": "^16.4.7",
    "express": "^5.1.0",
    "node-cron": "^3.0.3",
    "rss-parser": "^3.13.0",
    "@anthropic-ai/sdk": "^0.39.0"
  }
}
```

- [ ] **Step 2: Create server/src/db/database.js**

```js
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
```

- [ ] **Step 3: Create server/src/index.js (minimal, no routes yet)**

```js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

- [ ] **Step 4: Install server dependencies**

Run: `cd server && npm install`
Expected: `node_modules/` created

- [ ] **Step 5: Test server starts**

Run: `cd server && node src/index.js`
Expected: "Server running on http://localhost:3001"
Kill the server after verifying.

- [ ] **Step 6: Commit**

```bash
git add server/
git commit -m "feat: add backend setup with Express, SQLite database and schema"
```

---

## Task 3: Feed Configuration & RSS Fetch Service

**Files:**
- Create: `server/src/config/sources.json`
- Create: `server/src/services/feedService.js`
- Create: `server/src/services/summaryService.js`

- [ ] **Step 1: Create server/src/config/sources.json**

```json
[
  {
    "name": "Tagesschau",
    "url": "https://www.tagesschau.de/xml/rss2/",
    "categories": ["Innenpolitik", "Außenpolitik"],
    "logo": "tagesschau"
  },
  {
    "name": "Spiegel",
    "url": "https://www.spiegel.de/schlagzeilen/index.rss",
    "categories": ["Innenpolitik", "Gesellschaft"],
    "logo": "spiegel"
  },
  {
    "name": "Zeit Online",
    "url": "https://newsfeed.zeit.de/index",
    "categories": ["Innenpolitik", "Gesellschaft"],
    "logo": "zeit"
  }
]
```

- [ ] **Step 2: Create server/src/services/summaryService.js**

```js
import Anthropic from "@anthropic-ai/sdk";

const SUMMARY_MIN_LENGTH = 100;
const HTML_TAG_REGEX = /<[^>]+>/g;

function stripHtml(html) {
  return html.replace(HTML_TAG_REGEX, "").trim();
}

function isUsableSummary(description) {
  if (!description) return false;
  const stripped = stripHtml(description);
  return stripped.length >= SUMMARY_MIN_LENGTH;
}

async function generateAiSummary(title, content) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { summary: title, aiGenerated: false };
  }

  try {
    const client = new Anthropic();
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 200,
      messages: [
        {
          role: "user",
          content: `Fasse diesen Nachrichtenartikel in 2-3 Sätzen auf Deutsch zusammen. Nur die Zusammenfassung, keine Einleitung.\n\nTitel: ${title}\n\nInhalt: ${content}`,
        },
      ],
    });
    return { summary: message.content[0].text, aiGenerated: true };
  } catch (error) {
    console.error("AI summary failed:", error.message);
    return { summary: stripHtml(content).slice(0, 300), aiGenerated: false };
  }
}

export async function createSummary(item) {
  if (isUsableSummary(item.contentSnippet || item.content)) {
    return {
      summary: stripHtml(item.contentSnippet || item.content).slice(0, 500),
      aiGenerated: false,
    };
  }

  if (isUsableSummary(item.description)) {
    return {
      summary: stripHtml(item.description).slice(0, 500),
      aiGenerated: false,
    };
  }

  const content = item.contentSnippet || item.content || item.description || item.title;
  return generateAiSummary(item.title, stripHtml(content || ""));
}
```

- [ ] **Step 3: Create server/src/services/feedService.js**

```js
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
```

- [ ] **Step 4: Commit**

```bash
git add server/src/config/ server/src/services/
git commit -m "feat: add RSS feed service with summary generation and source config"
```

---

## Task 4: API Routes

**Files:**
- Create: `server/src/routes/articles.js`
- Create: `server/src/routes/categories.js`
- Create: `server/src/routes/sources.js`
- Modify: `server/src/index.js`

- [ ] **Step 1: Create server/src/routes/articles.js**

```js
import { Router } from "express";
import { getArticles, searchArticles } from "../db/database.js";

const router = Router();

router.get("/", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const category = req.query.category || null;

  const result = getArticles({ page, limit, category });
  res.json({
    articles: result.articles,
    total: result.total,
    page,
    limit,
    totalPages: Math.ceil(result.total / limit),
  });
});

router.get("/search", (req, res) => {
  const { q, source, category } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;

  const result = searchArticles({ q, source, category, page, limit });
  res.json({
    articles: result.articles,
    total: result.total,
    page,
    limit,
    totalPages: Math.ceil(result.total / limit),
  });
});

export default router;
```

- [ ] **Step 2: Create server/src/routes/categories.js**

```js
import { Router } from "express";
import { getCategories } from "../db/database.js";

const router = Router();

router.get("/", (req, res) => {
  const categories = getCategories();
  res.json(categories);
});

export default router;
```

- [ ] **Step 3: Create server/src/routes/sources.js**

```js
import { Router } from "express";
import { getSources } from "../db/database.js";

const router = Router();

router.get("/", (req, res) => {
  const sources = getSources();
  res.json(
    sources.map((s) => ({
      ...s,
      categories: JSON.parse(s.categories),
    }))
  );
});

export default router;
```

- [ ] **Step 4: Update server/src/index.js with routes and cron**

Replace the entire file with:

```js
import express from "express";
import cors from "cors";
import cron from "node-cron";
import dotenv from "dotenv";
import articlesRouter from "./routes/articles.js";
import categoriesRouter from "./routes/categories.js";
import sourcesRouter from "./routes/sources.js";
import { fetchAllFeeds, syncSourcesToDb } from "./services/feedService.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/api/articles", articlesRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/sources", sourcesRouter);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Sync sources from config to DB on startup
syncSourcesToDb();

// Fetch feeds on startup
fetchAllFeeds().then(() => {
  console.log("Initial feed fetch complete.");
});

// Schedule feed fetching every 15 minutes
cron.schedule("*/15 * * * *", () => {
  console.log("Cron: Fetching feeds...");
  fetchAllFeeds();
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

- [ ] **Step 5: Test the server**

Run: `cd server && node src/index.js`
Expected: Server starts, fetches feeds, logs "Initial feed fetch complete."
Test: `curl http://localhost:3001/api/articles` returns JSON with articles.
Kill the server after verifying.

- [ ] **Step 6: Commit**

```bash
git add server/
git commit -m "feat: add API routes for articles, categories, sources with cron scheduling"
```

---

## Task 5: Frontend Scaffolding

**Files:**
- Create: `client/` (via Vite scaffolding)
- Modify: `client/package.json` (add dependencies)
- Create: `client/tailwind.config.js`
- Create: `client/vite.config.js`

- [ ] **Step 1: Scaffold React app with Vite**

Run: `cd ~/Desktop/politik-news && npm create vite@latest client -- --template react`
Expected: `client/` directory created with React template

- [ ] **Step 2: Install dependencies**

Run: `cd client && npm install && npm install -D tailwindcss @tailwindcss/vite && npm install react-router-dom lucide-react`
Expected: All packages installed

- [ ] **Step 3: Create client/vite.config.js**

Replace the existing file with:

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});
```

- [ ] **Step 4: Setup Tailwind in client/src/index.css**

Replace entire file with:

```css
@import "tailwindcss";
```

- [ ] **Step 5: Commit**

```bash
git add client/
git commit -m "feat: scaffold React frontend with Vite, Tailwind CSS, and API proxy"
```

---

## Task 6: Frontend Shared Code (API Client & Categories)

**Files:**
- Create: `client/src/lib/api.js`
- Create: `client/src/lib/categories.js`

- [ ] **Step 1: Create client/src/lib/api.js**

```js
const BASE = "/api";

export async function fetchArticles({ page = 1, limit = 20, category = null } = {}) {
  const params = new URLSearchParams({ page, limit });
  if (category) params.set("category", category);
  const res = await fetch(`${BASE}/articles?${params}`);
  return res.json();
}

export async function searchArticles({ q, source, category, page = 1, limit = 20 } = {}) {
  const params = new URLSearchParams({ page, limit });
  if (q) params.set("q", q);
  if (source) params.set("source", source);
  if (category) params.set("category", category);
  const res = await fetch(`${BASE}/articles/search?${params}`);
  return res.json();
}

export async function fetchCategories() {
  const res = await fetch(`${BASE}/categories`);
  return res.json();
}

export async function fetchSources() {
  const res = await fetch(`${BASE}/sources`);
  return res.json();
}
```

- [ ] **Step 2: Create client/src/lib/categories.js**

```js
import { Landmark, Globe, TrendingUp, Leaf, Users, Cpu } from "lucide-react";

const CATEGORIES = [
  { name: "Innenpolitik", icon: Landmark, color: "text-red-400", bg: "bg-red-400/10" },
  { name: "Außenpolitik", icon: Globe, color: "text-blue-400", bg: "bg-blue-400/10" },
  { name: "Wirtschaft", icon: TrendingUp, color: "text-yellow-400", bg: "bg-yellow-400/10" },
  { name: "Klima & Umwelt", icon: Leaf, color: "text-green-400", bg: "bg-green-400/10" },
  { name: "Gesellschaft", icon: Users, color: "text-purple-400", bg: "bg-purple-400/10" },
  { name: "Technologie", icon: Cpu, color: "text-cyan-400", bg: "bg-cyan-400/10" },
];

export function getCategoryMeta(name) {
  return CATEGORIES.find((c) => c.name === name) || CATEGORIES[0];
}

export default CATEGORIES;
```

- [ ] **Step 3: Commit**

```bash
git add client/src/lib/
git commit -m "feat: add API client and category definitions with icons"
```

---

## Task 7: Frontend Components

**Files:**
- Create: `client/src/components/Header.jsx`
- Create: `client/src/components/ArticleCard.jsx`
- Create: `client/src/components/HeroArticle.jsx`
- Create: `client/src/components/FilterPanel.jsx`

- [ ] **Step 1: Create client/src/components/Header.jsx**

```jsx
import { Link, useNavigate } from "react-router-dom";
import { Search, Newspaper } from "lucide-react";
import { useState } from "react";
import CATEGORIES from "../lib/categories";

export default function Header() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  function handleSearch(e) {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/suche?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
    }
  }

  return (
    <header className="bg-gray-900 border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <Newspaper className="w-7 h-7 text-red-500" />
            <span className="text-xl font-bold text-white">
              Politik <span className="text-red-500">News</span>
            </span>
          </Link>

          <form onSubmit={handleSearch} className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Thema oder Quelle suchen..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 text-sm"
              />
            </div>
          </form>
        </div>

        <nav className="flex gap-1 mt-3 overflow-x-auto pb-1">
          <Link
            to="/"
            className="px-3 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors whitespace-nowrap"
          >
            Alle
          </Link>
          {CATEGORIES.map(({ name, icon: Icon, color }) => (
            <Link
              key={name}
              to={`/kategorie/${encodeURIComponent(name)}`}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors whitespace-nowrap"
            >
              <Icon className={`w-3.5 h-3.5 ${color}`} />
              {name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Create client/src/components/ArticleCard.jsx**

```jsx
import { ExternalLink, Clock } from "lucide-react";
import { getCategoryMeta } from "../lib/categories";

export default function ArticleCard({ article }) {
  const cat = getCategoryMeta(article.category);
  const Icon = cat.icon;
  const date = new Date(article.published).toLocaleDateString("de-DE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <article className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:border-gray-500 transition-colors group">
      {article.image_url && (
        <img
          src={article.image_url}
          alt=""
          className="w-full h-44 object-cover"
          loading="lazy"
        />
      )}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${cat.bg} ${cat.color}`}>
            <Icon className="w-3 h-3" />
            {article.category}
          </span>
          <span className="text-xs text-gray-500">{article.source}</span>
        </div>

        <h3 className="text-white font-semibold mb-2 line-clamp-2 group-hover:text-red-400 transition-colors">
          {article.title}
        </h3>

        <p className="text-gray-400 text-sm line-clamp-3 mb-3">
          {article.summary}
        </p>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            {date}
          </span>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300 transition-colors"
          >
            Zum Artikel
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </article>
  );
}
```

- [ ] **Step 3: Create client/src/components/HeroArticle.jsx**

```jsx
import { ExternalLink } from "lucide-react";
import { getCategoryMeta } from "../lib/categories";

export default function HeroArticle({ article }) {
  const cat = getCategoryMeta(article.category);
  const Icon = cat.icon;

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="relative block rounded-xl overflow-hidden group h-72 bg-gray-800"
    >
      {article.image_url && (
        <img
          src={article.image_url}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-70 transition-opacity"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${cat.bg} ${cat.color}`}>
            <Icon className="w-3 h-3" />
            {article.category}
          </span>
          <span className="text-xs text-gray-300">{article.source}</span>
        </div>
        <h2 className="text-white text-xl font-bold mb-1 line-clamp-2">
          {article.title}
        </h2>
        <p className="text-gray-300 text-sm line-clamp-2">{article.summary}</p>
        <span className="inline-flex items-center gap-1 text-sm text-red-400 mt-2">
          Weiterlesen <ExternalLink className="w-3.5 h-3.5" />
        </span>
      </div>
    </a>
  );
}
```

- [ ] **Step 4: Create client/src/components/FilterPanel.jsx**

```jsx
export default function FilterPanel({ sources, categories, filters, onChange }) {
  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <select
        value={filters.source || ""}
        onChange={(e) => onChange({ ...filters, source: e.target.value || null })}
        className="bg-gray-800 border border-gray-600 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-red-500"
      >
        <option value="">Alle Quellen</option>
        {sources.map((s) => (
          <option key={s.name} value={s.name}>
            {s.name}
          </option>
        ))}
      </select>

      <select
        value={filters.category || ""}
        onChange={(e) => onChange({ ...filters, category: e.target.value || null })}
        className="bg-gray-800 border border-gray-600 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-red-500"
      >
        <option value="">Alle Kategorien</option>
        {categories.map((c) => (
          <option key={c.name} value={c.name}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add client/src/components/
git commit -m "feat: add Header, ArticleCard, HeroArticle, and FilterPanel components"
```

---

## Task 8: Frontend Pages & App Shell

**Files:**
- Create: `client/src/pages/HomePage.jsx`
- Create: `client/src/pages/CategoryPage.jsx`
- Create: `client/src/pages/SearchPage.jsx`
- Modify: `client/src/App.jsx`
- Modify: `client/src/main.jsx`

- [ ] **Step 1: Create client/src/pages/HomePage.jsx**

```jsx
import { useEffect, useState } from "react";
import { fetchArticles } from "../lib/api";
import HeroArticle from "../components/HeroArticle";
import ArticleCard from "../components/ArticleCard";

export default function HomePage() {
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticles(1);
  }, []);

  async function loadArticles(p) {
    setLoading(true);
    const data = await fetchArticles({ page: p, limit: 20 });
    if (p === 1) {
      setArticles(data.articles);
    } else {
      setArticles((prev) => [...prev, ...data.articles]);
    }
    setPage(p);
    setTotalPages(data.totalPages);
    setLoading(false);
  }

  const heroArticles = articles.slice(0, 3);
  const restArticles = articles.slice(3);

  return (
    <div>
      {heroArticles.length > 0 && (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {heroArticles.map((a) => (
            <HeroArticle key={a.id} article={a} />
          ))}
        </section>
      )}

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {restArticles.map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </section>

      {page < totalPages && (
        <div className="text-center mt-8">
          <button
            onClick={() => loadArticles(page + 1)}
            disabled={loading}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? "Laden..." : "Mehr laden"}
          </button>
        </div>
      )}

      {loading && articles.length === 0 && (
        <p className="text-center text-gray-400 mt-12">Artikel werden geladen...</p>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create client/src/pages/CategoryPage.jsx**

```jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchArticles } from "../lib/api";
import { getCategoryMeta } from "../lib/categories";
import ArticleCard from "../components/ArticleCard";

export default function CategoryPage() {
  const { name } = useParams();
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const cat = getCategoryMeta(decodeURIComponent(name));
  const Icon = cat.icon;

  useEffect(() => {
    setArticles([]);
    setPage(1);
    loadArticles(1);
  }, [name]);

  async function loadArticles(p) {
    setLoading(true);
    const data = await fetchArticles({
      page: p,
      limit: 20,
      category: decodeURIComponent(name),
    });
    if (p === 1) {
      setArticles(data.articles);
    } else {
      setArticles((prev) => [...prev, ...data.articles]);
    }
    setPage(p);
    setTotalPages(data.totalPages);
    setLoading(false);
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Icon className={`w-8 h-8 ${cat.color}`} />
        <h1 className="text-2xl font-bold text-white">
          {decodeURIComponent(name)}
        </h1>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </section>

      {page < totalPages && (
        <div className="text-center mt-8">
          <button
            onClick={() => loadArticles(page + 1)}
            disabled={loading}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? "Laden..." : "Mehr laden"}
          </button>
        </div>
      )}

      {loading && articles.length === 0 && (
        <p className="text-center text-gray-400 mt-12">Artikel werden geladen...</p>
      )}

      {!loading && articles.length === 0 && (
        <p className="text-center text-gray-400 mt-12">
          Keine Artikel in dieser Kategorie gefunden.
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Create client/src/pages/SearchPage.jsx**

```jsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchArticles, fetchSources } from "../lib/api";
import CATEGORIES from "../lib/categories";
import ArticleCard from "../components/ArticleCard";
import FilterPanel from "../components/FilterPanel";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const [articles, setArticles] = useState([]);
  const [sources, setSources] = useState([]);
  const [filters, setFilters] = useState({ source: null, category: null });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSources().then(setSources);
  }, []);

  useEffect(() => {
    setArticles([]);
    setPage(1);
    loadResults(1);
  }, [q, filters.source, filters.category]);

  async function loadResults(p) {
    setLoading(true);
    const data = await searchArticles({
      q,
      source: filters.source,
      category: filters.category,
      page: p,
      limit: 20,
    });
    if (p === 1) {
      setArticles(data.articles);
    } else {
      setArticles((prev) => [...prev, ...data.articles]);
    }
    setPage(p);
    setTotalPages(data.totalPages);
    setLoading(false);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">
        {q ? `Ergebnisse für "${q}"` : "Suche"}
      </h1>

      <FilterPanel
        sources={sources}
        categories={CATEGORIES}
        filters={filters}
        onChange={setFilters}
      />

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </section>

      {page < totalPages && (
        <div className="text-center mt-8">
          <button
            onClick={() => loadResults(page + 1)}
            disabled={loading}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? "Laden..." : "Mehr laden"}
          </button>
        </div>
      )}

      {loading && articles.length === 0 && (
        <p className="text-center text-gray-400 mt-12">Suche läuft...</p>
      )}

      {!loading && articles.length === 0 && (
        <p className="text-center text-gray-400 mt-12">Keine Ergebnisse gefunden.</p>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Modify client/src/App.jsx**

Replace the entire file with:

```jsx
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";
import SearchPage from "./pages/SearchPage";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/kategorie/:name" element={<CategoryPage />} />
          <Route path="/suche" element={<SearchPage />} />
        </Routes>
      </main>
    </div>
  );
}
```

- [ ] **Step 5: Modify client/src/main.jsx**

Replace the entire file with:

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
```

- [ ] **Step 6: Commit**

```bash
git add client/src/
git commit -m "feat: add pages (Home, Category, Search) and App shell with routing"
```

---

## Task 9: Cleanup & Final Integration

**Files:**
- Modify: `client/index.html` (update title)
- Delete: `client/src/App.css` (unused)
- Delete: `client/public/vite.svg` (unused)
- Delete: `client/src/assets/react.svg` (unused)

- [ ] **Step 1: Update client/index.html title**

Change `<title>Vite + React</title>` to `<title>Politik News</title>`

- [ ] **Step 2: Remove unused scaffolding files**

```bash
rm -f client/src/App.css client/public/vite.svg client/src/assets/react.svg
```

- [ ] **Step 3: Test the full stack**

Terminal 1: `cd server && node src/index.js`
Terminal 2: `cd client && npm run dev`

Expected:
- Server fetches RSS feeds and logs results
- Frontend loads at http://localhost:5173
- Hero articles display at top
- Article cards show in grid below
- Category navigation works
- Search returns results

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: cleanup scaffolding, update page title, final integration"
```

---

## Task 10: Create GitHub Repository

- [ ] **Step 1: Create GitHub repo and push**

```bash
cd ~/Desktop/politik-news
gh repo create politik-news --public --source=. --push
```

Expected: Repository created, all commits pushed.
