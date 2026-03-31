/**
 * Dekorativer Trenner zwischen Sektionen.
 * Zeigt einen Titel mit politischem Akzent-Icon links und rechts.
 *
 * Props:
 *   title — Text in der Mitte (z.B. "Aktuelle Nachrichten")
 *   icon  — Lucide Icon-Komponente (optional)
 */
export default function SectionDivider({ title, icon: Icon }) {
  return (
    <div className="flex items-center gap-4 my-8">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
      {Icon && (
        <Icon className="w-4 h-4 text-red-500/60" />
      )}
      <span className="text-xs uppercase tracking-[0.2em] text-gray-500 font-medium whitespace-nowrap">
        {title}
      </span>
      {Icon && (
        <Icon className="w-4 h-4 text-red-500/60" />
      )}
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
    </div>
  );
}
