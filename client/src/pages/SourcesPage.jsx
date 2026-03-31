import { useEffect, useState } from "react";
import { Rss, Plus, Trash2, ExternalLink } from "lucide-react";
import { fetchSources, addSource, deleteSource } from "../lib/api";

export default function SourcesPage() {
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", url: "", categories: "Innenpolitik" });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSources().then((data) => {
      setSources(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.url.trim()) {
      setError("Name und URL sind Pflichtfelder.");
      return;
    }
    const cats = form.categories.split(",").map((c) => c.trim()).filter(Boolean);
    const result = await addSource({ name: form.name.trim(), url: form.url.trim(), categories: cats });
    if (result.error) {
      setError(result.error === "source already exists" ? "Diese Quelle existiert bereits." : "Fehler beim Hinzufügen.");
    } else {
      setSources(result.sources.map((s) => ({ ...s, categories: typeof s.categories === "string" ? JSON.parse(s.categories) : s.categories })));
      setForm({ name: "", url: "", categories: "Innenpolitik" });
      setShowForm(false);
    }
  }

  async function handleDelete(name) {
    const result = await deleteSource(name);
    if (result.sources) {
      setSources(result.sources.map((s) => ({ ...s, categories: typeof s.categories === "string" ? JSON.parse(s.categories) : s.categories })));
    }
  }

  if (loading) return <p className="text-center mt-12" style={{ color: "var(--text-secondary)" }}>Quellen laden...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Rss className="w-8 h-8 text-red-400" />
          <h1 className="text-2xl font-bold text-white">Quellen verwalten</h1>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Quelle hinzufügen
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-gray-800/50 rounded-xl border border-gray-700 p-5 mb-6 space-y-4">
          <div>
            <label className="text-sm text-gray-400 block mb-1">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="z.B. Tagesschau"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-red-500"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-1">RSS-Feed URL</label>
            <input
              type="url"
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              placeholder="https://example.com/rss"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-red-500"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-1">Kategorien (kommagetrennt)</label>
            <input
              type="text"
              value={form.categories}
              onChange={(e) => setForm({ ...form, categories: e.target.value })}
              placeholder="Innenpolitik, Gesellschaft"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-red-500"
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div className="flex gap-3">
            <button type="submit" className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors">
              Hinzufügen
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors">
              Abbrechen
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {sources.map((source) => (
          <div key={source.name} className="bg-gray-800/50 rounded-xl border border-gray-700 px-5 py-4 flex items-center justify-between">
            <div>
              <h3 className="text-white font-semibold">{source.name}</h3>
              <p className="text-gray-500 text-xs mt-1 truncate max-w-md">{source.url}</p>
              <div className="flex gap-1.5 mt-2">
                {(Array.isArray(source.categories) ? source.categories : []).map((cat) => (
                  <span key={cat} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-700 text-gray-300">
                    {cat}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={() => handleDelete(source.name)}
              className="p-2 text-gray-500 hover:text-red-400 transition-colors"
              title="Quelle entfernen"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
