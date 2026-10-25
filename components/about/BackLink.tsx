import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";

type BackLinkProps = {
  /** Where it leads; the home page unless said otherwise. */
  href?: string;
  label: string;
  /** A shorter label for narrow screens. */
  short?: string;
  className?: string;
};

/** Back (to the home page, unless told where): a quiet pill with an arrow that leans the way it goes. */
export function BackLink({ href = "/", label, short, className }: BackLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex h-10 items-center gap-2 rounded-full border border-line-strong pl-3 pr-4 text-sm font-medium text-fg",
        "transition-colors duration-300 hover:border-fg",
        className,
      )}
    >
      <ArrowLeft
        aria-hidden="true"
        size={16}
        strokeWidth={1.75}
        className="transition-transform duration-500 ease-out-expo group-hover:-translate-x-0.5"
      />
      {short ? (
        <>
          <span className="hidden sm:inline">{label}</span>
          <span className="sm:hidden">{short}</span>
        </>
      ) : (
        label
      )}
    </Link>
  );
}
