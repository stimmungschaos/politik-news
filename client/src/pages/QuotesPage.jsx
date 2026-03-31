import { useState, useEffect } from "react";
import { Quote, RefreshCw, Star } from "lucide-react";
import { getRandomQuote } from "../lib/quotes";
import QUOTES from "../lib/quotes";

export default function QuotesPage() {
  const [featured, setFeatured] = useState(() => getRandomQuote());
  const [filter, setFilter] = useState("Alle");

  const authors = ["Alle", ...new Set(QUOTES.map((q) => q.author))];
  const filtered = filter === "Alle" ? QUOTES : QUOTES.filter((q) => q.author === filter);

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <Quote className="w-8 h-8 text-red-400" />
        <h1 className="text-2xl font-bold text-white">Zitate</h1>
      </div>
      <p className="text-gray-400 text-sm mb-8">
        Worte die bewegen — von den großen Denker:innen der sozialistischen Bewegung.
      </p>

      {/* Featured Quote */}
      <div className="bg-gradient-to-r from-red-900/40 via-gray-800/60 to-red-900/40 rounded-2xl border border-red-900/30 p-8 mb-8 relative overflow-hidden">
        <Star className="w-24 h-24 text-red-500/5 absolute -top-4 -right-4" />
        <Quote className="w-12 h-12 text-red-500/15 mb-4" />
        <p className="text-gray-100 italic text-lg md:text-xl leading-relaxed mb-4">
          „{featured.text}"
        </p>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-red-400 font-bold">{featured.author}</span>
            {featured.source && (
              <span className="text-gray-500 text-sm ml-2">— {featured.source}</span>
            )}
          </div>
          <button
            onClick={() => setFeatured(getRandomQuote())}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-400 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Neues Zitat
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {authors.map((name) => (
          <button
            key={name}
            onClick={() => setFilter(name)}
            className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
              filter === name
                ? "bg-red-600 border-red-600 text-white"
                : "bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500"
            }`}
          >
            {name}
            {name !== "Alle" && (
              <span className="ml-1 text-xs opacity-50">
                ({QUOTES.filter((q) => q.author === name).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* All Quotes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((q, i) => (
          <div
            key={i}
            className="bg-gray-800/50 rounded-xl border border-gray-700 p-5 hover:border-gray-500 transition-colors"
          >
            <p className="text-gray-200 italic text-sm leading-relaxed mb-3">
              „{q.text}"
            </p>
            <div>
              <span className="text-red-400 font-semibold text-sm">{q.author}</span>
              {q.source && (
                <span className="text-gray-500 text-xs ml-2">— {q.source}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
