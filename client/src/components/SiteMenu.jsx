import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Menu, X, Layers, BarChart3, Bookmark, BookOpen, Quote,
  Calendar, Home, Newspaper, Rss,
} from "lucide-react";
import CATEGORIES from "../lib/categories";
import ThemeSwitcher from "./ThemeSwitcher";

export default function SiteMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Schließen wenn man außerhalb klickt
  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Schließen bei Escape
  useEffect(() => {
    if (!open) return;
    function handleKey(e) { if (e.key === "Escape") setOpen(false); }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
        aria-label="Menü"
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl shadow-black/50 z-[100] overflow-hidden">
          {/* Kategorien — nur auf Mobile, Desktop hat die Nav-Leiste */}
          <div className="md:hidden">
            <div className="px-4 pt-3 pb-1">
              <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Kategorien</span>
            </div>
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-gray-200 hover:bg-gray-800 transition-colors"
            >
              <Home className="w-4 h-4 text-red-400" />
              <span className="text-sm">Startseite</span>
            </Link>
            {CATEGORIES.map(({ name, icon: Icon, color }) => (
              <Link
                key={name}
                to={`/kategorie/${encodeURIComponent(name)}`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-gray-200 hover:bg-gray-800 transition-colors"
              >
                <Icon className={`w-4 h-4 ${color}`} />
                <span className="text-sm">{name}</span>
              </Link>
            ))}
            <div className="border-t border-gray-800 my-1" />
          </div>

          {/* Features — immer sichtbar */}
          <div className="px-4 pt-3 pb-1">
            <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Features</span>
          </div>
          <MenuLink to="/stories" icon={Layers} color="text-blue-400" label="Story-Vergleich" onClick={() => setOpen(false)} />
          <MenuLink to="/dashboard" icon={BarChart3} color="text-green-400" label="Dashboard" onClick={() => setOpen(false)} />
          <MenuLink to="/lesezeichen" icon={Bookmark} color="text-yellow-400" label="Merkliste" onClick={() => setOpen(false)} />
          <MenuLink to="/quellen" icon={Rss} color="text-cyan-400" label="Quellen verwalten" onClick={() => setOpen(false)} />

          <div className="border-t border-gray-800 my-1" />

          {/* Bewegung */}
          <div className="px-4 pt-3 pb-1">
            <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Bewegung</span>
          </div>
          <MenuLink to="/theorie" icon={BookOpen} color="text-red-400" label="Theorie-Ecke" onClick={() => setOpen(false)} />
          <MenuLink to="/zitate" icon={Quote} color="text-orange-400" label="Zitate" onClick={() => setOpen(false)} />
          <MenuLink to="/geschichte" icon={Calendar} color="text-purple-400" label="Geschichte" onClick={() => setOpen(false)} />

          {/* Theme-Auswahl */}
          <div className="border-t border-gray-800 mt-1">
            <ThemeSwitcher />
          </div>

          {/* Footer */}
          <div className="border-t border-gray-800 px-4 py-3 text-center text-[10px] text-gray-600">
            ★ Deine linke Nachrichtenseite ★
          </div>
        </div>
      )}
    </div>
  );
}

function MenuLink({ to, icon: Icon, color, label, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2.5 text-gray-200 hover:bg-gray-800 transition-colors"
    >
      <Icon className={`w-4 h-4 ${color}`} />
      <span className="text-sm">{label}</span>
    </Link>
  );
}
