export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "crorepreneur-theme";

/**
 * Runs in <head> before first paint. With no stored choice it does nothing,
 * and the CSS follows the system setting through prefers-color-scheme.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

export function readStoredTheme(): Theme | null {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : null;
  } catch {
    return null;
  }
}

export function resolveTheme(): Theme {
  const attr = document.documentElement.getAttribute("data-theme");
  if (attr === "light" || attr === "dark") return attr;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyTheme(theme: Theme, persist = true): void {
  const root = document.documentElement;
  // A short, quiet cross-fade between palettes. Removed again once it has run.
  root.classList.add("theme-switching");
  root.setAttribute("data-theme", theme);
  window.setTimeout(() => root.classList.remove("theme-switching"), 450);
  if (!persist) return;
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage can be unavailable (private windows, blocked site data). The
    // choice still applies for this visit.
  }
}
