/**
 * === ICON-KONFIGURATION ===
 *
 * Alle Icons der Seite an einem Ort.
 * Verfügbare Icons: https://lucide.dev/icons
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
// Die Icons links und rechts vom Slogan
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
// SVG-FLAGGEN (inline, kein externer Dienst)
// Kleine Flaggen-Emojis als SVG für die Akzentleiste
// ─────────────────────────────────────────────
export const FLAGS = [
  { name: "Kuba", colors: ["#002590", "#CC0D2E", "#FFFFFF"] },
  { name: "Palästina", colors: ["#000000", "#FFFFFF", "#007A3D", "#CE1126"] },
  { name: "Vietnam", colors: ["#DA251D", "#FFCD00"] },
  { name: "Venezuela", colors: ["#FFCC00", "#00247D", "#CF142B"] },
  { name: "Bolivien", colors: ["#007934", "#FCE300", "#D52B1E"] },
  { name: "Rojava", colors: ["#007A3D", "#FFCD00", "#CE1126"] },
];

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
