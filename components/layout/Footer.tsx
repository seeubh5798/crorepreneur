import { site } from "@/content/site";
import { Wordmark } from "@/components/ui/Wordmark";

/** Year the copyright line shows. Update here when it changes. */
const COPYRIGHT_YEAR = 2026;

export function Footer() {
  const socials = site.socials.filter((social) => social.href);

  return (
    <footer className="border-t border-line">
      <div className="shell flex flex-col gap-6 py-8 text-sm text-fg-2 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-5">
          <a href="#top" aria-label={`${site.name}, back to top`} className="text-base text-fg">
            <Wordmark />
          </a>
          <p>
            © {COPYRIGHT_YEAR} {site.name}. All rights reserved.
          </p>
        </div>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {site.nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="link-underline py-2 transition-colors duration-300 hover:text-fg">
                  {item.label}
                </a>
              </li>
            ))}
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
