"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";
import { useEffect } from "react";
import { afterIntroEnds } from "@/lib/intro";
import { setLenis } from "@/lib/smooth";
import { setStory, story, type StageId } from "@/lib/story";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Below this point on screen, content counts as not yet reached. */
const FOLD = 0.9;

/**
 * Everything the page does with the scroll position, in one place:
 *
 * - smooth, weighted scrolling on mouse and trackpad (Lenis), off for touch
 *   and for visitors who prefer reduced motion;
 * - which section is on stage, the scroll speed, and the view counter that
 *   climbs to one crore, all read by the 3D layer;
 * - the cover sinking into the dark as it scrolls away;
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
    // Held still until the opening sequence has fully opened the page, so the
    // scroll that skips it does not also carry the visitor past the cover.
    lenis.stop();
    const release = afterIntroEnds(() => lenis.start());
    return () => {
      release();
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  // Pointer, for the 3D camera and objects
  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      story.pointer.x = event.clientX / window.innerWidth - 0.5;
      story.pointer.y = event.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useGSAP(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Which section is on stage
    gsap.utils.toArray<HTMLElement>("[data-stage]").forEach((section) => {
      ScrollTrigger.create({
        trigger: section,
        start: "top 55%",
        end: "bottom 55%",
        onToggle: (self) => {
          if (self.isActive) setStory({ stage: section.dataset.stage as StageId });
        },
      });
    });

    // Scroll speed, eased back to zero when the page stops
    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        story.velocity = self.getVelocity();
      },
    });
    const decay = () => {
      story.velocity *= 0.9;
    };
    gsap.ticker.add(decay);

    // Views on the phone: 100 at the top, one crore when the closing section arrives.
    const contact = document.getElementById("contact");
    ScrollTrigger.create({
      start: 0,
      end: () => (contact ? contact.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.35 : 1),
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        story.views = Math.pow(10, 2 + 5 * self.progress);
      },
    });

    if (reduced) return () => gsap.ticker.remove(decay);

    // The cover sinks into the dark as it scrolls away.
    const cover = document.getElementById("top");
    if (cover) {
      gsap
        .timeline({ scrollTrigger: { trigger: cover, start: "top top", end: "bottom top", scrub: true } })
        .to("[data-cover-portrait]", { yPercent: 12, scale: 0.92, ease: "none" }, 0)
        .to("[data-cover-shade]", { opacity: 1, ease: "none" }, 0)
        .to("[data-cover-masthead]", { yPercent: -45, opacity: 0.1, ease: "none" }, 0)
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

    return () => gsap.ticker.remove(decay);
  });

  return null;
}
