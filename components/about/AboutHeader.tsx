import Link from "next/link";
import { about, hero, site } from "@/content/site";
import { ENQUIRY_FALLBACK_HREF } from "@/lib/enquiry";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { BackLink } from "./BackLink";

/**
 * The About page's bar, always in view: back to the home page on the left,
 * the logo in the middle, the call to action on the right.
 */
export function AboutHeader() {
  return (
    <header className="scheme-ink sticky top-0 z-50 border-b border-line bg-[var(--header-bg)] pt-[env(safe-area-inset-top,0px)]">
      <div className="shell flex h-[3.75rem] items-center justify-between gap-4 md:grid md:grid-cols-[1fr_auto_1fr]">
        <BackLink label={about.back} short={about.backShort} className="shrink-0 justify-self-start" />
        <Link href="/" aria-label={`${site.name}, home`} className="shrink rounded-md px-1 py-2">
          <Logo eager className="h-6 sm:h-8" />
        </Link>
        <div className="flex items-center justify-self-end">
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
