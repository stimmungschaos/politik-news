import { Newspaper, Github, Heart } from "lucide-react";
import CATEGORIES from "../lib/categories";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-800">
      {/* Deko-Linie oben */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-red-600/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo + Beschreibung */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-red-600 p-1.5 rounded-lg">
                <Newspaper className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">
                Politik <span className="text-red-500">News</span>
              </span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Unabhängiger Nachrichtenüberblick aus deutschen Qualitätsmedien.
              Automatisch aggregiert und zusammengefasst.
            </p>
          </div>

          {/* Kategorien */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">
              Kategorien
            </h3>
            <ul className="space-y-1.5">
              {CATEGORIES.map(({ name, icon: Icon, color }) => (
                <li key={name}>
                  <Link
                    to={`/kategorie/${encodeURIComponent(name)}`}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors"
                  >
                    <Icon className={`w-3.5 h-3.5 ${color}`} />
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info / Platzhalter für eigene Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">
              Info
            </h3>
            <ul className="space-y-1.5 text-sm text-gray-500">
              {/* === PLATZHALTER: Füge hier eigene Links hinzu === */}
              <li className="flex items-center gap-2">
                <Github className="w-3.5 h-3.5" />
                <a
                  href="https://github.com/stimmungschaos/politik-news"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  GitHub Repository
                </a>
              </li>
              {/* Platzhalter 1: z.B. Impressum, About, Kontakt */}
              {/* <li>
                <a href="/about" className="hover:text-white transition-colors">
                  Über uns
                </a>
              </li> */}
            </ul>
          </div>
        </div>

        {/* Untere Leiste */}
        <div className="mt-8 pt-6 border-t border-gray-800/50 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">
            Alle Artikel gehören ihren jeweiligen Quellen. Politik News aggregiert und verlinkt nur.
          </p>
          <p className="flex items-center gap-1 text-xs text-gray-600">
            Gebaut mit <Heart className="w-3 h-3 text-red-500" /> und Open Source
          </p>
        </div>
      </div>
    </footer>
  );
}
