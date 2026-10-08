/*
 * The opening sequence: the world, then India, Jharkhand and Ranchi, and then
 * the page opens out of Ranchi, all moving as the visitor scrolls. It is there
 * every time the page loads (the first visit and every refresh), never for
 * visitors who prefer reduced motion. A small script in <head> decides before
 * the first paint, so the page never flashes underneath it. While the
 * sequence covers the page, <html> carries data-intro="playing"; while the
 * page is opening, "revealing"; once the page has taken over, "done".
 */

/** Fired when the page starts to open, so its own entrance can begin. */
export const INTRO_REVEAL_EVENT = "crorepreneur:intro-reveal";
/** Fired once the page is fully open and the sequence is gone. */
export const INTRO_END_EVENT = "crorepreneur:intro-end";

/**
 * Runs in <head> before first paint. Every load starts at the top, where the
 * sequence is. If its code has not started within a few seconds (slow or
 * failed script), it opens the page anyway.
 */
export const introInitScript = `(function(){try{var d=document.documentElement;if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;d.setAttribute("data-intro","playing");history.scrollRestoration="manual";setTimeout(function(){if(d.getAttribute("data-intro")==="playing"&&!window.__introStarted){d.setAttribute("data-intro","done");window.dispatchEvent(new Event("${INTRO_REVEAL_EVENT}"));window.dispatchEvent(new Event("${INTRO_END_EVENT}"))}},6000)}catch(e){}})()`;

function state(): string | null {
  return document.documentElement.getAttribute("data-intro");
}

/** True while the sequence covers the page (before it starts to open). */
export function introPlaying(): boolean {
  return state() === "playing";
}

/** True while the sequence is on screen: covering the page or opening it. */
export function introShowing(): boolean {
  const now = state();
  return now === "playing" || now === "revealing";
}

/** Calls `callback` once the page starts to open, or right away if there is no sequence. */
export function afterIntro(callback: () => void): () => void {
  if (!introPlaying()) {
    callback();
    return () => {};
  }
  window.addEventListener(INTRO_REVEAL_EVENT, callback, { once: true });
  return () => window.removeEventListener(INTRO_REVEAL_EVENT, callback);
}

/** Calls `callback` once the page is fully open, or right away if there is no sequence. */
export function afterIntroEnds(callback: () => void): () => void {
  const now = state();
  if (now === null || now === "done") {
    callback();
    return () => {};
  }
  window.addEventListener(INTRO_END_EVENT, callback, { once: true });
  return () => window.removeEventListener(INTRO_END_EVENT, callback);
}

/** Starts opening the page: its entrance plays as the sequence opens out of Ranchi. */
export function revealPage() {
  if (!introPlaying()) return;
  document.documentElement.setAttribute("data-intro", "revealing");
  window.dispatchEvent(new Event(INTRO_REVEAL_EVENT));
}

/** Covers the page again, when the visitor scrolls back before it is fully open. */
export function coverPage() {
  if (state() === "revealing") document.documentElement.setAttribute("data-intro", "playing");
}

/** Removes the sequence once the page is fully open. */
export function endIntro() {
  if (state() === null) return;
  document.documentElement.setAttribute("data-intro", "done");
  window.dispatchEvent(new Event(INTRO_END_EVENT));
}
