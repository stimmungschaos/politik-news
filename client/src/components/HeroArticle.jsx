import { ExternalLink } from "lucide-react";
import { getCategoryMeta } from "../lib/categories";

export default function HeroArticle({ article }) {
  const cat = getCategoryMeta(article.category);
  const Icon = cat.icon;

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="relative block rounded-xl overflow-hidden group h-72 bg-gray-800"
    >
      {article.image_url && (
        <img
          src={article.image_url}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-70 transition-opacity"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${cat.bg} ${cat.color}`}>
            <Icon className="w-3 h-3" />
            {article.category}
          </span>
          <span className="text-xs text-gray-300">{article.source}</span>
        </div>
        <h2 className="text-white text-xl font-bold mb-1 line-clamp-2">
          {article.title}
        </h2>
        <p className="text-gray-300 text-sm line-clamp-2">{article.summary}</p>
        <span className="inline-flex items-center gap-1 text-sm text-red-400 mt-2">
          Weiterlesen <ExternalLink className="w-3.5 h-3.5" />
        </span>
      </div>
    </a>
  );
}
