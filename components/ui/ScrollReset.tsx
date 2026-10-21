"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { getLenis } from "@/lib/smooth";

/**
 * Starts every new page at its top. Next.js keeps the scroll position when
 * any part of the new page is already on screen, so leaving the bottom of
 * the long home page for the shorter About page would land on its footer.
 * Back and forward keep the browser's own position, and links to a section
 * (with a #hash) still land on it.
 */
export function ScrollReset() {
  const pathname = usePathname();
  const first = useRef(true);
  const traversed = useRef(false);

  useEffect(() => {
    const onPop = () => {
      traversed.current = true;
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (traversed.current) {
      traversed.current = false;
      return;
    }
    if (window.location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    getLenis()?.scrollTo(0, { immediate: true, force: true });
  }, [pathname]);

  return null;
}
