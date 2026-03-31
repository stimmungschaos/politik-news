const THEMES = {
  dark: {
    name: "Standard",
    vars: {
      "--bg-primary": "#030712",
      "--bg-secondary": "#111827",
      "--bg-card": "#1f2937",
      "--bg-hover": "#374151",
      "--border": "#374151",
      "--text-primary": "#ffffff",
      "--text-secondary": "#9ca3af",
      "--text-muted": "#6b7280",
      "--accent": "#dc2626",
      "--accent-hover": "#b91c1c",
    },
  },
  soviet: {
    name: "Sowjet-Rot",
    vars: {
      "--bg-primary": "#1a0000",
      "--bg-secondary": "#2d0a0a",
      "--bg-card": "#3d1111",
      "--bg-hover": "#4d1a1a",
      "--border": "#5c2020",
      "--text-primary": "#fef2f2",
      "--text-secondary": "#fca5a5",
      "--text-muted": "#b45454",
      "--accent": "#ff0000",
      "--accent-hover": "#cc0000",
    },
  },
  ddr: {
    name: "DDR-Retro",
    vars: {
      "--bg-primary": "#0a0f0a",
      "--bg-secondary": "#141f14",
      "--bg-card": "#1e2e1e",
      "--bg-hover": "#2a3d2a",
      "--border": "#3a4d3a",
      "--text-primary": "#e8f5e8",
      "--text-secondary": "#a3c9a3",
      "--text-muted": "#6b8f6b",
      "--accent": "#d4a017",
      "--accent-hover": "#b8860b",
    },
  },
};

export function getTheme() {
  return localStorage.getItem("politik-news-theme") || "dark";
}

export function setTheme(themeId) {
  localStorage.setItem("politik-news-theme", themeId);
  applyTheme(themeId);
}

export function applyTheme(themeId) {
  const theme = THEMES[themeId] || THEMES.dark;
  const root = document.documentElement;
  for (const [key, value] of Object.entries(theme.vars)) {
    root.style.setProperty(key, value);
  }
}

export default THEMES;
