import type Lenis from "lenis";

let instance: Lenis | null = null;

/** The smooth-scroll controller, when it is running (mouse devices only). */
export function getLenis(): Lenis | null {
  return instance;
}

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}
