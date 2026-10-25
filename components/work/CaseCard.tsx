import Image from "next/image";
import Link from "next/link";
import { cases, type CaseStudy } from "@/content/site";
import { asset } from "@/lib/assets";
import { TextLink } from "@/components/ui/Button";

/** What plays on a case's page, for its card: "Film · 1:18", "5 Reels", "Reel · 1:04". */
export function caseKind(media: CaseStudy["media"]): string {
  const { kinds } = cases;
  if (media.kind === "film") return `${kinds.film} · ${media.video.length}`;
  const count = media.videos.length;
  if (media.clips) return `${count} ${kinds.clips}`;
  return count === 1 ? `${kinds.reel} · ${media.videos[0].length}` : `${count} ${kinds.reels}`;
}

/** One of a case's facts, by its label, such as its year. */
export function caseFact(study: CaseStudy, label: string): string | undefined {
  return study.facts.find((fact) => fact.label === label)?.value;
}

/**
 * A case on the home page's rail: its still, the brand and year, its line,
 * the challenge it came with, and the result. The still and the link open
 * the case's own page, where its videos play.
 */
export function CaseCard({ study }: { study: CaseStudy }) {
  const href = `/work/${study.id}`;
  const year = caseFact(study, "Year");
  return (
    <article
      aria-labelledby={`${study.id}-title`}
      className="group flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-line bg-elevated"
    >
      <Link
        href={href}
        tabIndex={-1}
        aria-hidden="true"
        className="work-media relative block h-[clamp(9rem,24svh,13.5rem)] shrink-0 overflow-hidden"
      >
        <Image
          src={asset(study.card.image)}
          alt=""
          fill
          unoptimized
          sizes="(min-width: 64rem) 20rem, 82vw"
          className="object-cover"
          style={{ objectPosition: study.card.position }}
        />
        <span className="work-tag">{caseKind(study.media)}</span>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[0.8125rem] text-fg-3">
          <span className="font-medium text-fg">{study.name}</span>
          {year && <> · {year}</>}
        </p>
        <h3 id={`${study.id}-title`} className="display mt-2 text-[1.3125rem] leading-[1.12] text-fg">
          {study.line}
        </h3>
        <p className="mt-2.5 line-clamp-3 text-[0.875rem] leading-[1.55] text-fg-2">{study.challenge[0]}</p>
        <span className="sr-only">{study.card.alt}</span>
        <p className="mt-3 text-[0.8125rem] leading-snug">
          <span className="text-fg-3">{cases.resultLabel}: </span>
          <span className="font-medium text-fg">{study.result}</span>
        </p>
        <div className="mt-auto flex flex-wrap items-center gap-x-5 pt-3">
          <TextLink href={href} className="text-[0.875rem]">
            {cases.more}
          </TextLink>
        </div>
      </div>
    </article>
  );
}
