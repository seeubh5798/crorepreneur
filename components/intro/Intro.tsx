"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { intro as copy } from "@/content/site";
import { asset } from "@/lib/assets";
import { coverPage, endIntro, introShowing, revealPage } from "@/lib/intro";
import { supportsWebGL } from "@/components/three/shared";
import { Wordmark } from "@/components/ui/Wordmark";
import type { IntroGeo } from "./IntroCanvas";
import { finishJourney, nudgeJourney, resetJourney } from "./journey";

const IntroCanvas = dynamic(() => import("./IntroCanvas"), { ssr: false });

/** If the 3D has not started drawing by then, the page simply opens. */
const STALL_MS = 4500;
/** Once the page is fully open, it takes over when the scrolling has paused this long, in ms. */
const SETTLE_MS = 240;
/** How far to scroll for the whole flight, in screen heights. */
const SCREENS = 2.8;
/** A swipe carries a little further than the finger, as native scrolling does. */
const TOUCH = 1.6;
/** Keys that move through the flight, in screen heights. */
const KEY_STEPS: Record<string, number> = { ArrowDown: 0.3, ArrowUp: -0.3, PageDown: 0.8, PageUp: -0.8, " ": 0.8 };

/**
 * The opening sequence: a matte globe, then India, Jharkhand and Ranchi,
 * Chabi's home city; then the page opens out of Ranchi. It moves only as the
 * visitor scrolls (wheel, touch or keys), and scrolling back up flies back
 * out. The overlay is in the markup from the first paint and only shown while
 * <html data-intro> says so (see lib/intro.ts); the map data and the 3D load
 * behind it. Skip flies the rest of the way. Once the page is fully open and
 * the scrolling has paused, the page takes over and the whole thing, canvas
 * included, is removed.
 */
export function Intro() {
  const [geo, setGeo] = useState<IntroGeo | null>(null);
  const [ready, setReady] = useState(false);
  const [stage, setStage] = useState(0);
  const [moved, setMoved] = useState(false);
  const [open, setOpen] = useState(false);
  const [gone, setGone] = useState(false);
  const overlay = useRef<HTMLDivElement>(null);
  const lastInput = useRef(0);

  // Opens the page at once, for when there is no 3D to fly through.
  const openNow = useCallback(() => {
    revealPage();
    endIntro();
    setGone(true);
  }, []);

  const skip = useCallback(() => {
    lastInput.current = 0;
    setMoved(true);
    if (document.querySelector(".intro[data-ready]")) finishJourney();
    else openNow();
  }, [openNow]);

  // Reported by the 3D whenever the page's opening changes: 0 covered, 1 fully open.
  const onOpen = useCallback((amount: number) => {
    overlay.current?.style.setProperty("--intro-open", `${(amount * 100).toFixed(2)}%`);
    if (amount > 0) revealPage();
    else coverPage();
    setOpen(amount >= 1);
  }, []);

  useEffect(() => {
    if (!introShowing()) return;
    (window as Window & { __introStarted?: boolean }).__introStarted = true;
    // Every visit starts at the world, with the page at its top underneath.
    resetJourney();
    window.scrollTo(0, 0);
    if (!supportsWebGL()) {
      revealPage();
      endIntro();
      return;
    }

    let alive = true;
    fetch(asset("/geo/intro.json"))
      .then((response) => response.json() as Promise<IntroGeo>)
      .then((data) => {
        if (alive) setGeo(data);
      })
      .catch(() => {
        if (alive) openNow();
      });

    // The stall clock only runs while the tab is showing: a page opened in a
    // background tab keeps its sequence until the visitor actually looks.
    let stall = 0;
    const watch = () => {
      window.clearTimeout(stall);
      if (document.hidden) return;
      stall = window.setTimeout(() => {
        if (!document.querySelector(".intro[data-ready]")) openNow();
      }, STALL_MS);
    };
    watch();
    document.addEventListener("visibilitychange", watch);

    // Scrolling moves the flight: down flies in, up flies back out.
    const move = (pixels: number) => {
      lastInput.current = performance.now();
      nudgeJourney(pixels / (window.innerHeight * SCREENS));
      setMoved(true);
    };
    const onWheel = (event: WheelEvent) => {
      const unit = event.deltaMode === 1 ? 100 / 6 : event.deltaMode === 2 ? window.innerHeight : 1;
      move(Math.max(-200, Math.min(200, event.deltaY * unit)));
    };
    let touchY: number | null = null;
    const onTouchStart = (event: TouchEvent) => {
      touchY = event.touches[0]?.clientY ?? null;
    };
    const onTouchMove = (event: TouchEvent) => {
      const y = event.touches[0]?.clientY;
      if (y === undefined || touchY === null) return;
      move((touchY - y) * TOUCH);
      touchY = y;
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "End") {
        skip();
        return;
      }
      if (event.key === "Home") {
        nudgeJourney(-1);
        return;
      }
      const step = KEY_STEPS[event.key];
      if (step === undefined || (event.key === " " && event.target instanceof HTMLButtonElement)) return;
      event.preventDefault();
      move(step * window.innerHeight);
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      alive = false;
      window.clearTimeout(stall);
      document.removeEventListener("visibilitychange", watch);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
    };
  }, [openNow, skip]);

  // Fully open: the page takes over once the scrolling that got here has paused,
  // so the end of that scroll does not also carry the visitor past the cover.
  useEffect(() => {
    if (!open) return;
    let timer = 0;
    function settle() {
      const wait = SETTLE_MS - (performance.now() - lastInput.current);
      if (wait > 0) {
        timer = window.setTimeout(settle, wait);
        return;
      }
      endIntro();
      setGone(true);
    }
    timer = window.setTimeout(settle, 0);
    return () => window.clearTimeout(timer);
  }, [open]);

  if (gone) return null;
  const place = copy.places[stage];

  return (
    <div ref={overlay} className="intro" data-ready={ready || undefined} data-moved={moved || undefined}>
      <div className="intro-stage">
        {geo && (
          <IntroCanvas
            geo={geo}
            stage={stage}
            pinLabel={copy.places[copy.places.length - 1].name}
            onStage={setStage}
            onOpen={onOpen}
            onReady={() => setReady(true)}
          />
        )}
      </div>

      <div className="intro-hud shell">
        <p className="intro-mark text-[1.1875rem] text-fg">
          <Wordmark />
        </p>
        <p className="intro-hint" aria-hidden="true">
          {copy.hint}
        </p>
        <div className="intro-bottom">
          <div key={stage} className="intro-caption" aria-live="polite">
            <p className="intro-count tabular">
              {String(stage + 1).padStart(2, "0")} / {String(copy.places.length).padStart(2, "0")}
            </p>
            <p className="intro-place display">{place.name}</p>
            <p className="intro-detail">{place.detail}</p>
          </div>
          <button type="button" className="intro-skip" onClick={skip}>
            {copy.skip}
          </button>
        </div>
      </div>
    </div>
  );
}
