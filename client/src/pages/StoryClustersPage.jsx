import { useEffect, useState } from "react";
import { Layers, ExternalLink, Clock } from "lucide-react";
import { fetchStoryClusters } from "../lib/api";
import { getSourceMeta } from "../lib/sources";
import { getCategoryMeta } from "../lib/categories";

export default function StoryClustersPage() {
  const [clusters, setClusters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStoryClusters(48).then((data) => {
      setClusters(data);
      setLoading(false);
    });
  }, []);

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
        <p className="text-center text-gray-400 mt-12">
          Noch keine Story-Cluster gefunden. Es braucht mindestens 2 Quellen, die über dasselbe berichten.
        </p>
      )}

      <div className="space-y-6">
        {clusters.map((cluster, i) => {
          const cat = getCategoryMeta(cluster.articles[0]?.category);
          const Icon = cat.icon;
          return (
            <div key={i} className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
              {/* Cluster Header */}
              <div className="px-5 py-3 border-b border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${cat.color}`} />
                  <h2 className="text-white font-semibold line-clamp-1">{cluster.topic}</h2>
                </div>
                <span className="text-xs text-gray-400 shrink-0 ml-3">
                  {cluster.sourceCount} Quellen · {cluster.articles.length} Artikel
                </span>
              </div>

              {/* Articles in cluster */}
              <div className="divide-y divide-gray-700/50">
                {cluster.articles.map((article) => {
                  const src = getSourceMeta(article.source);
                  const date = new Date(article.published).toLocaleDateString("de-DE", {
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
                        <p className="text-white text-sm font-medium group-hover:text-red-400 transition-colors line-clamp-1">
                          {article.title}
                        </p>
                        <p className="text-gray-400 text-xs mt-1 line-clamp-2">
                          {article.summary}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="flex items-center gap-1 text-[10px] text-gray-500">
                          <Clock className="w-3 h-3" />
                          {date}
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 text-gray-500 group-hover:text-red-400" />
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
