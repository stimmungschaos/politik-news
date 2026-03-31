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
