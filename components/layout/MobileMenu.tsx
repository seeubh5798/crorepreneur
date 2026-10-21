"use client";

import { AnimatePresence, m } from "motion/react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { hero, site } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { ENQUIRY_FALLBACK_HREF } from "@/lib/enquiry";
import { getLenis } from "@/lib/smooth";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
};

const EASE = [0.16, 1, 0.3, 1] as const;

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // While open: lock the page behind, close on Escape, and close if the
  // window grows past the mobile breakpoint.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    getLenis()?.stop();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const desktop = window.matchMedia("(min-width: 48rem)");
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

  return (
    <AnimatePresence>
      {open && (
        <m.div
          id="mobile-menu"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-40 flex flex-col bg-bg md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
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
                  <m.a
                    href={item.href}
                    onClick={onClose}
                    className="display block py-5 text-[2.75rem] text-fg"
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "40%", opacity: 0 }}
                    transition={{ duration: 0.8, ease: EASE, delay: 0.06 + index * 0.06 }}
                  >
                    {item.label}
                  </m.a>
                </li>
              ))}
              <li className="overflow-hidden border-b border-line">
                <m.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "40%", opacity: 0 }}
                  transition={{ duration: 0.8, ease: EASE, delay: 0.06 + site.nav.length * 0.06 }}
                >
                  <Link href={site.about.href} onClick={onClose} className="display block py-5 text-[2.75rem] text-fg">
                    {site.about.label}
                  </Link>
                </m.div>
              </li>
            </ul>
          </nav>

          <m.div
            className="shell relative flex flex-col gap-5 pb-[max(2rem,env(safe-area-inset-bottom,0px))]"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.32 }}
          >
            <div onClick={onClose}>
              <Button href={ENQUIRY_FALLBACK_HREF} enquiry>
                {hero.primaryCta.label}
              </Button>
            </div>
            <p className="text-sm text-fg-2">{site.contact.email}</p>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
