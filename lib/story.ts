import { useSyncExternalStore } from "react";
import { work } from "@/content/site";

export type StageId = "hero" | "manifesto" | "work" | "services" | "approach" | "founder" | "contact";

/**
 * Shared state between the page and the 3D scene. The scene reads it on
 * every frame, so it is a plain mutable object rather than React state;
 * components that need to re-render subscribe through `useStory`.
 */
export const story = {
  /** The section in the middle of the screen. */
  stage: "hero" as StageId,
  /** The campaign selected in the work section. */
  project: work.projects[0].id as string,
  /** Views on the phone's reel: climbs from 100 to one crore as the page scrolls. */
  views: 100,
  /** Scroll speed in pixels per second. Makes the 3D tumble while scrolling. */
  velocity: 0,
  /** Mouse position across the window, each axis -0.5 to 0.5. */
  pointer: { x: 0, y: 0 },
  /** True once the 3D layer is drawing, so 2D stand-ins can step aside. */
  live: false,
};

type StoryPatch = Partial<Pick<typeof story, "stage" | "project" | "live">>;

const listeners = new Set<() => void>();

/** Updates fields that the page renders from, and tells subscribers. */
export function setStory(patch: StoryPatch) {
  let changed = false;
  for (const [key, value] of Object.entries(patch) as [keyof StoryPatch, never][]) {
    if (story[key] !== value) {
      (story as Record<string, unknown>)[key] = value;
      changed = true;
    }
  }
  if (changed) listeners.forEach((listener) => listener());
}

export function subscribeStory(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Re-renders when the selected field changes. */
export function useStory<K extends keyof StoryPatch>(key: K): (typeof story)[K] {
  return useSyncExternalStore(
    subscribeStory,
    () => story[key],
    () => story[key],
  );
}

/** Formats a whole number the Indian way: 1,00,00,000. */
export function formatIndian(value: number): string {
  return Math.round(value).toLocaleString("en-IN");
}

/** Short form for counters: 1.2 Cr, 34.5 L, 8,400. */
export function formatCompact(value: number): string {
  if (value >= 1e7) return `${(value / 1e7).toFixed(value >= 9.95e7 ? 0 : 1).replace(/\.0$/, "")} Cr`;
  if (value >= 1e5) return `${(value / 1e5).toFixed(1).replace(/\.0$/, "")} L`;
  return formatIndian(value);
}
