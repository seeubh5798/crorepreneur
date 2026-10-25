"use client";

import { useEffect, useRef } from "react";
import type { Metric } from "@/content/site";

const DURATION = 1300;

function format(value: number, decimals: number) {
  return value.toFixed(decimals);
}

/** Fast at first, settling gently, like the site's ease-out-expo. */
function easeOut(t: number) {
  return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

/**
 * Counts a figure up from zero the first time it is mostly on screen. The
 * final value is what gets rendered on the server, so the number is right
 * without script and for visitors who prefer reduced motion. A plain
 * IntersectionObserver and one animation frame per update, nothing else.
 */
export function CountUp({ metric, className }: { metric: Metric; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const decimals = metric.decimals ?? 0;

  useEffect(() => {
    const host = ref.current;
    const node = numberRef.current;
    if (!host || !node || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        const start = performance.now();
        const step = (now: number) => {
          const t = Math.min(1, (now - start) / DURATION);
          node.textContent = format(metric.value * easeOut(t), decimals);
          if (t < 1) frame = requestAnimationFrame(step);
        };
        frame = requestAnimationFrame(step);
      },
      { threshold: 0.6 },
    );
    observer.observe(host);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      node.textContent = format(metric.value, decimals);
    };
  }, [metric.value, decimals]);

  return (
    <span ref={ref} className={className}>
      {metric.prefix}
      <span ref={numberRef}>{format(metric.value, decimals)}</span>
      {metric.suffix}
    </span>
  );
}
