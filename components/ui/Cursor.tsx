"use client";

import { useEffect, useRef } from "react";

const INTERACTIVE = "a, button, [role='tab'], [data-cursor]";

/**
 * A quiet ring that trails the mouse and opens up over anything clickable.
 * The system cursor stays visible. Mouse only, and off for visitors who
 * prefer reduced motion.
 */
export function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ring = ringRef.current;
    if (!ring) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduced.matches) return;

    let targetX = -100;
    let targetY = -100;
    let x = targetX;
    let y = targetY;
    let raf = 0;

    const step = () => {
      x += (targetX - x) * 0.2;
      y += (targetY - y) * 0.2;
      ring.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (Math.abs(targetX - x) > 0.1 || Math.abs(targetY - y) > 0.1) {
        raf = requestAnimationFrame(step);
      } else {
        raf = 0;
      }
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      targetX = event.clientX;
      targetY = event.clientY;
      if (ring.dataset.visible !== "true") {
        x = targetX;
        y = targetY;
        ring.dataset.visible = "true";
      }
      const target = event.target instanceof Element ? event.target.closest(INTERACTIVE) : null;
      ring.dataset.hover = target ? "true" : "false";
      if (!raf) raf = requestAnimationFrame(step);
    };
    const onLeave = () => {
      ring.dataset.visible = "false";
    };
    const onDown = () => {
      ring.dataset.down = "true";
    };
    const onUp = () => {
      ring.dataset.down = "false";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  return <div ref={ringRef} aria-hidden="true" className="cursor-ring" data-visible="false" />;
}
