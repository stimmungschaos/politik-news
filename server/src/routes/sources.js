import { Router } from "express";
import { getSources } from "../db/database.js";
import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sourcesPath = path.join(__dirname, "..", "config", "sources.json");

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

// Add new source
router.post("/", (req, res) => {
  const { name, url, categories, logo } = req.body;
  if (!name || !url) return res.status(400).json({ error: "name and url required" });

  const sources = JSON.parse(readFileSync(sourcesPath, "utf-8"));
  if (sources.some(s => s.url === url)) return res.status(409).json({ error: "source already exists" });

  sources.push({ name, url, categories: categories || ["Innenpolitik"], logo: logo || name.toLowerCase() });
  writeFileSync(sourcesPath, JSON.stringify(sources, null, 2));
  res.json({ status: "ok", sources });
});

// Delete source
router.delete("/:name", (req, res) => {
  const sources = JSON.parse(readFileSync(sourcesPath, "utf-8"));
  const filtered = sources.filter(s => s.name !== req.params.name);
  if (filtered.length === sources.length) return res.status(404).json({ error: "source not found" });

  writeFileSync(sourcesPath, JSON.stringify(filtered, null, 2));
  res.json({ status: "ok", sources: filtered });
});

export default router;
