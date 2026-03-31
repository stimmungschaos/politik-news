import { useState } from "react";
import { Palette } from "lucide-react";
import THEMES, { getTheme, setTheme } from "../lib/themes";

export default function ThemeSwitcher() {
  const [current, setCurrent] = useState(getTheme);

  function handleSwitch(id) {
    setTheme(id);
    setCurrent(id);
  }

  return (
    <div className="px-4 py-3">
      <div className="flex items-center gap-2 mb-2">
        <Palette className="w-3.5 h-3.5" style={{ color: "var(--text-muted)" }} />
        <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "var(--text-muted)" }}>
          Theme
        </span>
      </div>
      <div className="flex gap-2">
        {Object.entries(THEMES).map(([id, theme]) => (
          <button
            key={id}
            onClick={() => handleSwitch(id)}
            className={`flex-1 text-xs py-1.5 px-2 rounded-lg border transition-colors ${
              current === id
                ? "border-[var(--accent)] text-[var(--accent)]"
                : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--text-muted)]"
            }`}
            style={current === id ? {
              backgroundColor: "var(--accent)",
              color: "white",
              borderColor: "var(--accent)",
            } : {
              backgroundColor: "var(--bg-card)",
              borderColor: "var(--border)",
              color: "var(--text-secondary)",
            }}
          >
            {theme.name}
          </button>
        ))}
      </div>
    </div>
  );
}
