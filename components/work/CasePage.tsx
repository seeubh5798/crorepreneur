import { ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cases, type CaseImage, type CaseStudy } from "@/content/site";
import { asset } from "@/lib/assets";
import { TextLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { CasePlayer } from "./CasePlayer";
import { StoryParts } from "./StoryParts";

type CasePageProps = { study: CaseStudy; next: CaseStudy };

/**
 * A case study's own page: its video across the top, starting by itself;
 * the brand, its line and the facts; the story in three parts, from the
 * challenge to the results; the next case; and the way to start one.
 */
export function CasePage({ study, next }: CasePageProps) {
  return (
    <>
      <Opening study={study} />
      <Story study={study} />
      <Next study={next} />
      <FinalCTA />
    </>
  );
}

/**
 * The video across the full width at the top, then the name and its line
 * beside the facts (one under the other on phones).
 */
function Opening({ study }: { study: CaseStudy }) {
  const { page } = cases;
  const film = study.media.kind === "film";
  const videos = study.media.kind === "film" ? [study.media.video] : study.media.videos;

  return (
    <section aria-labelledby="case-title" className="scheme-ink relative isolate overflow-hidden">
      <CasePlayer
        name={study.name}
        videos={videos}
        shape={film ? "wide" : "tall"}
        labels={
          study.media.kind === "reels" && study.media.clips
            ? { ...page.player, reels: page.player.clips, next: page.player.nextClip }
            : page.player
        }
      />
      <div className="shell grid grid-cols-1 gap-y-8 border-t border-line pb-12 pt-8 lg:grid-cols-12 lg:gap-x-12 lg:pb-[min(4.5rem,7svh)] lg:pt-[min(3rem,5svh)]">
        <Reveal className="lg:col-span-7">
          <p className="section-label">{page.label}</p>
          <h1 id="case-title" className="case-title display mt-6 text-fg lg:mt-[min(1.5rem,2.4svh)]">
            {study.name}
          </h1>
          <p className="case-lede mt-5 text-fg-2 lg:mt-[min(1.25rem,2svh)]">{study.line}</p>
        </Reveal>
        <Reveal delay={60} className="lg:col-span-5">
          <dl className="case-facts">
            {study.facts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
            <div data-result="">
              <dt>{cases.resultLabel}</dt>
              <dd>{study.result}</dd>
            </div>
          </dl>
        </Reveal>
      </div>
    </section>
  );
}

/** The story, in three parts side by side from laptop width up, one under another below it. */
function Story({ study }: { study: CaseStudy }) {
  const { page } = cases;
  const image = study.media.kind === "reels" ? study.media.image : undefined;
  const parts = [
    { id: "challenge", label: page.story.challenge, body: <Paragraphs texts={study.challenge} /> },
    { id: "solution", label: page.story.solution, body: <Paragraphs texts={study.solution} /> },
    { id: "results", label: page.story.results, body: <Results results={study.results} image={image} /> },
  ];

  return (
    <section aria-labelledby="story-title" className="screen scheme-dark relative border-t border-line py-14 lg:py-20">
      <div className="shell">
        <Reveal>
          <h2 id="story-title" className="section-label">
            {page.storyLabel}
          </h2>
        </Reveal>
        <Reveal delay={60}>
          <StoryParts parts={parts} />
        </Reveal>

        {study.links.length > 0 && (
          <Reveal className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-1 border-t border-line pt-5 lg:mt-[min(2.5rem,4svh)]">
            <p className="w-full text-sm text-fg-3 sm:w-auto">{page.originals}</p>
            {study.links.map((link) => (
              <TextLink key={link.href} href={link.href} external className="text-sm">
                {link.label}
              </TextLink>
            ))}
          </Reveal>
        )}
      </div>
    </section>
  );
}

function Paragraphs({ texts }: { texts: readonly string[] }) {
  return (
    <div className="story-text flex flex-col gap-[0.8em]">
      {texts.map((text) => (
        <p key={text}>{text}</p>
      ))}
    </div>
  );
}

function Results({ results, image }: { results: CaseStudy["results"]; image?: CaseImage }) {
  return (
    <div className="story-text flex flex-col gap-[1em]">
      {results.points && (
        <ul className="hook-list flex flex-col gap-[0.6em] text-fg">
          {results.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      )}
      {results.text?.map((text) => (
        <p key={text}>{text}</p>
      ))}
      {image && (
        <figure className="mt-2">
          <a
            href={image.original.href}
            target="_blank"
            rel="noopener noreferrer"
            className="case-still block max-w-[18rem]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset(image.src)} alt={image.alt} loading="lazy" decoding="async" width={720} height={720} />
          </a>
          <figcaption className="mt-2.5 flex flex-wrap items-center gap-x-3 text-[0.8125rem] text-fg-2">
            {image.caption}
            <a
              href={image.original.href}
              target="_blank"
              rel="noopener noreferrer"
              className="arrow-host inline-flex min-h-9 items-center gap-1 font-medium text-fg"
            >
              <span className="link-underline pb-0.5">{image.original.label}</span>
              <ArrowUpRight aria-hidden="true" size={14} strokeWidth={1.75} />
            </a>
          </figcaption>
        </figure>
      )}
    </div>
  );
}

/** The next case, as one large link with its still. */
function Next({ study }: { study: CaseStudy }) {
  return (
    <section aria-label={cases.page.next} className="scheme-dark border-t border-line py-12 lg:py-20">
      <div className="shell">
        <Link href={`/work/${study.id}`} className="case-next arrow-host group">
          <span className="min-w-0">
            <span className="section-label">{cases.page.next}</span>
            <span className="display mt-5 block text-[clamp(1.75rem,8.2vw,4.5rem)] leading-[0.98] [overflow-wrap:anywhere] text-fg sm:mt-6">
              {study.name}
            </span>
            <span className="mt-4 block max-w-xl text-[1.0625rem] leading-[1.55] text-fg-2">{study.line}</span>
            <span className="mt-7 inline-flex items-center gap-2 text-[0.9375rem] font-medium text-fg">
              <span className="link-underline pb-0.5">{cases.more}</span>
              <span aria-hidden="true" className="arrow-swap">
                <ArrowRight size={16} strokeWidth={1.75} />
                <ArrowRight size={16} strokeWidth={1.75} />
              </span>
            </span>
          </span>
          <span className="work-media case-next-media">
            <Image
              src={asset(study.card.image)}
              alt=""
              fill
              unoptimized
              sizes="(min-width: 48rem) 22rem, 92vw"
              className="object-cover"
              style={{ objectPosition: study.card.position }}
            />
          </span>
        </Link>
      </div>
    </section>
  );
}
