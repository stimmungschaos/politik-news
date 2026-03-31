import { useEffect, useState } from "react";
import { Flame, Newspaper } from "lucide-react";
import { fetchArticles } from "../lib/api";
import HeroBanner from "../components/HeroBanner";
import BreakingNews from "../components/BreakingNews";
import TrendingTopics from "../components/TrendingTopics";
import HeroArticle from "../components/HeroArticle";
import ArticleCard from "../components/ArticleCard";
import SectionDivider from "../components/SectionDivider";

export default function HomePage() {
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticles(1);
  }, []);

  async function loadArticles(p) {
    setLoading(true);
    const data = await fetchArticles({ page: p, limit: 20 });
    if (p === 1) {
      setArticles(data.articles);
    } else {
      setArticles((prev) => [...prev, ...data.articles]);
    }
    setPage(p);
    setTotalPages(data.totalPages);
    setLoading(false);
  }

  const heroArticles = articles.slice(0, 3);
  const restArticles = articles.slice(3);

  return (
    <div>
      {/* Dekoratives Hero-Banner */}
      <HeroBanner />

      {/* Breaking News */}
      <BreakingNews />

      {/* Trending Topics */}
      <TrendingTopics />

      {/* Top-Artikel */}
      {heroArticles.length > 0 && (
        <>
          <SectionDivider title="Top-Meldungen" icon={Flame} />
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {heroArticles.map((a) => (
              <HeroArticle key={a.id} article={a} />
            ))}
          </section>
        </>
      )}

      {/* Alle weiteren Artikel */}
      {restArticles.length > 0 && (
        <>
          <SectionDivider title="Alle Nachrichten" icon={Newspaper} />
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {restArticles.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </section>
        </>
      )}

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
    </div>
  );
}
