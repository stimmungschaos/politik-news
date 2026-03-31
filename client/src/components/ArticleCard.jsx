import { ExternalLink, Clock } from "lucide-react";
import { getCategoryMeta } from "../lib/categories";

export default function ArticleCard({ article }) {
  const cat = getCategoryMeta(article.category);
  const Icon = cat.icon;
  const date = new Date(article.published).toLocaleDateString("de-DE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <article className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:border-gray-500 transition-colors group">
      {article.image_url && (
        <img
          src={article.image_url}
          alt=""
          className="w-full h-44 object-cover"
          loading="lazy"
        />
      )}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${cat.bg} ${cat.color}`}>
            <Icon className="w-3 h-3" />
            {article.category}
          </span>
          <span className="text-xs text-gray-500">{article.source}</span>
        </div>

        <h3 className="text-white font-semibold mb-2 line-clamp-2 group-hover:text-red-400 transition-colors">
          {article.title}
        </h3>

        <p className="text-gray-400 text-sm line-clamp-3 mb-3">
          {article.summary}
        </p>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            {date}
          </span>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300 transition-colors"
          >
            Zum Artikel
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </article>
  );
}
