import { ArrowDown, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Magnetic } from "./Magnetic";

type ButtonProps = {
  href: string;
  children: ReactNode;
  size?: "md" | "sm";
  /** Opens the "Start a Campaign" form (EnquiryDialog) instead of following the link. */
  enquiry?: boolean;
  className?: string;
};

/** The primary call to action: a solid matte pill with an accent arrow. */
export function Button({ href, children, size = "md", enquiry, className }: ButtonProps) {
  const small = size === "sm";
  return (
    <Magnetic>
      <a
        href={href}
        data-enquiry={enquiry ? "" : undefined}
        className={cn(
          "matte-pill arrow-host group inline-flex items-center rounded-full bg-fg font-medium text-bg",
          "transition-[box-shadow,background-color] duration-500 ease-out-expo",
          small ? "h-10 gap-2.5 pl-4 pr-1.5 text-sm" : "h-13 gap-3.5 pl-6 pr-2 text-[0.9375rem]",
          className,
        )}
      >
        <span className="whitespace-nowrap">{children}</span>
        <span
          aria-hidden="true"
          className={cn("grid place-items-center rounded-full bg-accent text-on-accent", small ? "size-7" : "size-9")}
        >
          <span className="arrow-swap">
            <ArrowUpRight size={small ? 14 : 16} strokeWidth={2} />
            <ArrowUpRight size={small ? 14 : 16} strokeWidth={2} />
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
  const classes = cn("arrow-host inline-flex min-h-11 items-center gap-2 text-[0.9375rem] font-medium text-fg", className);
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
