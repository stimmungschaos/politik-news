import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchTrendingTopics } from "../lib/api";

export default function TrendingTopics() {
  const [topics, setTopics] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrendingTopics(24).then(setTopics);
  }, []);

  if (topics.length === 0) return null;

  const maxCount = topics[0]?.count || 1;

  function getSize(count) {
    const ratio = count / maxCount;
    if (ratio > 0.7) return "text-base font-bold";
    if (ratio > 0.4) return "text-sm font-semibold";
    return "text-xs font-medium";
  }

  function getColor(count) {
    const ratio = count / maxCount;
    if (ratio > 0.7) return "bg-red-500/20 text-red-300 border-red-500/30";
    if (ratio > 0.4) return "bg-orange-500/15 text-orange-300 border-orange-500/25";
    return "bg-gray-700/50 text-gray-300 border-gray-600/50";
  }

  return (
    <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="w-4 h-4 text-red-400" />
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
          Trending Themen
        </h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {topics.map(({ word, count }) => (
          <button
            key={word}
            onClick={() => navigate(`/suche?q=${encodeURIComponent(word)}`)}
            className={`px-2.5 py-1 rounded-lg border transition-colors hover:brightness-125 cursor-pointer ${getSize(count)} ${getColor(count)}`}
          >
            {word}
            <span className="ml-1 opacity-50 text-[10px]">{count}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
