"use client";

import { animate, useInView } from "motion/react";
import { useEffect, useRef } from "react";
import type { Metric } from "@/content/site";

function format(value: number, decimals: number) {
  return value.toFixed(decimals);
}

/**
 * Counts a figure up from zero the first time it is seen. The final value is
 * what gets rendered on the server, so the number is right without script and
 * for visitors who prefer reduced motion.
 */
export function CountUp({ metric, className }: { metric: Metric; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const decimals = metric.decimals ?? 0;

  useEffect(() => {
    const node = numberRef.current;
    if (!inView || !node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const controls = animate(0, metric.value, {
      duration: 1.3,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        node.textContent = format(latest, decimals);
      },
    });
    return () => {
      controls.stop();
      node.textContent = format(metric.value, decimals);
    };
  }, [inView, metric.value, decimals]);

  return (
    <span ref={ref} className={className}>
      {metric.prefix}
      <span ref={numberRef}>{format(metric.value, decimals)}</span>
      {metric.suffix}
    </span>
  );
}
