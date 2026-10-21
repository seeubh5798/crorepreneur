"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";
import { useEffect } from "react";
import { setLenis } from "@/lib/smooth";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Below this point on screen, content counts as not yet reached. */
const FOLD = 0.9;

/**
 * Everything the page does with the scroll position, in one place:
 *
 * - smooth, weighted scrolling on mouse and trackpad (Lenis), off for touch
 *   and for visitors who prefer reduced motion;
 * - the cover easing away as it scrolls off;
 * - the manifesto lighting up word by word.
 */
export function ScrollStory() {
  // Smooth scrolling
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    // Anchor links land on the section top, just under the header: Lenis reads
    // the offset from the page's scroll-padding-top, so none is added here.
    const lenis = new Lenis({ lerp: 0.1, anchors: true });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // As the cover scrolls away, she sinks a little and the copy lifts off.
    const cover = document.getElementById("top");
    if (cover) {
      gsap
        .timeline({ scrollTrigger: { trigger: cover, start: "top top", end: "bottom top", scrub: true } })
        .to("[data-cover-portrait]", { yPercent: 10, scale: 0.94, ease: "none" }, 0)
        .to("[data-cover-copy]", { y: -80, opacity: 0, ease: "power1.in" }, 0);
    }

    // The manifesto lights up word by word. Words already on screen at load stay lit.
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

  return null;
}
