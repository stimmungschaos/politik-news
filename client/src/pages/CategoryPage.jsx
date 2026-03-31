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
