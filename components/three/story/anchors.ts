import type { StageId } from "@/lib/story";

/** A rectangle in CSS pixels, relative to the viewport. */
export type Box = { x: number; y: number; width: number; height: number };

type Measured = { el: HTMLElement; left: number; top: number; width: number; height: number };

/*
 * Slots are measured against the document, then placed each frame from the
 * scroll position alone. Reading layout inside the render loop, after the
 * scroll code has written styles in the same frame, would force a full layout
 * on every frame and make scrolling stutter; this never touches layout per
 * frame. Measurements are redone only when the layout can have changed: on
 * resize, when fonts arrive, and when the page changes size. Offsets ignore
 * transforms, so entrance animations never skew a measurement.
 */
const cache = new Map<string, Measured | null>();
let watching = false;

function measure(name: string): Measured | null {
  const el = document.querySelector<HTMLElement>(`[data-anchor="${name}"]`);
  if (!el || (el.offsetWidth === 0 && el.offsetHeight === 0)) return null;
  let left = 0;
  let top = 0;
  for (let node: HTMLElement | null = el; node; node = node.offsetParent as HTMLElement | null) {
    left += node.offsetLeft;
    top += node.offsetTop;
  }
  return { el, left, top, width: el.offsetWidth, height: el.offsetHeight };
}

/** Forgets every measurement; slots are measured again the next time they are needed. */
export function refreshAnchors() {
  cache.clear();
}

function watch() {
  if (watching) return;
  watching = true;
  new ResizeObserver(refreshAnchors).observe(document.body);
  document.fonts?.ready.then(refreshAnchors);
}

/** Where a slot is on screen right now, or null if it is missing or hidden. */
export function anchorBox(name: string): Box | null {
  watch();
  let m = cache.get(name);
  if (m === undefined || (m && !m.el.isConnected)) {
    m = measure(name);
    cache.set(name, m);
  }
  if (!m) return null;
  return { x: m.left - window.scrollX, y: m.top - window.scrollY, width: m.width, height: m.height };
}

/** Where the phone sits in each part of the story. Stages without one send it off to the side. */
export const PHONE_ANCHOR: Partial<Record<StageId, string[]>> = {
  hero: ["phone-hero"],
  manifesto: ["phone-manifesto"],
  // The work section has one slot per layout; whichever is showing wins.
  work: ["phone-work", "phone-work-narrow"],
  contact: ["phone-contact"],
};

/** The first of the named slots that is laid out and visible. */
export function firstAnchorBox(names: string[] | undefined): Box | null {
  if (!names) return null;
  for (const name of names) {
    const box = anchorBox(name);
    if (box) return box;
  }
  return null;
}

/** Resting angle of the phone in each part of the story, in radians. */
export const PHONE_POSE: Record<StageId, [number, number, number]> = {
  hero: [0.12, -0.62, 0.16],
  manifesto: [-0.06, -0.34, 0.05],
  work: [0.02, -0.2, 0],
  services: [0.7, -1.3, 0.5],
  approach: [-0.5, -2.2, -0.3],
  founder: [0.3, -0.9, 0.2],
  contact: [0.04, -0.42, -0.06],
};

/**
 * Where the orrery goes in each part of the story: around a slot in the page
 * (halo), around the phone (orbit), or large and far back (field).
 */
export type OrbitMode = "halo" | "orbit" | "field";

export const ORBIT_MODE: Record<StageId, OrbitMode> = {
  hero: "halo",
  manifesto: "orbit",
  work: "orbit",
  services: "field",
  approach: "field",
  founder: "halo",
  contact: "orbit",
};

/** The slot the orrery circles in halo mode. */
export const ORBIT_ANCHOR: Partial<Record<StageId, string>> = {
  hero: "halo",
  founder: "founder-frame",
};
