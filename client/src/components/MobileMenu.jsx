import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Layers, BarChart3, Bookmark, BookOpen, Home, Quote, Calendar } from "lucide-react";
import CATEGORIES from "../lib/categories";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-2 text-gray-300 hover:text-white transition-colors md:hidden"
        aria-label="Menü öffnen"
      >
        <Menu className="w-6 h-6" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] bg-gray-950/95 backdrop-blur-sm md:hidden">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-800">
              <span className="text-xl font-bold text-white">
                Politik <span className="text-red-500">News</span>
              </span>
              <button
                onClick={() => setOpen(false)}
                className="p-2 text-gray-300 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
              <Link
                to="/"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-gray-200 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Home className="w-5 h-5 text-red-400" />
                Startseite
              </Link>

              <div className="pt-3 pb-1 px-4">
                <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Kategorien</span>
              </div>
              {CATEGORIES.map(({ name, icon: Icon, color }) => (
                <Link
                  key={name}
                  to={`/kategorie/${encodeURIComponent(name)}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-200 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <Icon className={`w-5 h-5 ${color}`} />
                  {name}
                </Link>
              ))}

              <div className="pt-3 pb-1 px-4">
                <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Features</span>
              </div>
              <Link
                to="/stories"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-gray-200 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Layers className="w-5 h-5 text-blue-400" />
                Story-Vergleich
              </Link>
              <Link
                to="/dashboard"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-gray-200 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <BarChart3 className="w-5 h-5 text-green-400" />
                Dashboard
              </Link>
              <Link
                to="/lesezeichen"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-gray-200 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Bookmark className="w-5 h-5 text-yellow-400" />
                Merkliste
              </Link>
              <Link
                to="/theorie"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-gray-200 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <BookOpen className="w-5 h-5 text-red-400" />
                Theorie-Ecke
              </Link>

              <div className="pt-3 pb-1 px-4">
                <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Bewegung</span>
              </div>
              <Link
                to="/zitate"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-gray-200 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Quote className="w-5 h-5 text-orange-400" />
                Zitate
              </Link>
              <Link
                to="/geschichte"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-gray-200 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Calendar className="w-5 h-5 text-purple-400" />
                Geschichte
              </Link>
            </nav>

            <div className="px-4 py-4 border-t border-gray-800 text-center text-xs text-gray-600">
              ★ Deine linke Nachrichtenseite ★
            </div>
          </div>
        </div>
      )}
    </>
  );
}
