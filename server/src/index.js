import express from "express";
import cors from "cors";
import cron from "node-cron";
import dotenv from "dotenv";
import articlesRouter from "./routes/articles.js";
import categoriesRouter from "./routes/categories.js";
import sourcesRouter from "./routes/sources.js";
import trendingRouter from "./routes/trending.js";
import { fetchAllFeeds, syncSourcesToDb } from "./services/feedService.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/api/articles", articlesRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/sources", sourcesRouter);
app.use("/api/trending", trendingRouter);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Manueller Feed-Refresh
let refreshing = false;
app.post("/api/refresh", async (req, res) => {
  if (refreshing) return res.json({ status: "already_running" });
  refreshing = true;
  try {
    const count = await fetchAllFeeds();
    res.json({ status: "ok", newArticles: count });
  } catch (err) {
    res.json({ status: "error", message: err.message });
  } finally {
    refreshing = false;
  }
});

// Sync sources from config to DB on startup
syncSourcesToDb();

// Fetch feeds on startup
fetchAllFeeds().then(() => {
  console.log("Initial feed fetch complete.");
});

// Schedule feed fetching every 5 minutes
cron.schedule("*/5 * * * *", () => {
  console.log("Cron: Fetching feeds...");
  fetchAllFeeds();
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
