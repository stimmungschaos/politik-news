import { ExternalLink, Clock, Bookmark, BookmarkCheck } from "lucide-react";
import { useState } from "react";
import { getCategoryMeta } from "../lib/categories";
import { getSourceMeta } from "../lib/sources";
import { addBookmark, removeBookmark, isBookmarked } from "../lib/bookmarks";

export default function ArticleCard({ article }) {
  const cat = getCategoryMeta(article.category);
  const Icon = cat.icon;
  const src = getSourceMeta(article.source);
  const date = new Date(article.published).toLocaleDateString("de-DE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const [saved, setSaved] = useState(() => isBookmarked(article.id));
  const hasImage = !!article.image_url;

  function toggleBookmark(e) {
    e.preventDefault();
    e.stopPropagation();
    if (saved) {
      removeBookmark(article.id);
      setSaved(false);
    } else {
      addBookmark(article);
      setSaved(true);
    }
  }

  return (
    <article className="rounded-xl overflow-hidden transition-colors group" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}>
      {hasImage && (
        <div className="relative">
          <img
            src={article.image_url}
            alt=""
            className="w-full h-44 object-cover"
            loading="lazy"
          />
          {/* Source badge overlay on image */}
          <span className={`absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded-md ${src.bg} ${src.color} border ${src.border} backdrop-blur-sm`}>
            {src.abbr}
          </span>
        </div>
      )}
      <div className={`p-4 ${!hasImage ? "border-l-4 border-l-red-600/40" : ""}`}>
        <div className="flex items-center gap-2 mb-2">
          <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${cat.bg} ${cat.color}`}>
            <Icon className="w-3 h-3" />
            {article.category}
          </span>
          <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${src.bg} ${src.color} border ${src.border}`}>
            {article.source}
          </span>
        </div>

        <h3 className={`text-white font-semibold mb-2 group-hover:text-red-400 transition-colors ${hasImage ? "line-clamp-2" : "line-clamp-3 text-base"}`}>
          {article.title}
        </h3>

        <p className={`text-gray-400 text-sm mb-3 ${hasImage ? "line-clamp-3" : "line-clamp-4"}`}>
          {article.summary}
        </p>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            {date}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleBookmark}
              className={`p-1 rounded transition-colors ${saved ? "text-yellow-400" : "text-gray-500 hover:text-yellow-400"}`}
              title={saved ? "Lesezeichen entfernen" : "Lesezeichen setzen"}
            >
              {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </button>
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
      </div>
    </article>
  );
}
