import { useEffect, useState } from "react";
import { Zap } from "lucide-react";
import { fetchBreakingNews } from "../lib/api";

export default function BreakingNews() {
  const [article, setArticle] = useState(null);

  useEffect(() => {
    let active = true;
    load();
    const interval = setInterval(load, 60000);
    return () => { active = false; clearInterval(interval); };

    async function load() {
      const data = await fetchBreakingNews();
      if (active && Array.isArray(data) && data.length > 0) {
        setArticle(data[0]);
      }
    }
  }, []);

  if (!article) return null;

  const timeAgo = getTimeAgo(article.published);

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-gradient-to-r from-red-700 via-red-600 to-red-700 rounded-lg px-4 py-2.5 mb-6 group hover:from-red-600 hover:to-red-600 transition-all"
    >
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5 bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0 animate-pulse">
          <Zap className="w-3 h-3" />
          Aktuell
        </span>
        <p className="text-white text-sm font-medium truncate group-hover:underline flex-1">
          {article.title}
        </p>
        <span className="text-red-200 text-xs shrink-0 hidden sm:flex items-center gap-2">
          {article.source}
          {timeAgo && <span className="text-red-300/60">· {timeAgo}</span>}
        </span>
      </div>
    </a>
  );
}

function getTimeAgo(published) {
  try {
    const diff = Date.now() - new Date(published).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "gerade eben";
    if (mins < 60) return `vor ${mins} Min`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `vor ${hours} Std`;
    return null;
  } catch {
    return null;
  }
}
