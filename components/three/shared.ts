import { Color, MeshPhysicalMaterial } from "three";

/** Reads a colour token from the page, so the 3D follows the active theme. */
export function cssColor(name: string, fallback: string): Color {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const color = new Color();
  try {
    color.setStyle(value || fallback);
  } catch {
    color.setStyle(fallback);
  }
  return color;
}

export function cssNumber(name: string, fallback: number): number {
  const value = parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name));
  return Number.isFinite(value) ? value : fallback;
}

/** Reads a font-family token such as --font-instrument, for drawing text on canvas. */
export function cssFont(name: string, fallback: string): string {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

/**
 * Satin metal, bead-blasted like a premium phone frame: it catches the light
 * in broad soft bands instead of mirror reflections. Tinted by the theme.
 * Every metal zero on the page uses it, and so does the closing figure.
 */
export function createSatinMaterial(): MeshPhysicalMaterial {
  const material = new MeshPhysicalMaterial({
    metalness: 1,
    roughness: 0.38,
    anisotropy: 0.3,
  });
  applySatinTheme(material);
  return material;
}

export function applySatinTheme(material: MeshPhysicalMaterial): void {
  material.color.copy(cssColor("--metal", "#c8c5d3"));
  material.envMapIntensity = cssNumber("--metal-env", 1);
  material.needsUpdate = true;
}

/** The matte finishes, one colour token each, so they follow the theme. */
export const MATTE_TOKENS = {
  bone: ["--matte-bone", "#d9d4ca"],
  dusk: ["--matte-dusk", "#8a80c9"],
  slate: ["--matte-slate", "#6d7a9c"],
  graphite: ["--matte-graphite", "#3a3a40"],
} as const;

export type MatteFinish = keyof typeof MATTE_TOKENS;

/**
 * Soft-touch matte, like a ceramic or a rubberised finish: no clearcoat and no
 * sharp highlight, only a faint sheen where the surface turns away from you.
 */
export function createMatteMaterial(finish: MatteFinish): MeshPhysicalMaterial {
  const material = new MeshPhysicalMaterial({
    roughness: 0.64,
    metalness: 0,
    sheen: 0.45,
    sheenRoughness: 0.8,
  });
  applyMatteTheme(material, finish);
  return material;
}

export function applyMatteTheme(material: MeshPhysicalMaterial, finish: MatteFinish): void {
  const [token, fallback] = MATTE_TOKENS[finish];
  material.color.copy(cssColor(token, fallback));
  material.sheenColor.copy(material.color).lerp(new Color("#ffffff"), 0.55);
  material.needsUpdate = true;
}

/** Calls `onChange` whenever the colour theme changes, from either source. */
export function watchTheme(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  const mql = window.matchMedia("(prefers-color-scheme: dark)");
  mql.addEventListener("change", onChange);
  return () => {
    observer.disconnect();
    mql.removeEventListener("change", onChange);
  };
}

/** Exponential ease-out, the curve used across the site. */
export function easeOutExpo(t: number): number {
  return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

/** Checks for WebGL without keeping a context alive. */
export function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    const ok = Boolean(gl);
    (gl as WebGLRenderingContext | null)?.getExtension("WEBGL_lose_context")?.loseContext();
    return ok;
  } catch {
    return false;
  }
}
