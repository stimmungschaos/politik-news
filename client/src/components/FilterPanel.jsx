export default function FilterPanel({ sources, categories, filters, onChange }) {
  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <select
        value={filters.source || ""}
        onChange={(e) => onChange({ ...filters, source: e.target.value || null })}
        className="bg-gray-800 border border-gray-600 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-red-500"
      >
        <option value="">Alle Quellen</option>
        {sources.map((s) => (
          <option key={s.name} value={s.name}>
            {s.name}
          </option>
        ))}
      </select>

      <select
        value={filters.category || ""}
        onChange={(e) => onChange({ ...filters, category: e.target.value || null })}
        className="bg-gray-800 border border-gray-600 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-red-500"
      >
        <option value="">Alle Kategorien</option>
        {categories.map((c) => (
          <option key={c.name} value={c.name}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}
