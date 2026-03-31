import { Link, useNavigate } from "react-router-dom";
import { Search, Newspaper } from "lucide-react";
import { useState } from "react";
import CATEGORIES from "../lib/categories";

export default function Header() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  function handleSearch(e) {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/suche?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
    }
  }

  return (
    <header className="bg-gray-900 border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <Newspaper className="w-7 h-7 text-red-500" />
            <span className="text-xl font-bold text-white">
              Politik <span className="text-red-500">News</span>
            </span>
          </Link>

          <form onSubmit={handleSearch} className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Thema oder Quelle suchen..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 text-sm"
              />
            </div>
          </form>
        </div>

        <nav className="flex gap-1 mt-3 overflow-x-auto pb-1">
          <Link
            to="/"
            className="px-3 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors whitespace-nowrap"
          >
            Alle
          </Link>
          {CATEGORIES.map(({ name, icon: Icon, color }) => (
            <Link
              key={name}
              to={`/kategorie/${encodeURIComponent(name)}`}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors whitespace-nowrap"
            >
              <Icon className={`w-3.5 h-3.5 ${color}`} />
              {name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
