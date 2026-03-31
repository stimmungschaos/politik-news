import { Router } from "express";
import { getTrendingTopics, getBreakingNews, getStats, getDailyDigest, getStoryClusters, findSimilarArticles } from "../db/database.js";

const router = Router();

router.get("/topics", (req, res) => {
  const hours = parseInt(req.query.hours) || 24;
  const limit = parseInt(req.query.limit) || 15;
  res.json(getTrendingTopics(hours, limit));
});

router.get("/breaking", (req, res) => {
  const limit = parseInt(req.query.limit) || 1;
  res.json(getBreakingNews(limit));
});

router.get("/stats", (req, res) => {
  res.json(getStats());
});

router.get("/digest", (req, res) => {
  const limit = parseInt(req.query.limit) || 5;
  res.json(getDailyDigest(limit));
});

router.get("/clusters", (req, res) => {
  const hours = parseInt(req.query.hours) || 24;
  res.json(getStoryClusters(hours));
});

router.get("/similar/:id", (req, res) => {
  const id = parseInt(req.params.id);
  res.json(findSimilarArticles(id));
});

export default router;
