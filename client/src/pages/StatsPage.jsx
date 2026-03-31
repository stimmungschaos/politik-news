import { useEffect, useState } from "react";
import { BarChart3, Newspaper, Database, Brain, Clock, Zap } from "lucide-react";
import { fetchStats, fetchDailyDigest } from "../lib/api";
import { getSourceMeta } from "../lib/sources";
import { getCategoryMeta } from "../lib/categories";
import ArticleCard from "../components/ArticleCard";

function StatCard({ icon: Icon, label, value, color = "text-red-400" }) {
  return (
    <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-4">
      <Icon className={`w-5 h-5 ${color} mb-2`} />
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-gray-400 mt-1">{label}</p>
    </div>
  );
}

function BarChart({ data, getColor, getLabel }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <div className="space-y-2">
      {data.map((item, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="text-xs text-gray-400 w-28 truncate shrink-0">
            {getLabel ? getLabel(item) : item.source || item.category || item.hour}
          </span>
          <div className="flex-1 bg-gray-700/30 rounded-full h-5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${getColor ? getColor(item) : "bg-red-500/60"}`}
              style={{ width: `${(item.count / max) * 100}%` }}
            />
          </div>
          <span className="text-xs text-gray-400 w-8 text-right shrink-0">{item.count}</span>
        </div>
      ))}
    </div>
  );
}

export default function StatsPage() {
  const [stats, setStats] = useState(null);
  const [digest, setDigest] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchStats(), fetchDailyDigest()]).then(([s, d]) => {
      setStats(s);
      setDigest(d);
      setLoading(false);
    });
  }, []);

  if (loading) return <p className="text-center text-gray-400 mt-12">Dashboard lädt...</p>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="w-8 h-8 text-red-400" />
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Newspaper} label="Artikel gesamt" value={stats.totalArticles} />
        <StatCard icon={Database} label="Quellen" value={stats.totalSources} color="text-blue-400" />
        <StatCard icon={Zap} label="Heute" value={stats.todayCount} color="text-yellow-400" />
        <StatCard icon={Brain} label="KI-Zusammenfassungen" value={stats.aiSummaryCount} color="text-purple-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Artikel nach Quelle */}
        <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-5">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
            Artikel nach Quelle
          </h2>
          <BarChart
            data={stats.bySource}
            getLabel={(item) => item.source}
            getColor={(item) => {
              const meta = getSourceMeta(item.source);
              return meta.bg.replace("/20", "/60");
            }}
          />
        </div>

        {/* Artikel nach Kategorie */}
        <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-5">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
            Artikel nach Kategorie
          </h2>
          <BarChart
            data={stats.byCategory}
            getLabel={(item) => item.category}
            getColor={(item) => {
              const meta = getCategoryMeta(item.category);
              return meta.bg.replace("/10", "/60");
            }}
          />
        </div>
      </div>

      {/* Stündliche Aktivität */}
      {stats.hourlyActivity.length > 0 && (
        <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-5 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-gray-400" />
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
              Heute nach Stunde
            </h2>
          </div>
          <div className="flex items-end gap-1 h-32">
            {Array.from({ length: 24 }, (_, h) => {
              const entry = stats.hourlyActivity.find((e) => parseInt(e.hour) === h);
              const count = entry?.count || 0;
              const max = Math.max(...stats.hourlyActivity.map((e) => e.count), 1);
              return (
                <div key={h} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-red-500/40 rounded-t transition-all min-h-[2px]"
                    style={{ height: `${(count / max) * 100}%` }}
                  />
                  {h % 3 === 0 && (
                    <span className="text-[9px] text-gray-500">{h}h</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tages-Digest */}
      {digest.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
            Tages-Digest — Das Wichtigste von heute
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {digest.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
