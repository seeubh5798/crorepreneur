import Link from "next/link";
import { hero, site } from "@/content/site";
import { ENQUIRY_FALLBACK_HREF } from "@/lib/enquiry";
import { BackLink } from "@/components/about/BackLink";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

type PageHeaderProps = {
  /** Where the back link goes, and what it says (shorter on narrow screens). */
  back: { href: string; label: string; short?: string };
};

/**
 * The bar on every page but the home page, always in view: back on the
 * left, the logo in the middle, the call to action on the right.
 */
export function PageHeader({ back }: PageHeaderProps) {
  return (
    <header className="scheme-ink sticky top-0 z-50 border-b border-line bg-[var(--header-bg)] pt-[env(safe-area-inset-top,0px)]">
      <div className="shell flex h-[3.75rem] items-center justify-between gap-4 md:grid md:grid-cols-[1fr_auto_1fr]">
        <BackLink href={back.href} label={back.label} short={back.short} className="shrink-0 justify-self-start" />
        <Link href="/" aria-label={`${site.name}, home`} className="shrink rounded-md px-1 py-2">
          <Logo eager className="h-5 min-[340px]:h-6 sm:h-8" />
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
