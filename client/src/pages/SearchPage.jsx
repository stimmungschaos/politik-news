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
