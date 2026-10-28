import Link from "next/link";
import type { ReactNode } from "react";
import { careers, site } from "@/content/site";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { LinkedInIcon } from "@/components/ui/LinkedInIcon";
import { LogoFull } from "@/components/ui/Logo";

/** The icon beside each network's name; inline SVG, so the buttons cost no request. */
const ICONS: Partial<Record<(typeof site.socials)[number]["network"], ReactNode>> = {
  instagram: <InstagramIcon size={17} />,
  linkedin: <LinkedInIcon size={16} />,
};

/** Year the copyright line shows. Update here when it changes. */
const COPYRIGHT_YEAR = 2026;

/**
 * The logo, the copyright with a small link to careers, and buttons to
 * follow the company on its social accounts. The section links live in the
 * header only. `onHome` is false on other pages, where the logo leads back
 * to the home page.
 */
export function Footer({ onHome = true }: { onHome?: boolean }) {
  const socials = site.socials.filter((social) => social.href);
  const base = onHome ? "" : "/";

  return (
    <footer className="scheme-ink border-t border-line">
      <div className="shell flex flex-col gap-8 py-10 text-sm text-fg-2 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-5">
          <a
            href={`${base}#top`}
            aria-label={onHome ? `${site.name}, back to top` : `${site.name}, home`}
            className="w-fit"
          >
            <LogoFull />
          </a>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
            <p>
              © {COPYRIGHT_YEAR} {site.name}. All rights reserved.
            </p>
            <Link href="/careers" className="inline-flex min-h-11 items-center gap-2.5 text-fg">
              <span className="link-underline pb-0.5 font-medium">{careers.link}</span>
              <span className="rounded-full bg-accent-soft px-2.5 py-1 text-[0.75rem] font-medium leading-none text-accent-text">
                {careers.hiring}
              </span>
            </Link>
          </div>
        </div>

        {socials.length > 0 && (
          <nav aria-label={site.follow.label} className="flex flex-col gap-3 md:items-end">
            <p className="serif text-[1.25rem] leading-none text-fg-2">{site.follow.label}</p>
            <ul className="flex flex-wrap gap-2.5">
              {socials.map((social) => (
                <li key={social.network}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${site.follow.name} ${social.label}`}
                    className="inline-flex h-11 items-center gap-2.5 rounded-full border border-line-strong px-5 text-sm font-medium text-fg transition-colors duration-300 hover:border-fg hover:bg-fg hover:text-bg"
                  >
                    {ICONS[social.network]}
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </footer>
  );
}
