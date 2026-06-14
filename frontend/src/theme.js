// ═══════════════════════════════════════
// ABM AI — Theme System
// Future mein naye themes yahan add honge
// ═══════════════════════════════════════

// Theme 1: Default (Red + Gold) — current
const emberTheme = {
  name: "ember",
  bg: "#0a0a0b",
  bgSoft: "#131316",
  surface: "#17171b",
  line: "#2a2a31",
  lineSoft: "#1f1f25",
  text: "#f2f2f4",
  textDim: "#9a9aa6",
  textFaint: "#62626e",
  primary: "#c70505", // red (tha: red)
  primaryDeep: "#bb0e0e",
  accent: "#ffc83d", // gold (tha: yellow)
  accentDeep: "#e0a418",
  mono: '"IBM Plex Mono", ui-monospace, monospace',
  sora: '"Sora", sans-serif',
  inter: '"Inter", system-ui, sans-serif',
};

// Future themes yahan add karo:
// const oceanTheme = { name: "ocean", primary: "#0a84ff", ... }
// const forestTheme = { name: "forest", primary: "#34c759", ... }

// All themes registry
export const themes = {
  ember: emberTheme,
  // ocean: oceanTheme,
  // forest: forestTheme,
};

// Active theme — abhi ember, future mein switch hoga
export const theme = themes.ember;
