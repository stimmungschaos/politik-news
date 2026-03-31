const BASE = "/api";

async function safeFetch(url, fallback) {
  try {
    const res = await fetch(url);
    if (!res.ok) return fallback;
    return res.json();
  } catch {
    return fallback;
  }
}

export async function fetchArticles({ page = 1, limit = 20, category = null } = {}) {
  const params = new URLSearchParams({ page, limit });
  if (category) params.set("category", category);
  return safeFetch(`${BASE}/articles?${params}`, { articles: [], total: 0, page: 1, limit: 20, totalPages: 0 });
}

export async function searchArticles({ q, source, category, page = 1, limit = 20 } = {}) {
  const params = new URLSearchParams({ page, limit });
  if (q) params.set("q", q);
  if (source) params.set("source", source);
  if (category) params.set("category", category);
  return safeFetch(`${BASE}/articles/search?${params}`, { articles: [], total: 0, page: 1, limit: 20, totalPages: 0 });
}

export async function fetchCategories() {
  return safeFetch(`${BASE}/categories`, []);
}

export async function fetchSources() {
  return safeFetch(`${BASE}/sources`, []);
}

export async function fetchTrendingTopics(hours = 24) {
  return safeFetch(`${BASE}/trending/topics?hours=${hours}`, []);
}

export async function fetchBreakingNews() {
  return safeFetch(`${BASE}/trending/breaking?limit=1`, []);
}

export async function fetchStats() {
  return safeFetch(`${BASE}/trending/stats`, {
    totalArticles: 0, totalSources: 0, todayCount: 0, aiSummaryCount: 0,
    bySource: [], byCategory: [], hourlyActivity: [],
  });
}

export async function fetchDailyDigest() {
  return safeFetch(`${BASE}/trending/digest?limit=5`, []);
}

export async function fetchStoryClusters(hours = 24) {
  return safeFetch(`${BASE}/trending/clusters?hours=${hours}`, []);
}

export async function fetchSimilarArticles(id) {
  return safeFetch(`${BASE}/trending/similar/${id}`, []);
}

export async function refreshFeeds() {
  try {
    const res = await fetch(`${BASE}/refresh`, { method: "POST" });
    if (!res.ok) return { status: "error" };
    return res.json();
  } catch {
    return { status: "error" };
  }
}

export async function addSource({ name, url, categories, logo }) {
  try {
    const res = await fetch(`${BASE}/sources`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, url, categories, logo }),
    });
    return res.json();
  } catch {
    return { error: "failed" };
  }
}

export async function deleteSource(name) {
  try {
    const res = await fetch(`${BASE}/sources/${encodeURIComponent(name)}`, { method: "DELETE" });
    return res.json();
  } catch {
    return { error: "failed" };
  }
}
