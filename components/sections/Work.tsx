import Image from "next/image";
import { work, type CaseStudy } from "@/content/site";
import { asset } from "@/lib/assets";
import { cn } from "@/lib/cn";
import { TextLink } from "@/components/ui/Button";
import { CountUp } from "@/components/ui/CountUp";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The work: the numbers first, then a featured film launch, the brand
 * campaigns, the strategy projects, and the page it all started on beside the
 * press. Every number comes from the post itself. Rows of cards are a
 * swipeable rail on phones and a grid from tablets up.
 */
export function Work() {
  const { featured, featuredQuote, channel, press } = work;

  return (
    <section id="work" aria-labelledby="work-title" className="relative py-16 lg:py-24">
      <div className="shell">
        <Reveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h2 id="work-title" className="section-title">
            {work.title}
          </h2>
          <p className="max-w-[26rem] text-fg-2 md:text-right">{work.intro}</p>
        </Reveal>

        {/* ---- The numbers */}
        <Reveal delay={60}>
          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 lg:mt-14 lg:grid-cols-4">
            {work.highlights.map((highlight) => (
              <div key={highlight.label} className="flex flex-col border-t border-line pt-5">
                <dt className="order-2 mt-2 text-[0.8125rem] text-fg-3">{highlight.label}</dt>
                <dd className="display tabular order-1 text-[clamp(2.5rem,6vw,3.75rem)] leading-none text-fg">
                  <CountUp metric={highlight} />
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        {/* ---- Featured: the film launch */}
        <Reveal className="mt-16 lg:mt-24">
          <article aria-labelledby={`${featured.id}-title`} className="group grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-14">
            <a
              href={featured.link.href}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={-1}
              aria-hidden="true"
              className="work-media relative block aspect-[16/9] overflow-hidden rounded-[1.5rem] border border-line bg-elevated lg:col-span-7"
            >
              <Image
                src={asset(featured.image.src)}
                alt=""
                fill
                unoptimized
                sizes="(min-width: 64rem) 46rem, 100vw"
                className="object-cover"
              />
              <span className="work-tag">{featured.kind}</span>
            </a>
            <div className="lg:col-span-5">
              <p className="text-[0.8125rem] text-fg-3">
                <span className="font-medium text-fg">{featured.client}</span> · {featured.date}
              </p>
              <h3 id={`${featured.id}-title`} className="display mt-3 text-[clamp(2rem,4.2vw,3rem)] leading-[1.04] text-fg">
                {featured.title}
              </h3>
              <p className="mt-5 text-[1rem] leading-[1.65] text-fg-2">{featured.summary}</p>
              <span className="sr-only">{featured.image.alt}</span>
              <Stats stats={featured.stats} className="mt-6" />
              <blockquote className="mt-6 border-l border-line-strong pl-4">
                <p className="display text-[1.375rem] italic leading-snug text-fg">“{featuredQuote.text}”</p>
                <footer className="mt-1.5 text-[0.8125rem] text-fg-3">{featuredQuote.by}</footer>
              </blockquote>
              <TextLink href={featured.link.href} external className="mt-5">
                {featured.link.label}
              </TextLink>
            </div>
          </article>
        </Reveal>

        <Row title={work.campaignsTitle} studies={work.campaigns} shape="portrait" />
        <Row title={work.strategyTitle} studies={work.strategy} shape="landscape" />

        {/* ---- The page it started on, and the press */}
        <div className="mt-16 grid gap-6 lg:mt-24 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <article className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-line bg-elevated">
              <a
                href={channel.link.href}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={-1}
                aria-hidden="true"
                className="work-media relative block aspect-[16/9] overflow-hidden"
              >
                <Image
                  src={asset(channel.image.src)}
                  alt=""
                  fill
                  unoptimized
                  sizes="(min-width: 64rem) 46rem, 100vw"
                  className="object-cover"
                />
              </a>
              <div className="flex flex-1 flex-col p-6 sm:p-8">
                <p className="flex items-center gap-2 text-[0.875rem] font-medium text-fg">
                  <InstagramIcon size={15} />
                  {channel.handle}
                </p>
                <p className="mt-1 text-[0.8125rem] text-fg-3">{channel.names}</p>
                <h3 className="display mt-5 text-[1.875rem] leading-[1.08] text-fg">{channel.title}</h3>
                <p className="mt-3 text-[0.9375rem] leading-[1.6] text-fg-2">{channel.summary}</p>
                <span className="sr-only">{channel.image.alt}</span>
                <Stats stats={channel.stats} className="mt-5" />
                <div className="mt-auto pt-5">
                  <TextLink href={channel.link.href} external>
                    {channel.link.label}
                  </TextLink>
                </div>
              </div>
            </article>
          </Reveal>

          <Reveal delay={80} className="lg:col-span-5">
            <article className="flex h-full flex-col rounded-[1.5rem] border border-line p-6 sm:p-8">
              <p className="text-[0.8125rem] text-fg-3">
                <span className="font-medium text-fg">{press.outlet}</span> · {press.date}
              </p>
              <h3 className="mt-4 text-[1.0625rem] font-medium leading-snug text-fg">{press.headline}</h3>
              <blockquote className="my-auto py-8">
                <span aria-hidden="true" className="display block text-[4rem] leading-[0.6] text-accent-text">
                  “
                </span>
                <p className="display mt-2 text-[clamp(1.5rem,2.6vw,2rem)] leading-[1.15] text-fg">{press.quote}</p>
                <footer className="mt-4 text-[0.8125rem] text-fg-3">{press.by}</footer>
              </blockquote>
              <div>
                <TextLink href={press.link.href} external>
                  {press.link.label}
                </TextLink>
              </div>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/** A titled row of case studies. */
function Row({ title, studies, shape }: { title: string; studies: readonly CaseStudy[]; shape: "portrait" | "landscape" }) {
  return (
    <div className="mt-16 lg:mt-24">
      <Reveal>
        <h3 className="border-b border-line pb-4 text-[1.0625rem] font-medium text-fg">{title}</h3>
      </Reveal>
      <ul className="work-rail mt-8">
        {studies.map((study, index) => (
          <li key={study.id}>
            <Reveal delay={index * 70} className="h-full">
              <Card study={study} shape={shape} />
            </Reveal>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Card({ study, shape }: { study: CaseStudy; shape: "portrait" | "landscape" }) {
  return (
    <article aria-labelledby={`${study.id}-title`} className="group flex h-full flex-col">
      <a
        href={study.link.href}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={-1}
        aria-hidden="true"
        className={cn(
          "work-media relative block overflow-hidden rounded-[1.25rem] border border-line bg-elevated",
          shape === "portrait" ? "aspect-[4/5]" : "aspect-[16/10]",
        )}
      >
        <Image
          src={asset(study.image.src)}
          alt=""
          fill
          unoptimized
          sizes="(min-width: 64rem) 25rem, (min-width: 40rem) 45vw, 82vw"
          className="object-cover"
          style={{ objectPosition: study.image.position }}
        />
        <span className="work-tag">{study.kind}</span>
      </a>
      <p className="mt-5 text-[0.8125rem] text-fg-3">
        <span className="font-medium text-fg">{study.client}</span> · {study.date}
      </p>
      <h4 id={`${study.id}-title`} className="display mt-2 text-[1.625rem] leading-[1.1] text-fg">
        {study.title}
      </h4>
      <p className="mt-3 text-[0.9375rem] leading-[1.6] text-fg-2">{study.summary}</p>
      <span className="sr-only">{study.image.alt}</span>
      {study.facts && <p className="mt-3 text-[0.8125rem] text-fg-3">{study.facts.join(" · ")}</p>}
      <Stats stats={study.stats} className="mt-4" />
      <div className="mt-auto flex flex-wrap items-center gap-x-6 pt-4">
        <TextLink href={study.link.href} external>
          {study.link.label}
        </TextLink>
        {study.also && (
          <TextLink href={study.also.href} external className="text-fg-2">
            {study.also.label}
          </TextLink>
        )}
      </div>
    </article>
  );
}

/** Numbers from a post, such as "3,157 likes · 89 comments". */
function Stats({ stats, className }: { stats?: readonly { figure: string; label: string }[]; className?: string }) {
  if (!stats?.length) return null;
  return (
    <ul className={cn("flex flex-wrap gap-x-5 gap-y-1 text-[0.875rem]", className)}>
      {stats.map((stat) => (
        <li key={stat.label}>
          <span className="tabular font-medium text-fg">{stat.figure}</span>{" "}
          <span className="text-fg-3">{stat.label}</span>
        </li>
      ))}
    </ul>
  );
}
