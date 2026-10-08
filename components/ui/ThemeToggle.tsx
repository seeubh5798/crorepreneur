"use client";

import { useId, useLayoutEffect, useSyncExternalStore } from "react";
import { applyTheme, readStoredTheme, resolveTheme, type Theme } from "@/lib/theme";
import { cn } from "@/lib/cn";

/** Subscribes to anything that can change the active theme. */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  const mql = window.matchMedia("(prefers-color-scheme: dark)");
  mql.addEventListener("change", onChange);
  return () => {
    observer.disconnect();
    mql.removeEventListener("change", onChange);
  };
}

const RAYS = Array.from({ length: 8 }, (_, i) => i * 45);

/**
 * Sun in light, crescent in dark. The drawing is driven entirely by CSS
 * tokens, so it is correct on first paint with no script and never flashes.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const maskId = useId();
  const theme = useSyncExternalStore<Theme | null>(subscribe, resolveTheme, () => null);

  // In development, React's strict-mode remount can clear attributes that the
  // head script set on <html>. Putting the stored choice back is a no-op in
  // production.
  useLayoutEffect(() => {
    const stored = readStoredTheme();
    if (stored && document.documentElement.getAttribute("data-theme") !== stored) {
      document.documentElement.setAttribute("data-theme", stored);
    }
  }, []);

  const next: Theme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => applyTheme(resolveTheme() === "dark" ? "light" : "dark")}
      aria-label={theme ? `Switch to ${next} theme` : "Switch colour theme"}
      title={theme ? `Switch to ${next} theme` : undefined}
      className={cn(
        "grid size-10 place-items-center rounded-full text-fg-2",
        "transition-colors duration-300 hover:bg-surface hover:text-fg",
        className,
      )}
    >
      <svg
        aria-hidden="true"
        className="tt-icon"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      >
        <mask id={maskId} maskUnits="userSpaceOnUse" x="-4" y="-4" width="32" height="32">
          <rect x="-4" y="-4" width="32" height="32" fill="white" />
          <circle className="tt-cut" cx="16.6" cy="8.2" r="6.4" fill="black" stroke="none" />
        </mask>
        <g mask={`url(#${maskId})`}>
          <circle className="tt-core" cx="12" cy="12" r="4.3" fill="currentColor" stroke="none" />
        </g>
        <g className="tt-rays">
          {RAYS.map((angle) => (
            <line key={angle} x1="12" y1="2.6" x2="12" y2="4.6" transform={`rotate(${angle} 12 12)`} />
          ))}
        </g>
      </svg>
    </button>
  );
}
