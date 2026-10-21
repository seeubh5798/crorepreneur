import Link from "next/link";
import { about, hero, site } from "@/content/site";
import { ENQUIRY_FALLBACK_HREF } from "@/lib/enquiry";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Wordmark } from "@/components/ui/Wordmark";
import { BackLink } from "./BackLink";

/**
 * The About page's bar, always in view: back to the home page on the left,
 * the wordmark in the middle, the theme and the call to action on the right.
 */
export function AboutHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-[var(--header-bg)] pt-[env(safe-area-inset-top,0px)]">
      <div className="shell grid h-[4.25rem] grid-cols-[1fr_auto_1fr] items-center gap-4">
        <BackLink label={about.back} short={about.backShort} className="justify-self-start" />
        <Link href="/" aria-label={`${site.name}, home`} className="rounded-md px-1 py-2 text-[1.1875rem] text-fg">
          <Wordmark />
        </Link>
        <div className="flex items-center gap-1.5 justify-self-end md:gap-3">
          <ThemeToggle />
          <div className="hidden md:block">
            <Button href={ENQUIRY_FALLBACK_HREF} size="sm" enquiry>
              {hero.primaryCta.label}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
