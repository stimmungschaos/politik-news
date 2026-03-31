import { Newspaper } from "lucide-react";

const SOURCE_META = {
  "Tagesschau": { abbr: "TS", color: "text-blue-300", bg: "bg-blue-500/20", border: "border-blue-500/30" },
  "Spiegel": { abbr: "SP", color: "text-orange-300", bg: "bg-orange-500/20", border: "border-orange-500/30" },
  "Zeit Online": { abbr: "ZO", color: "text-gray-200", bg: "bg-gray-500/20", border: "border-gray-400/30" },
  "taz": { abbr: "taz", color: "text-red-300", bg: "bg-red-500/20", border: "border-red-500/30" },
  "nd": { abbr: "nd", color: "text-rose-300", bg: "bg-rose-500/20", border: "border-rose-500/30" },
  "junge Welt": { abbr: "jW", color: "text-red-400", bg: "bg-red-600/20", border: "border-red-600/30" },
  "der Freitag": { abbr: "dF", color: "text-emerald-300", bg: "bg-emerald-500/20", border: "border-emerald-500/30" },
  "Jacobin": { abbr: "JA", color: "text-red-300", bg: "bg-red-700/20", border: "border-red-700/30" },
  "Telepolis": { abbr: "TP", color: "text-amber-300", bg: "bg-amber-500/20", border: "border-amber-500/30" },
  "Deutschlandfunk": { abbr: "DLF", color: "text-sky-300", bg: "bg-sky-500/20", border: "border-sky-500/30" },
  "Tagesspiegel": { abbr: "TSP", color: "text-teal-300", bg: "bg-teal-500/20", border: "border-teal-500/30" },
  "ZDF heute": { abbr: "ZDF", color: "text-orange-200", bg: "bg-orange-600/20", border: "border-orange-600/30" },
};

const DEFAULT_META = { abbr: "?", color: "text-gray-300", bg: "bg-gray-500/20", border: "border-gray-500/30" };

export function getSourceMeta(name) {
  return SOURCE_META[name] || DEFAULT_META;
}

export function SourceIcon() {
  return Newspaper;
}

export default SOURCE_META;
