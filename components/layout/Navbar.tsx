"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { hero, site } from "@/content/site";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { ENQUIRY_FALLBACK_HREF } from "@/lib/enquiry";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Wordmark } from "@/components/ui/Wordmark";
import { MobileMenu } from "./MobileMenu";

const SECTION_IDS = site.nav.map((item) => item.href.slice(1));

export function Navbar() {
  const headerRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [current, setCurrent] = useState<string | null>(null);

  // Compact, blurred header once the page has moved. Written straight to the
  // DOM so scrolling never re-renders the tree.
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const update = () => {
      header.dataset.scrolled = window.scrollY > 16 ? "true" : "false";
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  // Mark the section being read in the navigation.
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setCurrent(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <header
        ref={headerRef}
        data-scrolled="false"
        data-menu-open={menuOpen}
        className={cn(
          "group/header fixed inset-x-0 top-0 z-50 border-b border-transparent pt-[env(safe-area-inset-top,0px)]",
          "transition-[background-color,border-color,backdrop-filter] duration-500 ease-out-expo",
          // A solid matte bar once scrolled: no backdrop blur, which would be
          // recomputed over the page and the 3D layer on every scroll frame.
          "data-[scrolled=true]:border-line data-[scrolled=true]:bg-[var(--header-bg)]",
          "data-[menu-open=true]:border-transparent data-[menu-open=true]:bg-transparent",
        )}
      >
        <div
          className={cn(
            "load-in shell flex h-[4.5rem] items-center justify-between gap-6",
            "transition-[height] duration-500 ease-out-expo group-data-[scrolled=true]/header:h-[3.75rem]",
          )}
        >
          <a
            href="#top"
            aria-label={`${site.name}, back to top`}
            className="-ml-1 rounded-md px-1 py-2 text-[1.1875rem] text-fg"
            onClick={() => setMenuOpen(false)}
          >
            <Wordmark />
          </a>

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-8 text-sm">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    aria-current={current === item.href.slice(1) ? "true" : undefined}
                    className={cn(
                      "link-underline py-2 text-fg-2 transition-colors duration-300 hover:text-fg",
                      "aria-[current=true]:text-fg",
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <Link
                  href={site.about.href}
                  className="link-underline py-2 text-fg-2 transition-colors duration-300 hover:text-fg"
                >
                  {site.about.label}
                </Link>
              </li>
            </ul>
          </nav>

          <div className="flex items-center gap-1.5 md:gap-3">
            <ThemeToggle />
            <div className="hidden md:block">
              <Button href={ENQUIRY_FALLBACK_HREF} size="sm" enquiry>
                {hero.primaryCta.label}
              </Button>
            </div>
            <button
              type="button"
              className="relative grid size-11 place-items-center rounded-full text-fg md:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span aria-hidden="true" className="relative block h-3 w-[1.375rem]">
                <span
                  className={cn(
                    "absolute left-0 top-0 h-px w-full bg-current transition-transform duration-500 ease-out-expo",
                    menuOpen && "translate-y-[5.5px] rotate-45",
                  )}
                />
                <span
                  className={cn(
                    "absolute bottom-0 left-0 h-px w-full bg-current transition-transform duration-500 ease-out-expo",
                    menuOpen && "-translate-y-[5.5px] -rotate-45",
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
