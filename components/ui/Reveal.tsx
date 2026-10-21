"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Delay in milliseconds, for staggering siblings. */
  delay?: number;
};

/**
 * Lets a block ease in as it enters the viewport.
 *
 * The block is rendered visible. It is only hidden, after mount, when it sits
 * below the fold, so nothing depends on JavaScript to be readable and nothing
 * that is already on screen flickers.
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;

    el.dataset.reveal = "hidden";
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          el.dataset.reveal = "shown";
          observer.disconnect();
        }
      },
      // The zone runs far above the screen, so a block that is scrolled past
      // too quickly to be seen (a fling, a jump to a section) still shows.
      { rootMargin: "100000px 0px -10% 0px" },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      // Never leave a block hidden with nothing left to show it.
      if (el.dataset.reveal === "hidden") delete el.dataset.reveal;
    };
  }, []);

  return (
    <div ref={ref} className={cn("reveal", className)} style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}>
      {children}
    </div>
  );
}
