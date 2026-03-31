import { useEffect, useState } from "react";
import { Layers, ExternalLink, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { fetchStoryClusters } from "../lib/api";
import { getSourceMeta } from "../lib/sources";

export default function StoryClustersPage() {
  const [clusters, setClusters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    fetchStoryClusters(48).then((data) => {
      setClusters(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  }, []);

  function toggleExpand(i) {
    setExpanded((prev) => ({ ...prev, [i]: !prev[i] }));
  }

  if (loading) return <p className="text-center text-gray-400 mt-12">Story-Cluster werden geladen...</p>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <Layers className="w-8 h-8 text-blue-400" />
        <h1 className="text-2xl font-bold text-white">Story-Vergleich</h1>
      </div>
      <p className="text-gray-400 text-sm mb-6">
        Gleiche Themen aus verschiedenen Quellen — sieh wie unterschiedlich berichtet wird.
      </p>

      {clusters.length === 0 && (
        <div className="text-center mt-12">
          <Layers className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">
            Noch keine Story-Cluster gefunden.
          </p>
          <p className="text-gray-500 text-sm mt-1">
            Es braucht mindestens 2 Quellen, die über dasselbe Thema berichten.
          </p>
        </div>
      )}

      {/* Übersicht */}
      {clusters.length > 0 && (
        <div className="bg-gray-800/30 rounded-lg px-4 py-2.5 mb-6 flex items-center gap-4 text-sm text-gray-400">
          <span><strong className="text-white">{clusters.length}</strong> Themen-Cluster</span>
          <span>·</span>
          <span><strong className="text-white">{clusters.reduce((sum, c) => sum + c.articles.length, 0)}</strong> Artikel</span>
          <span>·</span>
          <span>Letzte 48 Stunden</span>
        </div>
      )}

      <div className="space-y-4">
        {clusters.map((cluster, i) => {
          if (!cluster.articles || cluster.articles.length === 0) return null;
          const isOpen = expanded[i] !== false; // default open für erste 3
          const firstArticle = cluster.articles[0];
          const sources = [...new Set(cluster.articles.map((a) => a.source))];

          return (
            <div key={i} className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
              {/* Cluster Header — klickbar */}
              <button
                onClick={() => toggleExpand(i)}
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-700/20 transition-colors text-left"
              >
                <div className="flex-1 min-w-0">
                  <h2 className="text-white font-semibold line-clamp-1 text-base">
                    {cluster.topic}
                  </h2>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    {sources.map((name) => {
                      const src = getSourceMeta(name);
                      return (
                        <span
                          key={name}
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${src.bg} ${src.color} border ${src.border}`}
                        >
                          {name}
                        </span>
                      );
                    })}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  <span className="text-xs text-gray-400">
                    {cluster.articles.length} Artikel
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </button>

              {/* Artikel im Cluster */}
              {isOpen && (
                <div className="border-t border-gray-700 divide-y divide-gray-700/50">
                  {cluster.articles.map((article) => {
                    const src = getSourceMeta(article.source);
                    const date = new Date(article.published);
                    const dateStr = isNaN(date.getTime())
                      ? ""
                      : date.toLocaleDateString("de-DE", {
                          day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
                        });
                    return (
                      <a
                        key={article.id}
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-3 px-5 py-3 hover:bg-gray-700/20 transition-colors group"
                      >
                        <span className={`text-xs font-bold px-2 py-1 rounded-md shrink-0 mt-0.5 ${src.bg} ${src.color} border ${src.border}`}>
                          {src.abbr}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium group-hover:text-red-400 transition-colors line-clamp-2">
                            {article.title}
                          </p>
                          {article.summary && (
                            <p className="text-gray-400 text-xs mt-1 line-clamp-2">
                              {article.summary}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {dateStr && (
                            <span className="flex items-center gap-1 text-[10px] text-gray-500 hidden md:flex">
                              <Clock className="w-3 h-3" />
                              {dateStr}
                            </span>
                          )}
                          <ExternalLink className="w-3.5 h-3.5 text-gray-500 group-hover:text-red-400" />
                        </div>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
