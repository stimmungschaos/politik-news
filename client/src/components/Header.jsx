import { Link, useNavigate } from "react-router-dom";
import { Search, Newspaper } from "lucide-react";
import { useState } from "react";
import CATEGORIES from "../lib/categories";
import { HEADER_ACCENT_ICONS, HEADER_SLOGAN, FLAGS } from "../lib/icons";

/** Kleine inline SVG-Flagge (3 horizontale Streifen oder custom) */
function MiniFlag({ colors, title }) {
  if (colors.length === 2) {
    // Einfarbig mit Symbol (z.B. Vietnam: rot + gelber Stern)
    return (
      <svg width="18" height="12" viewBox="0 0 18 12" className="rounded-[2px] shrink-0" aria-label={title}>
        <rect width="18" height="12" fill={colors[0]} />
        <polygon points="9,2 10.2,5.2 13.5,5.2 10.8,7.2 11.7,10.5 9,8.5 6.3,10.5 7.2,7.2 4.5,5.2 7.8,5.2" fill={colors[1]} />
      </svg>
    );
  }
  if (colors.length === 4) {
    // Palästina-Style: 3 Streifen + Dreieck
    return (
      <svg width="18" height="12" viewBox="0 0 18 12" className="rounded-[2px] shrink-0" aria-label={title}>
        <rect y="0" width="18" height="4" fill={colors[0]} />
        <rect y="4" width="18" height="4" fill={colors[1]} />
        <rect y="8" width="18" height="4" fill={colors[2]} />
        <polygon points="0,0 7,6 0,12" fill={colors[3]} />
      </svg>
    );
  }
  // 3 horizontale Streifen
  const h = 12 / colors.length;
  return (
    <svg width="18" height="12" viewBox="0 0 18 12" className="rounded-[2px] shrink-0" aria-label={title}>
      {colors.map((c, i) => (
        <rect key={i} y={i * h} width="18" height={h} fill={c} />
      ))}
    </svg>
  );
}

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
      {/* Top accent bar — politische Icons, Flaggen, Slogan */}
      <div className="bg-gradient-to-r from-red-900/50 via-gray-900 to-red-900/50 px-4 py-1.5">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 md:gap-4">
          {/* Icons links */}
          {HEADER_ACCENT_ICONS.slice(0, 3).map(({ icon: Icon }, i) => (
            <Icon key={`l${i}`} className="w-3.5 h-3.5 text-red-500/60 hidden sm:block" />
          ))}

          {/* Flaggen links */}
          {FLAGS.slice(0, 3).map((f) => (
            <MiniFlag key={f.name} colors={f.colors} title={f.name} />
          ))}

          {/* Slogan */}
          <span className="text-[9px] md:text-[10px] uppercase tracking-[0.25em] text-red-400 font-bold whitespace-nowrap">
            ★ {HEADER_SLOGAN} ★
          </span>

          {/* Flaggen rechts */}
          {FLAGS.slice(3).map((f) => (
            <MiniFlag key={f.name} colors={f.colors} title={f.name} />
          ))}

          {/* Icons rechts */}
          {HEADER_ACCENT_ICONS.slice(3, 6).map(({ icon: Icon }, i) => (
            <Icon key={`r${i}`} className="w-3.5 h-3.5 text-red-500/60 hidden sm:block" />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="bg-red-600 p-1.5 rounded-lg">
              <Newspaper className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-xl font-bold text-white">
                Politik <span className="text-red-500">News</span>
              </span>
              <span className="text-[10px] text-gray-500 tracking-wider uppercase">
                Nachrichten-Aggregator
              </span>
            </div>
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
