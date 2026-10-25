import { ArrowDown, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Magnetic } from "./Magnetic";

type ButtonProps = {
  href: string;
  children: ReactNode;
  /** "lg" is the big version a page closes on. */
  size?: "md" | "sm" | "lg";
  /** Opens the "Start a Campaign" form (EnquiryDialog) instead of following the link. */
  enquiry?: boolean;
  className?: string;
};

/** The primary call to action: a solid matte pill with an accent arrow. */
export function Button({ href, children, size = "md", enquiry, className }: ButtonProps) {
  const small = size === "sm";
  const large = size === "lg";
  return (
    <Magnetic>
      <a
        href={href}
        data-enquiry={enquiry ? "" : undefined}
        className={cn(
          "matte-pill arrow-host group inline-flex items-center rounded-full bg-fg font-medium text-bg",
          "transition-[box-shadow,background-color] duration-500 ease-out-expo",
          small
            ? "h-10 gap-2.5 pl-4 pr-1.5 text-sm"
            : large
              ? // On the narrowest phones (a folded Galaxy Fold, the first iPhone SE) it takes the regular size, to fit.
                "h-16 gap-5 pl-8 pr-2.5 text-[1.1875rem] max-[359px]:h-13 max-[359px]:gap-3.5 max-[359px]:pl-6 max-[359px]:text-[0.9375rem] sm:h-[4.5rem] sm:pl-9 sm:text-[1.3125rem]"
              : "h-13 gap-3.5 pl-6 pr-2 text-[0.9375rem]",
          className,
        )}
      >
        <span className="whitespace-nowrap">{children}</span>
        <span
          aria-hidden="true"
          className={cn(
            "grid place-items-center rounded-full bg-accent text-on-accent",
            small ? "size-7" : large ? "size-11 max-[359px]:size-9 sm:size-[3.25rem]" : "size-9",
          )}
        >
          <span className="arrow-swap">
            <ArrowUpRight size={small ? 14 : large ? 20 : 16} strokeWidth={2} />
            <ArrowUpRight size={small ? 14 : large ? 20 : 16} strokeWidth={2} />
          </span>
        </span>
      </a>
    </Magnetic>
  );
}

type TextLinkProps = {
  href: string;
  children: ReactNode;
  /** "down" for links that scroll further down the page. */
  direction?: "out" | "down";
  /** Opens another site in a new tab. */
  external?: boolean;
  className?: string;
};

/**
 * The secondary action: plain text, an underline that draws in, an arrow.
 * Links to another page of the site go through Next's <Link>, so they load
 * without a full page reload.
 */
export function TextLink({ href, children, direction = "out", external, className }: TextLinkProps) {
  const Icon = direction === "down" ? ArrowDown : ArrowUpRight;
  const classes = cn(
    "arrow-host inline-flex min-h-11 items-center gap-2 text-[0.9375rem] font-medium text-fg",
    className,
  );
  const content = (
    <>
      <span className="link-underline pb-0.5">{children}</span>
      <span aria-hidden="true" className="arrow-swap" data-dir={direction === "down" ? "down" : undefined}>
        <Icon size={16} strokeWidth={1.75} />
        <Icon size={16} strokeWidth={1.75} />
      </span>
    </>
  );
  if (href.startsWith("/") && !external) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={classes}
    >
      {content}
    </a>
  );
}
