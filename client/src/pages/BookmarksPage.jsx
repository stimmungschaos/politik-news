import { useState } from "react";
import { Bookmark, Trash2 } from "lucide-react";
import { getBookmarks, removeBookmark } from "../lib/bookmarks";
import ArticleCard from "../components/ArticleCard";

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState(() => getBookmarks());

  function handleRemoveAll() {
    localStorage.removeItem("politik-news-bookmarks");
    setBookmarks([]);
  }

  function handleRemove(id) {
    removeBookmark(id);
    setBookmarks(getBookmarks());
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Bookmark className="w-8 h-8 text-yellow-400" />
          <h1 className="text-2xl font-bold text-white">Lesezeichen</h1>
          <span className="text-sm text-gray-400">({bookmarks.length})</span>
        </div>
        {bookmarks.length > 0 && (
          <button
            onClick={handleRemoveAll}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Alle entfernen
          </button>
        )}
      </div>

      {bookmarks.length === 0 && (
        <p className="text-center text-gray-400 mt-12">
          Noch keine Lesezeichen gesetzt. Klicke auf das Lesezeichen-Icon bei einem Artikel.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bookmarks.map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </div>
    </div>
  );
}
