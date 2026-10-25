"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type MagneticProps = {
  children: ReactNode;
  /** How far the element follows the cursor, as a share of the distance. */
  strength?: number;
  className?: string;
};

/**
 * A slight pull toward the cursor. Mouse only: touch and pen input pass
 * straight through, and reduced-motion visitors get no movement at all (see
 * `.magnetic` in globals.css, whose transition does the easing). It moves the
 * element directly, without re-rendering anything.
 */
export function Magnetic({ children, strength = 0.22, className }: MagneticProps) {
  // Where the element sits at rest, measured as the cursor arrives, so its own
  // movement doesn't feed back into where it moves to.
  const rest = useRef<DOMRect | null>(null);

  function handleEnter(event: PointerEvent<HTMLSpanElement>) {
    if (event.pointerType === "mouse") rest.current = event.currentTarget.getBoundingClientRect();
  }

  function handleMove(event: PointerEvent<HTMLSpanElement>) {
    if (event.pointerType !== "mouse") return;
    const rect = (rest.current ??= event.currentTarget.getBoundingClientRect());
    const x = (event.clientX - (rect.left + rect.width / 2)) * strength;
    const y = (event.clientY - (rect.top + rect.height / 2)) * strength;
    event.currentTarget.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
  }

  function handleLeave(event: PointerEvent<HTMLSpanElement>) {
    rest.current = null;
    event.currentTarget.style.transform = "";
  }

  return (
    <span
      className={cn("magnetic", className)}
      onPointerEnter={handleEnter}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      {children}
    </span>
  );
}
