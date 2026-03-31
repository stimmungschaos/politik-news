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
