/**
 * How far the visitor has scrolled through the opening sequence, shared by the
 * overlay (which reads the wheel, touch and keys) and the 3D (which glides
 * after it on every frame). A plain mutable object, like lib/story.ts:
 * 0 is the world, 1 is the page fully open.
 */
export const journey = {
  /** Where the visitor's scrolling has asked to be. */
  target: 0,
  /** Where the flight is, easing after the target. */
  current: 0,
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

/** Back to the world, for a fresh start. */
export function resetJourney() {
  journey.target = 0;
  journey.current = 0;
}

/** Moves the target by a share of the whole journey; negative goes back. */
export function nudgeJourney(share: number) {
  journey.target = clamp01(journey.target + share);
}

/** Sends the flight the rest of the way. */
export function finishJourney() {
  journey.target = 1;
}

/**
 * Eases the flight towards the target for one frame lasting `delta` seconds,
 * the same at any frame rate, and returns where it is.
 */
export function glide(delta: number): number {
  const gap = journey.target - journey.current;
  if (Math.abs(gap) < 0.0004) journey.current = journey.target;
  else journey.current += gap * (1 - Math.exp(-4.5 * Math.min(delta, 0.1)));
  return journey.current;
}
