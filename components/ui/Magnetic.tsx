"use client";

import { m, useMotionValue, useSpring } from "motion/react";
import type { PointerEvent, ReactNode } from "react";

type MagneticProps = {
  children: ReactNode;
  /** How far the element follows the cursor, as a share of the distance. */
  strength?: number;
  className?: string;
};

/**
 * A slight pull toward the cursor. Mouse only: touch and pen input pass
 * straight through, and reduced-motion visitors get no movement at all.
 */
export function Magnetic({ children, strength = 0.22, className }: MagneticProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 20, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 260, damping: 20, mass: 0.5 });

  function handleMove(event: PointerEvent<HTMLSpanElement>) {
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <m.span
      className={className}
      style={{ x: springX, y: springY, display: "inline-flex" }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      {children}
    </m.span>
  );
}
