import { Newspaper, TrendingUp, Radio, Zap } from "lucide-react";

/**
 * Dekoratives Hero-Banner mit politischer Skyline-Silhouette,
 * animierten Akzenten und Ticker-Leiste.
 *
 * Platzhalter-Bereiche sind mit Kommentaren markiert — du kannst
 * die SVGs und Texte nach Belieben austauschen.
 */
export default function HeroBanner() {
  return (
    <div className="relative overflow-hidden mb-8 rounded-2xl border border-gray-800">
      {/* === HINTERGRUND: Gradient + Muster === */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-red-950/20 to-gray-900" />

      {/* Punkte-Muster im Hintergrund (Deko) */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* === SKYLINE-SILHOUETTE (SVG) ===
          Hier kannst du die SVG-Pfade austauschen.
          Aktuell: stilisierte Gebäude-Skyline mit Reichstag-Kuppel */}
      <svg
        className="absolute bottom-0 left-0 right-0 w-full h-32 text-gray-800/30"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        fill="currentColor"
      >
        {/* Reichstag-ähnliches Gebäude links */}
        <path d="M0,120 L0,80 L40,80 L40,60 L60,60 L60,50 L80,40 L100,50 L100,60 L120,60 L120,80 L160,80 L160,120 Z" />
        {/* Hochhaus */}
        <path d="M200,120 L200,45 L220,45 L220,35 L240,35 L240,45 L260,45 L260,120 Z" />
        {/* Breites Parlamentsgebäude Mitte */}
        <path d="M350,120 L350,70 L380,70 L380,55 L400,55 L400,45 L430,30 L460,45 L460,55 L480,55 L480,70 L510,70 L510,120 Z" />
        {/* Kuppel */}
        <ellipse cx="430" cy="32" rx="20" ry="12" opacity="0.5" />
        {/* Fahne auf Kuppel */}
        <rect x="428" y="10" width="2" height="22" />
        <path d="M430,10 L445,15 L430,20 Z" className="text-red-800/40" fill="currentColor" />
        {/* Turm rechts */}
        <path d="M600,120 L600,55 L610,55 L610,25 L620,20 L630,25 L630,55 L640,55 L640,120 Z" />
        {/* Moderne Gebäude rechts */}
        <path d="M720,120 L720,50 L760,50 L760,65 L790,65 L790,40 L830,40 L830,120 Z" />
        {/* Wohnblöcke */}
        <path d="M900,120 L900,75 L950,75 L950,60 L980,60 L980,75 L1020,75 L1020,120 Z" />
        {/* Rechter Rand */}
        <path d="M1080,120 L1080,70 L1120,70 L1120,55 L1160,55 L1160,70 L1200,70 L1200,120 Z" />
      </svg>

      {/* === INHALT === */}
      <div className="relative z-10 px-6 py-8 md:py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Linke Seite: Titel + Beschreibung */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-red-600 p-2 rounded-xl shadow-lg shadow-red-600/20">
                <Newspaper className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                  Politik <span className="text-red-500">News</span>
                </h1>
              </div>
            </div>
            <p className="text-gray-400 text-sm md:text-base max-w-lg">
              Deine linke Nachrichtenseite — Artikel aus über 10 progressiven
              und unabhängigen Quellen, automatisch zusammengefasst.
            </p>
          </div>

          {/* Rechte Seite: Deko-Stats (Platzhalter — anpassbar) */}
          <div className="flex gap-4">
            <div className="bg-gray-800/60 backdrop-blur border border-gray-700/50 rounded-xl px-4 py-3 text-center">
              <TrendingUp className="w-5 h-5 text-red-400 mx-auto mb-1" />
              <span className="text-xs text-gray-400">Live</span>
            </div>
            <div className="bg-gray-800/60 backdrop-blur border border-gray-700/50 rounded-xl px-4 py-3 text-center">
              <Radio className="w-5 h-5 text-blue-400 mx-auto mb-1" />
              <span className="text-xs text-gray-400">11 Quellen</span>
            </div>
            <div className="bg-gray-800/60 backdrop-blur border border-gray-700/50 rounded-xl px-4 py-3 text-center">
              <Zap className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
              <span className="text-xs text-gray-400">Alle 5 Min</span>
            </div>
          </div>
        </div>
      </div>

      {/* === TICKER-LEISTE unten (Deko) === */}
      <div className="relative z-10 bg-red-900/20 border-t border-red-900/30 px-4 py-1.5">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0">
            Live
          </span>
          <div className="overflow-hidden">
            <p className="text-xs text-gray-400 whitespace-nowrap animate-marquee">
              Nachrichten werden alle 5 Minuten automatisch aktualisiert — Tagesschau • Spiegel • Zeit • taz • nd • junge Welt • der Freitag • Perspektive Online • Deutschlandfunk • Tagesspiegel • ZDF heute
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
