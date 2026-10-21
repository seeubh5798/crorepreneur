import Link from "next/link";
import { site } from "@/content/site";
import { LogoFull } from "@/components/ui/Logo";

/** Year the copyright line shows. Update here when it changes. */
const COPYRIGHT_YEAR = 2026;

/** `onHome` is false on other pages, where the section links lead back to the home page. */
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
          <p>
            © {COPYRIGHT_YEAR} {site.name}. All rights reserved.
          </p>
        </div>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {site.nav.map((item) => (
              <li key={item.href}>
                <a
                  href={`${base}${item.href}`}
                  className="link-underline py-2 transition-colors duration-300 hover:text-fg"
                >
                  {item.label}
                </a>
              </li>
            ))}
            {onHome && (
              <li>
                <Link
                  href={site.about.href}
                  className="link-underline py-2 transition-colors duration-300 hover:text-fg"
                >
                  {site.about.label}
                </Link>
              </li>
            )}
            {socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="link-underline py-2 transition-colors duration-300 hover:text-fg"
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
