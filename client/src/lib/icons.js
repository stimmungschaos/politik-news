/**
 * === ICON-KONFIGURATION ===
 *
 * Hier sind ALLE Icons der Seite an einem Ort.
 * Du kannst jedes Icon austauschen — such dir eins aus unter:
 * https://lucide.dev/icons (alle verfügbaren Icons)
 *
 * Einfach den Import oben anpassen und unten den Namen ersetzen.
 */

import {
  // === Header-Akzentleiste Icons ===
  // Diese erscheinen ganz oben in der dünnen Leiste
  Flame,        // Platzhalter 1 — z.B. Faust, Stern, Herz...
  Shield,       // Platzhalter 2 — z.B. Sword, Flag, Award...
  Vote,         // Platzhalter 3 — z.B. Building, Gavel, BookOpen...
  Scale,        // Platzhalter 4 — z.B. HandHelping, Handshake...
  Megaphone,    // Platzhalter 5 — z.B. Radio, Podcast, Volume2...
  Rss,          // Platzhalter 6 — z.B. Wifi, Signal, Bell...

  // === Kategorie-Icons ===
  // Diese erscheinen in der Navigationsleiste und auf den Artikel-Badges
  Landmark,     // Innenpolitik  — z.B. Building2, Castle, Gavel...
  Globe,        // Außenpolitik  — z.B. Earth, Map, Plane...
  TrendingUp,   // Wirtschaft    — z.B. BarChart3, DollarSign, Wallet...
  Leaf,         // Klima & Umwelt — z.B. TreePine, Sprout, Sun...
  Users,        // Gesellschaft  — z.B. Heart, Home, GraduationCap...
  Cpu,          // Technologie   — z.B. Monitor, Smartphone, Wifi...
} from "lucide-react";

// ─────────────────────────────────────────────
// HEADER-AKZENTLEISTE
// Tausch hier die Icons aus wie du willst.
// Format: { icon: LucideIconName }
// ─────────────────────────────────────────────
export const HEADER_ACCENT_ICONS = [
  { icon: Flame },
  { icon: Shield },
  { icon: Vote },
  { icon: Scale },
  { icon: Megaphone },
  { icon: Rss },
];

// ─────────────────────────────────────────────
// KATEGORIEN
// Tausch Icon, Farbe oder Name aus.
// Farben: text-red-400, text-blue-400, text-yellow-400,
//         text-green-400, text-purple-400, text-cyan-400,
//         text-orange-400, text-pink-400, text-indigo-400...
// ─────────────────────────────────────────────
export const CATEGORIES = [
  { name: "Innenpolitik", icon: Landmark, color: "text-red-400", bg: "bg-red-400/10" },
  { name: "Außenpolitik", icon: Globe, color: "text-blue-400", bg: "bg-blue-400/10" },
  { name: "Wirtschaft", icon: TrendingUp, color: "text-yellow-400", bg: "bg-yellow-400/10" },
  { name: "Klima & Umwelt", icon: Leaf, color: "text-green-400", bg: "bg-green-400/10" },
  { name: "Gesellschaft", icon: Users, color: "text-purple-400", bg: "bg-purple-400/10" },
  { name: "Technologie", icon: Cpu, color: "text-cyan-400", bg: "bg-cyan-400/10" },
];

export function getCategoryMeta(name) {
  return CATEGORIES.find((c) => c.name === name) || CATEGORIES[0];
}
