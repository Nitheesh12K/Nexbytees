export type Theme = "dark" | "light";

const THEME_STORAGE_KEY = "nexbytees_theme";

export function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme;
    return stored === "light" ? "light" : "dark";
  } catch (err) {
    return "dark";
  }
}

export function applyTheme(theme: Theme): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.remove("dark");
      root.classList.add("light");
    } else {
      root.classList.remove("light");
      root.classList.add("dark");
    }
  } catch (err) {
    console.error("Failed to apply theme", err);
  }
}
