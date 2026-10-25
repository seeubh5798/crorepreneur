"use client";

import { useEffect } from "react";
import { setLenis } from "@/lib/smooth";

/** Below this point on screen, content counts as not yet reached. */
const FOLD = 0.9;

/**
 * Everything the page does with the scroll position, in one place:
 *
 * - smooth, weighted scrolling on mouse and trackpad (Lenis), off for touch
 *   and for visitors who prefer reduced motion;
 * - the cover easing away as it scrolls off;
 * - the manifesto lighting up word by word.
 *
 * None of it is needed to show the page, so GSAP and Lenis are loaded on
 * their own, once the browser is idle after the first paint, and never hold
 * up the cover.
 */
export function ScrollStory() {
  useEffect(() => {
    let stop: (() => void) | undefined;
    let cancelled = false;

    const start = async () => {
      const [{ default: gsap }, { ScrollTrigger }, { default: Lenis }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
        import("lenis"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

      // Smooth scrolling. Anchor links land on the section top, just under the
      // header: Lenis reads the offset from the page's scroll-padding-top.
      let lenis: InstanceType<typeof Lenis> | null = null;
      const tick = (time: number) => lenis?.raf(time * 1000);
      if (fine && !reduced) {
        lenis = new Lenis({ lerp: 0.1, anchors: true });
        setLenis(lenis);
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);
      }

      const context = gsap.context(() => {
        if (reduced) return;

        // As the cover scrolls away, she sinks a little and the copy lifts off.
        const cover = document.getElementById("top");
        if (cover) {
          gsap
            .timeline({ scrollTrigger: { trigger: cover, start: "top top", end: "bottom top", scrub: true } })
            .to("[data-cover-portrait]", { yPercent: 10, scale: 0.94, ease: "none" }, 0)
            .to("[data-cover-copy]", { y: -80, opacity: 0, ease: "power1.in" }, 0);
        }

        // The manifesto lights up word by word. Words already on screen stay lit.
        const statement = document.querySelector<HTMLElement>("[data-manifesto]");
        if (statement && statement.getBoundingClientRect().top > window.innerHeight * FOLD) {
          gsap.fromTo(
            statement.querySelectorAll("[data-word]"),
            { opacity: 0.18 },
            {
              opacity: 1,
              ease: "none",
              stagger: 0.1,
              scrollTrigger: { trigger: statement, start: "top 82%", end: "bottom 50%", scrub: true },
            },
          );
        }
      });

      stop = () => {
        context.revert();
        gsap.ticker.remove(tick);
        if (lenis) {
          lenis.destroy();
          setLenis(null);
        }
      };
    };

    // Wait for the browser to be idle after the first paint (Safari has no
    // requestIdleCallback, so a short timeout stands in).
    const idle = "requestIdleCallback" in window;
    const handle = idle
      ? window.requestIdleCallback(() => void start(), { timeout: 1500 })
      : window.setTimeout(() => void start(), 300);

    return () => {
      cancelled = true;
      if (idle) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
      stop?.();
    };
  }, []);

  return null;
}
