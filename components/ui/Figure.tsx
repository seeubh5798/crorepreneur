import { Fragment } from "react";

/**
 * Renders a display figure such as "₹1.2 Cr". Instrument Serif has no rupee
 * sign, so the symbol is set in the sans at a matched size instead of being
 * left to a system fallback.
 */
export function Figure({ children }: { children: string }) {
  const parts = children.split("₹");
  return (
    <>
      {parts.map((part, index) => (
        <Fragment key={index}>
          {index > 0 && <span className="mr-[0.04em] font-sans text-[0.74em] font-normal">₹</span>}
          {part}
        </Fragment>
      ))}
    </>
  );
}
