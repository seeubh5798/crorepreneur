import Image from "next/image";
import { site } from "@/content/site";
import { asset } from "@/lib/assets";
import { cn } from "@/lib/cn";

/*
 * The Crorepreneur logo, rebuilt as vectors from the brand's own artwork
 * (public/brand): the rupee climbing a staircase from 1 to 1,00,00,000, the
 * name in Poppins, and the line "Your growth marketing partner". These are
 * the light-ink versions, for the dark bars and footer; the ink versions in
 * the same folder are for light grounds.
 */

/** The horizontal lockup, mark beside the name, for the bars. */
export function Logo({ className, eager }: { className?: string; eager?: boolean }) {
  return (
    <Image
      src={asset("/brand/crorepreneur-lockup-light.svg")}
      alt={site.name}
      width={783}
      height={100}
      unoptimized
      loading={eager ? "eager" : undefined}
      className={cn("h-8 w-auto", className)}
    />
  );
}

/** The primary logo, with the line under the name. */
export function LogoFull({ className }: { className?: string }) {
  return (
    <Image
      src={asset("/brand/crorepreneur-logo-light.svg")}
      alt={`${site.name}, your growth marketing partner`}
      width={1726}
      height={1168}
      unoptimized
      className={cn("h-auto w-44", className)}
    />
  );
}
