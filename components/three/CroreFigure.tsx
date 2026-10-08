"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { supportsWebGL } from "./shared";

const CroreScene = dynamic(() => import("./crore/CroreScene"), { ssr: false });

class Guard extends Component<{ children: ReactNode; onFail: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFail();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

type CroreFigureProps = {
  /** The figure as text: for the first frame, for screen readers and as the fallback. */
  figure: string;
  className?: string;
};

/**
 * One crore, in the same satin metal as the zeros elsewhere on the page.
 * Renders as text first; where WebGL works, 3D numerals fly in when the panel
 * is reached and then turn to follow the cursor.
 */
export function CroreFigure({ figure, className }: CroreFigureProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [load, setLoad] = useState(false);
  const [ready, setReady] = useState(false);

  // Load the 3D code shortly before the panel scrolls into view.
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || window.matchMedia("(prefers-reduced-motion: reduce)").matches || !supportsWebGL()) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px 60% 0px" },
    );
    observer.observe(wrap);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={wrapRef}
      role="img"
      aria-label={`${figure}, one crore`}
      data-gl={ready ? "ready" : undefined}
      className={cn("crore-figure relative aspect-[5.4/1] w-full sm:aspect-[6.2/1]", className)}
    >
      <p
        aria-hidden="true"
        className="crore-fallback display tabular absolute inset-0 flex items-center text-[clamp(2.5rem,13vw,10.5rem)] leading-none text-fg"
      >
        {figure}
      </p>
      {load && (
        <Guard onFail={() => setReady(false)}>
          <CroreScene container={wrapRef} onReady={() => setReady(true)} />
        </Guard>
      )}
    </div>
  );
}
