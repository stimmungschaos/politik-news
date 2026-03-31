import { Landmark, Globe, TrendingUp, Leaf, Users, Cpu } from "lucide-react";

const CATEGORIES = [
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

export default CATEGORIES;
