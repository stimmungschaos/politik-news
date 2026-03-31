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
