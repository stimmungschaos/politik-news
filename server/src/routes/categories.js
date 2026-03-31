import { Router } from "express";
import { getCategories } from "../db/database.js";

const router = Router();

router.get("/", (req, res) => {
  const categories = getCategories();
  res.json(categories);
});

export default router;
