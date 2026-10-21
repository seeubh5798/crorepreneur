import Image from "next/image";
import { work } from "@/content/site";
import { asset } from "@/lib/assets";
import { cn } from "@/lib/cn";
import { TextLink } from "@/components/ui/Button";
import { RailButtons } from "@/components/ui/RailButtons";
import { Reveal } from "@/components/ui/Reveal";

type Card = {
  id: string;
  client: string;
  kind: string;
  date: string;
  title: string;
  summary: string;
  quote?: string;
  stats?: readonly { figure: string; label: string }[];
  image: { src: string; alt: string; position?: string };
  link: { label: string; href: string };
  also?: { label: string; href: string };
};

/** Every case on one rail, film launch first and the page it started on last. */
const CARDS: Card[] = [
  { ...work.featured, quote: work.featuredQuote.text },
  ...work.campaigns,
  ...work.strategy,
  {
    id: "yourregularmom",
    client: work.channel.handle,
    kind: work.channel.kind,
    date: work.channel.date,
    title: work.channel.title,
    summary: work.channel.summary,
    stats: work.channel.stats,
    image: work.channel.image,
    link: work.channel.link,
  },
];

/**
 * The work, on one screen: the heading and the buttons on the left, every
 * case on a rail that runs off the right edge. The rail swipes on touch,
 * scrolls on a trackpad, and steps a card at a time with the buttons.
 */
export function Work() {
  return (
    <section
      id="work"
      aria-labelledby="work-title"
      className="screen scheme-dark relative overflow-x-clip border-t border-line py-20"
    >
      <div className="shell lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-10">
        <div className="lg:col-span-3">
          <Reveal>
            <p className="section-label">{work.label}</p>
          </Reveal>
          <Reveal className="mt-8 lg:mt-[min(2rem,3svh)]">
            <h2 id="work-title" className="section-title">
              {work.title}
            </h2>
            <p className="mt-4 max-w-[26rem] text-[0.9375rem] leading-[1.6] text-fg-2">{work.intro}</p>
            <RailButtons target="work-rail" prev={work.prev} next={work.next} className="mt-7" />
          </Reveal>
        </div>

        <Reveal delay={80} className="mt-10 lg:col-span-9 lg:mt-0">
          <div id="work-rail" role="region" aria-label={work.railLabel} tabIndex={0} className="case-rail">
            <ul className="case-track">
              {CARDS.map((card) => (
                <li key={card.id}>
                  <CaseCard card={card} />
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function CaseCard({ card }: { card: Card }) {
  return (
    <article
      aria-labelledby={`${card.id}-title`}
      className="group flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-line bg-elevated"
    >
      <a
        href={card.link.href}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={-1}
        aria-hidden="true"
        className="work-media relative block h-[clamp(9rem,24svh,13.5rem)] shrink-0 overflow-hidden"
      >
        <Image
          src={asset(card.image.src)}
          alt=""
          fill
          unoptimized
          sizes="(min-width: 64rem) 20rem, 82vw"
          className="object-cover"
          style={{ objectPosition: card.image.position }}
        />
        <span className="work-tag">{card.kind}</span>
      </a>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[0.8125rem] text-fg-3">
          <span className="font-medium text-fg">{card.client}</span> · {card.date}
        </p>
        <h3 id={`${card.id}-title`} className="display mt-2 text-[1.3125rem] leading-[1.12] text-fg">
          {card.title}
        </h3>
        <p className="mt-2.5 line-clamp-3 text-[0.875rem] leading-[1.55] text-fg-2">{card.summary}</p>
        <span className="sr-only">{card.image.alt}</span>
        {card.quote && <p className="serif mt-2.5 text-[1.125rem] leading-snug text-fg">“{card.quote}”</p>}
        <Stats stats={card.stats} className="mt-3" />
        <div className="mt-auto flex flex-wrap items-center gap-x-5 pt-3">
          <TextLink href={card.link.href} external className="text-[0.875rem]">
            {card.link.label}
          </TextLink>
          {card.also && (
            <TextLink href={card.also.href} external className="text-[0.875rem] text-fg-2">
              {card.also.label}
            </TextLink>
          )}
        </div>
      </div>
    </article>
  );
}

/** Numbers from a post, such as "3,157 likes · 89 comments". */
function Stats({ stats, className }: { stats?: readonly { figure: string; label: string }[]; className?: string }) {
  if (!stats?.length) return null;
  return (
    <ul className={cn("flex flex-wrap gap-x-4 gap-y-1 text-[0.8125rem]", className)}>
      {stats.map((stat) => (
        <li key={stat.label}>
          <span className="tabular font-medium text-fg">{stat.figure}</span>{" "}
          <span className="text-fg-3">{stat.label}</span>
        </li>
      ))}
    </ul>
  );
}
