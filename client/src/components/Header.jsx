import { Link, useNavigate } from "react-router-dom";
import { Search, Newspaper, Layers, BarChart3, Bookmark as BookmarkIcon, RefreshCw } from "lucide-react";
import { useState } from "react";
import CATEGORIES from "../lib/categories";
import { HEADER_ACCENT_ICONS, HEADER_SLOGAN, FLAGS, POLITICAL_SYMBOLS } from "../lib/icons";
import { refreshFeeds } from "../lib/api";

/* ── Roter Stern (SVG) ── */
function RedStar({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className="shrink-0">
      <polygon
        points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
        fill="#DC2626"
        stroke="#991B1B"
        strokeWidth="0.5"
      />
    </svg>
  );
}

/* ── Hammer & Sichel (SVG) ── */
function HammerSickle({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="shrink-0">
      {/* Sichel */}
      <path
        d="M55,15 C35,15 20,30 20,50 C20,70 35,85 55,85 C45,85 35,73 35,58 C35,43 45,32 55,32 C50,28 48,22 55,15 Z"
        fill="#DC2626"
      />
      {/* Hammer-Stiel */}
      <rect x="52" y="30" width="4" height="45" rx="1" fill="#DC2626" transform="rotate(25, 54, 52)" />
      {/* Hammer-Kopf */}
      <rect x="42" y="22" width="22" height="10" rx="2" fill="#DC2626" transform="rotate(25, 54, 27)" />
    </svg>
  );
}

/* ── Mini-Flaggen als SVG ── */
function MiniFlag({ flag }) {
  const w = 18, h = 12;

  if (flag.type === "cuba") {
    return (
      <svg width={w} height={h} viewBox="0 0 18 12" className="rounded-[2px] shrink-0" aria-label="Kuba">
        <rect y="0" width="18" height="2.4" fill="#002590" />
        <rect y="2.4" width="18" height="2.4" fill="#FFFFFF" />
        <rect y="4.8" width="18" height="2.4" fill="#002590" />
        <rect y="7.2" width="18" height="2.4" fill="#FFFFFF" />
        <rect y="9.6" width="18" height="2.4" fill="#002590" />
        <polygon points="0,0 8,6 0,12" fill="#CC0D2E" />
        <polygon points="3,4.5 3.6,5.8 5,5.8 3.9,6.7 4.3,8 3,7.1 1.7,8 2.1,6.7 1,5.8 2.4,5.8" fill="#FFFFFF" />
      </svg>
    );
  }

  if (flag.type === "palestine") {
    const [c1, c2, c3, c4] = flag.colors;
    return (
      <svg width={w} height={h} viewBox="0 0 18 12" className="rounded-[2px] shrink-0" aria-label="Palästina">
        <rect y="0" width="18" height="4" fill={c1} />
        <rect y="4" width="18" height="4" fill={c2} />
        <rect y="8" width="18" height="4" fill={c3} />
        <polygon points="0,0 7,6 0,12" fill={c4} />
      </svg>
    );
  }

  if (flag.type === "star") {
    return (
      <svg width={w} height={h} viewBox="0 0 18 12" className="rounded-[2px] shrink-0" aria-label={flag.name}>
        <rect width="18" height="12" fill={flag.colors[0]} />
        <polygon
          points="9,2 10.2,5 13.2,5 10.8,7 11.5,10 9,8.2 6.5,10 7.2,7 4.8,5 7.8,5"
          fill={flag.colors[1]}
        />
      </svg>
    );
  }

  if (flag.type === "dprk") {
    return (
      <svg width={w} height={h} viewBox="0 0 18 12" className="rounded-[2px] shrink-0" aria-label="DVRK">
        <rect y="0" width="18" height="1.5" fill="#024FA2" />
        <rect y="1.5" width="18" height="0.5" fill="#FFFFFF" />
        <rect y="2" width="18" height="8" fill="#ED1C27" />
        <rect y="10" width="18" height="0.5" fill="#FFFFFF" />
        <rect y="10.5" width="18" height="1.5" fill="#024FA2" />
        <circle cx="5.5" cy="6" r="2.8" fill="#FFFFFF" />
        <polygon
          points="5.5,3.5 6.1,5 7.7,5 6.4,6 6.8,7.5 5.5,6.5 4.2,7.5 4.6,6 3.3,5 4.9,5"
          fill="#ED1C27"
        />
      </svg>
    );
  }

  if (flag.type === "laos") {
    return (
      <svg width={w} height={h} viewBox="0 0 18 12" className="rounded-[2px] shrink-0" aria-label="Laos">
        <rect y="0" width="18" height="3" fill="#CE1126" />
        <rect y="3" width="18" height="6" fill="#002868" />
        <rect y="9" width="18" height="3" fill="#CE1126" />
        <circle cx="9" cy="6" r="2.2" fill="#FFFFFF" />
      </svg>
    );
  }

  if (flag.type === "china") {
    return (
      <svg width={w} height={h} viewBox="0 0 18 12" className="rounded-[2px] shrink-0" aria-label="China">
        <rect width="18" height="12" fill="#DE2910" />
        <polygon points="3,1.5 3.7,3.5 5.8,3.5 4.1,4.8 4.7,6.8 3,5.5 1.3,6.8 1.9,4.8 0.2,3.5 2.3,3.5" fill="#FFDE00" />
        <polygon points="7,0.8 7.3,1.5 8,1.5 7.4,2 7.6,2.7 7,2.2 6.4,2.7 6.6,2 6,1.5 6.7,1.5" fill="#FFDE00" />
        <polygon points="8.5,2.3 8.8,3 9.5,3 8.9,3.5 9.1,4.2 8.5,3.7 7.9,4.2 8.1,3.5 7.5,3 8.2,3" fill="#FFDE00" />
        <polygon points="8.5,4.5 8.8,5.2 9.5,5.2 8.9,5.7 9.1,6.4 8.5,5.9 7.9,6.4 8.1,5.7 7.5,5.2 8.2,5.2" fill="#FFDE00" />
        <polygon points="7,6.2 7.3,6.9 8,6.9 7.4,7.4 7.6,8.1 7,7.6 6.4,8.1 6.6,7.4 6,6.9 6.7,6.9" fill="#FFDE00" />
      </svg>
    );
  }

  // Fallback: 3 horizontale Streifen
  const colors = flag.colors || ["#ccc", "#999", "#666"];
  const sh = h / colors.length;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="rounded-[2px] shrink-0" aria-label={flag.name}>
      {colors.map((c, i) => (
        <rect key={i} y={i * sh} width={w} height={sh} fill={c} />
      ))}
    </svg>
  );
}

export default function Header() {
  const [query, setQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [refreshResult, setRefreshResult] = useState(null);
  const navigate = useNavigate();

  async function handleRefresh() {
    if (refreshing) return;
    setRefreshing(true);
    setRefreshResult(null);
    const result = await refreshFeeds();
    setRefreshing(false);
    if (result.status === "ok") {
      setRefreshResult(`+${result.newArticles} neue Artikel`);
      setTimeout(() => {
        setRefreshResult(null);
        window.location.reload();
      }, 1500);
    } else if (result.status === "already_running") {
      setRefreshResult("Läuft bereits...");
      setTimeout(() => setRefreshResult(null), 2000);
    } else {
      setRefreshResult("Fehler!");
      setTimeout(() => setRefreshResult(null), 2000);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/suche?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
    }
  }

  return (
    <header className="bg-gray-900 border-b border-gray-700 sticky top-0 z-50">
      {/* Top accent bar — Symbole, Flaggen, Slogan */}
      <div className="bg-gradient-to-r from-red-900/50 via-gray-900 to-red-900/50 px-4 py-1.5">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2.5 md:gap-3.5 flex-wrap">
          {/* Politische Symbole links */}
          {POLITICAL_SYMBOLS.includes("red-star") && <RedStar />}
          {POLITICAL_SYMBOLS.includes("hammer-sickle") && <HammerSickle />}

          {/* Icons links */}
          {HEADER_ACCENT_ICONS.slice(0, 2).map(({ icon: Icon }, i) => (
            <Icon key={`l${i}`} className="w-3.5 h-3.5 text-red-500/60 hidden sm:block" />
          ))}

          {/* Flaggen links */}
          {FLAGS.slice(0, 4).map((f) => (
            <MiniFlag key={f.name} flag={f} />
          ))}

          {/* Slogan */}
          <span className="text-[9px] md:text-[10px] uppercase tracking-[0.25em] text-red-400 font-bold whitespace-nowrap">
            ★ {HEADER_SLOGAN} ★
          </span>

          {/* Flaggen rechts */}
          {FLAGS.slice(4).map((f) => (
            <MiniFlag key={f.name} flag={f} />
          ))}

          {/* Icons rechts */}
          {HEADER_ACCENT_ICONS.slice(2, 4).map(({ icon: Icon }, i) => (
            <Icon key={`r${i}`} className="w-3.5 h-3.5 text-red-500/60 hidden sm:block" />
          ))}

          {/* Politische Symbole rechts */}
          {POLITICAL_SYMBOLS.includes("hammer-sickle") && <HammerSickle />}
          {POLITICAL_SYMBOLS.includes("red-star") && <RedStar />}
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

          {/* Reload Button */}
          <div className="relative shrink-0">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-1.5 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-300 hover:text-white hover:border-red-500 transition-colors text-sm disabled:opacity-50"
              title="Feeds neu laden"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
              <span className="hidden md:inline">{refreshing ? "Lädt..." : "Refresh"}</span>
            </button>
            {refreshResult && (
              <span className="absolute top-full right-0 mt-1 text-[10px] text-green-400 bg-gray-800 border border-gray-700 rounded px-2 py-0.5 whitespace-nowrap z-50">
                {refreshResult}
              </span>
            )}
          </div>
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
          <div className="w-px h-5 bg-gray-700 mx-1" />
          <Link
            to="/stories"
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors whitespace-nowrap"
          >
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            Vergleich
          </Link>
          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors whitespace-nowrap"
          >
            <BarChart3 className="w-3.5 h-3.5 text-green-400" />
            Dashboard
          </Link>
          <Link
            to="/lesezeichen"
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors whitespace-nowrap"
          >
            <BookmarkIcon className="w-3.5 h-3.5 text-yellow-400" />
            Merkliste
          </Link>
        </nav>
      </div>
    </header>
  );
}
