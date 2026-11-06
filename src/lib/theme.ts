/**
 * The light and dark themes (docs/design.md, Theme). The page is light unless
 * the visitor chose dark; the admin is always dark. The choice lives in
 * localStorage under THEME_KEY, and a `themechange` event tells listeners (the
 * 3D panels) to re-read their colours.
 */
export type Theme = "light" | "dark";

export const THEME_KEY = "theme";
export const THEME_EVENT = "themechange";

/** The theme a page should open in, from the stored choice and the path. */
export function resolveTheme(stored: string | null, pathname: string): Theme {
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return "dark";
  return stored === "dark" ? "dark" : "light";
}

/**
 * The inline script for the root layout's <head>: runs before first paint and
 * sets data-theme on <html>, so there is never a flash of the wrong theme. It
 * mirrors resolveTheme and never throws (storage can be unavailable).
 */
export const THEME_SCRIPT = `(function(){var t=null;try{t=localStorage.getItem(${JSON.stringify(THEME_KEY)})}catch(e){}var p=location.pathname;var d=p==="/admin"||p.indexOf("/admin/")===0||t==="dark";document.documentElement.setAttribute("data-theme",d?"dark":"light")})()`;

/** Switches the theme, remembers it, and tells listeners. */
export function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Storage blocked: the choice lasts for this page only.
  }
  window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: { theme } }));
}

/** The theme currently on the page. */
export function currentTheme(): Theme {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}
