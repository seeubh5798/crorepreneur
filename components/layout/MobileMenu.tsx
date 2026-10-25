"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { hero, site } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { ENQUIRY_FALLBACK_HREF } from "@/lib/enquiry";
import { getLenis } from "@/lib/smooth";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
};

/** How long the menu takes to fade out; it stays on the page until then. Matches `.mobile-menu` in globals.css. */
const CLOSING_MS = 350;

/**
 * The full-screen menu for phones and tablets. It fades in and its links rise
 * one after another, all in CSS (see `.mobile-menu` in globals.css); it fades
 * out on closing, then leaves the page.
 */
export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [closing, setClosing] = useState(false);
  const [wasOpen, setWasOpen] = useState(open);

  // Closing: keep the panel for its fade out, then let it go.
  if (open !== wasOpen) {
    setWasOpen(open);
    setClosing(!open);
  }
  useEffect(() => {
    if (!closing) return;
    const timer = window.setTimeout(() => setClosing(false), CLOSING_MS);
    return () => window.clearTimeout(timer);
  }, [closing]);

  // While open: lock the page behind, close on Escape, and close if the
  // window grows wide enough for the full navigation.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    getLenis()?.stop();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const desktop = window.matchMedia("(min-width: 64rem)");
    const onResize = () => {
      if (desktop.matches) onClose();
    };

    window.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onResize);
    panelRef.current?.querySelector<HTMLElement>("a")?.focus({ preventScroll: true });

    return () => {
      document.body.style.overflow = previousOverflow;
      getLenis()?.start();
      window.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onResize);
    };
  }, [open, onClose]);

  if (!open && !closing) return null;

  return (
    <div
      id="mobile-menu"
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      data-state={open ? "open" : "closed"}
      className="mobile-menu scheme-ink fixed inset-0 z-40 flex flex-col lg:hidden"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="glow"
          style={{
            right: "-40%",
            top: "-10%",
            width: "120%",
            height: "70%",
            background: "radial-gradient(closest-side, var(--glow-a), transparent 70%)",
          }}
        />
      </div>

      <nav aria-label="Mobile" className="shell relative flex flex-1 flex-col justify-center pt-20">
        <ul className="flex flex-col">
          {site.nav.map((item, index) => (
            <li key={item.href} className="overflow-hidden border-b border-line">
              <a
                href={item.href}
                onClick={onClose}
                className="mobile-menu-link display block py-5 text-[2.75rem] text-fg"
                style={{ "--i": index } as CSSProperties}
              >
                {item.label}
              </a>
            </li>
          ))}
          <li className="overflow-hidden border-b border-line">
            <Link
              href={site.about.href}
              onClick={onClose}
              className="mobile-menu-link display block py-5 text-[2.75rem] text-fg"
              style={{ "--i": site.nav.length } as CSSProperties}
            >
              {site.about.label}
            </Link>
          </li>
        </ul>
      </nav>

      <div className="mobile-menu-foot shell relative flex flex-col gap-5 pb-[max(2rem,env(safe-area-inset-bottom,0px))]">
        <div onClick={onClose}>
          <Button href={ENQUIRY_FALLBACK_HREF} enquiry>
            {hero.primaryCta.label}
          </Button>
        </div>
        <p className="text-sm text-fg-2">{site.contact.email}</p>
      </div>
    </div>
  );
}
