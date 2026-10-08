import { site } from "@/content/site";
import { cn } from "@/lib/cn";

/**
 * The wordmark sets the two halves of the name in two voices: "Crore" in the
 * display serif, "preneur" in the sans. One word, read as one, with the seam
 * left visible.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-baseline leading-none", className)}>
      <span className="sr-only">{site.name}</span>
      <span aria-hidden="true" className="font-display text-[1.24em] italic tracking-[-0.01em]">
        {site.wordmark.lead}
      </span>
      <span aria-hidden="true" className="font-sans font-medium tracking-[-0.04em]">
        {site.wordmark.tail}
      </span>
    </span>
  );
}
