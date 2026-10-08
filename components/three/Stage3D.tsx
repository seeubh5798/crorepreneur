"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useState, type ReactNode } from "react";
import { afterIntroEnds } from "@/lib/intro";
import { supportsWebGL } from "./shared";

const StoryCanvas = dynamic(() => import("./story/StoryCanvas"), { ssr: false });

/** Hides the 3D layer if anything in it throws; the page works without it. */
class Guard extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * The fixed 3D layer behind the page. Loaded after the page is interactive,
 * only where WebGL works, and not at all for visitors who prefer reduced
 * motion: the 2D stand-ins in each phone slot cover for it.
 */
export function Stage3D() {
  const [mode, setMode] = useState<"off" | "full" | "compact">("off");

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !supportsWebGL()) return;
    const compact = window.matchMedia("(max-width: 63.99rem), (pointer: coarse)").matches;
    const start = () => setMode(compact ? "compact" : "full");
    // If the opening sequence plays, wait until it is gone, so the two scenes
    // never compete for the GPU.
    let idle = 0;
    const stop = afterIntroEnds(() => {
      idle =
        typeof window.requestIdleCallback === "function"
          ? window.requestIdleCallback(start, { timeout: 1200 })
          : window.setTimeout(start, 400);
    });
    return () => {
      stop();
      if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
    };
  }, []);

  if (mode === "off") return null;
  return (
    <div aria-hidden="true" className="stage-3d pointer-events-none fixed inset-0 z-0">
      <Guard>
        <StoryCanvas compact={mode === "compact"} />
      </Guard>
    </div>
  );
}
