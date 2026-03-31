/**
 * === ICON-KONFIGURATION ===
 *
 * Alle Icons der Seite an einem Ort.
 * Verfügbare Lucide-Icons: https://lucide.dev/icons
 */

import {
  // === Header-Akzentleiste Icons ===
  Flame,
  Star,
  Megaphone,
  HandHelping,
  Handshake,
  BookOpen,
  Hammer,
  Heart,
  HandFist,
  Flag,

  // === Kategorie-Icons ===
  Landmark,
  Globe,
  TrendingUp,
  Leaf,
  Users,
  Cpu,
} from "lucide-react";

// ─────────────────────────────────────────────
// HEADER-AKZENTLEISTE
// ─────────────────────────────────────────────
export const HEADER_ACCENT_ICONS = [
  { icon: Star },
  { icon: Flame },
  { icon: Megaphone },
  { icon: Hammer },
  { icon: HandHelping },
  { icon: Handshake },
  { icon: BookOpen },
  { icon: Heart },
  { icon: Flag },
  { icon: HandFist },
];

// ─────────────────────────────────────────────
// HEADER-SLOGAN
// ─────────────────────────────────────────────
export const HEADER_SLOGAN = "DEINE LINKE NACHRICHTENSEITE";

// ─────────────────────────────────────────────
// FLAGGEN — antiimperialistisches Spektrum
//
// Typen:
//   "3stripe"     — 3 horizontale Streifen
//   "star"        — einfarbig mit Stern (z.B. Vietnam)
//   "palestine"   — 3 Streifen + Dreieck links
//   "cuba"        — Kuba (5 Streifen + Dreieck)
//   "dprk"        — Nordkorea (Streifen + roter Kreis)
//   "nicaragua"   — Nicaragua (3 Streifen)
//   "laos"        — Laos (3 Streifen + Kreis)
// ─────────────────────────────────────────────
export const FLAGS = [
  { name: "Kuba", type: "cuba" },
  { name: "Palästina", type: "palestine", colors: ["#000000", "#FFFFFF", "#007A3D", "#CE1126"] },
  { name: "Vietnam", type: "star", colors: ["#DA251D", "#FFCD00"] },
  { name: "Venezuela", type: "3stripe", colors: ["#FFCC00", "#00247D", "#CF142B"] },
  { name: "Nicaragua", type: "3stripe", colors: ["#0067C6", "#FFFFFF", "#0067C6"] },
  { name: "Laos", type: "laos" },
  { name: "China", type: "china" },
];

// ─────────────────────────────────────────────
// POLITISCHE SYMBOLE (SVG)
// Roter Stern, Hammer & Sichel etc.
// ─────────────────────────────────────────────
export const POLITICAL_SYMBOLS = [
  "red-star",];

// ─────────────────────────────────────────────
// KATEGORIEN
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
