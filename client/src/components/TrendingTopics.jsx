import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchTrendingTopics } from "../lib/api";

export default function TrendingTopics() {
  const [topics, setTopics] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrendingTopics(24).then((data) => {
      if (Array.isArray(data)) setTopics(data);
    });
  }, []);

  if (topics.length === 0) return null;

  const maxCount = topics[0]?.count || 1;

  function getSize(count) {
    const ratio = count / maxCount;
    if (ratio > 0.7) return "text-sm font-bold";
    if (ratio > 0.4) return "text-xs font-semibold";
    return "text-xs font-medium";
  }

  function getStyle(count) {
    const ratio = count / maxCount;
    if (ratio > 0.7) return { backgroundColor: "rgba(239,68,68,0.2)", color: "#fca5a5", borderColor: "rgba(239,68,68,0.3)" };
    if (ratio > 0.4) return { backgroundColor: "rgba(249,115,22,0.15)", color: "#fdba74", borderColor: "rgba(249,115,22,0.25)" };
    return { backgroundColor: "rgba(55,65,81,0.5)", color: "#d1d5db", borderColor: "rgba(75,85,99,0.5)" };
  }

  return (
    <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="w-4 h-4 text-red-400" />
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
          Trending Themen
        </h3>
        <span className="text-[10px] text-gray-500">letzte 24h</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {topics.map(({ word, count }) => (
          <button
            key={word}
            onClick={() => navigate(`/suche?q=${encodeURIComponent(word)}`)}
            className={`px-2.5 py-1 rounded-lg border transition-opacity hover:opacity-80 cursor-pointer ${getSize(count)}`}
            style={getStyle(count)}
          >
            {word}
            <span className="ml-1 opacity-40 text-[10px]">{count}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
