"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

type RailButtonsProps = {
  /** The id of the horizontal scroller to step through. */
  target: string;
  prev: string;
  next: string;
  className?: string;
};

/**
 * Previous and next buttons for a horizontal rail: each press moves it by one
 * card. The rail still scrolls by touch, trackpad and keyboard on its own;
 * this only listens to its scroll position, to know when an end is reached.
 */
export function RailButtons({ target, prev, next, className }: RailButtonsProps) {
  const [at, setAt] = useState<"start" | "middle" | "end">("start");

  useEffect(() => {
    const rail = document.getElementById(target);
    if (!rail) return;
    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const max = rail.scrollWidth - rail.clientWidth;
        setAt(rail.scrollLeft <= 4 ? "start" : rail.scrollLeft >= max - 4 ? "end" : "middle");
      });
    };
    measure();
    rail.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(frame);
      rail.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [target]);

  function step(direction: 1 | -1) {
    const rail = document.getElementById(target);
    const card = rail?.querySelector("li");
    if (!rail || !card || !card.parentElement) return;
    const gap = parseFloat(getComputedStyle(card.parentElement).columnGap) || 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    rail.scrollBy({
      left: direction * (card.getBoundingClientRect().width + gap),
      behavior: reduced ? "auto" : "smooth",
    });
  }

  const button =
    "grid size-11 place-items-center rounded-full border border-line-strong text-fg transition-colors duration-300 hover:border-fg disabled:pointer-events-none disabled:opacity-35";
  return (
    <div className={cn("flex gap-2", className)}>
      <button
        type="button"
        aria-label={prev}
        aria-controls={target}
        disabled={at === "start"}
        onClick={() => step(-1)}
        className={button}
      >
        <ArrowLeft aria-hidden="true" size={18} strokeWidth={1.75} />
      </button>
      <button
        type="button"
        aria-label={next}
        aria-controls={target}
        disabled={at === "end"}
        onClick={() => step(1)}
        className={button}
      >
        <ArrowRight aria-hidden="true" size={18} strokeWidth={1.75} />
      </button>
    </div>
  );
}
