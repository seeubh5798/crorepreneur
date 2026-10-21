import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import type { CSSProperties } from "react";
import { about, hero } from "@/content/site";
import { asset } from "@/lib/assets";
import { ENQUIRY_FALLBACK_HREF } from "@/lib/enquiry";
import { Button, TextLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { BackLink } from "./BackLink";

/**
 * The About page: Chabi's line on resonance, the two kinds of brands we work
 * with, the founder (with the tech behind Crorepreneur in a short note under
 * her), what we believe, and the way to start a campaign.
 */
export function AboutSections() {
  return (
    <>
      <Opening />
      <Audiences />
      <Founder />
      <Beliefs />
      <Close />
    </>
  );
}

function Opening() {
  return (
    <section aria-labelledby="about-title" className="screen scheme-ink relative isolate overflow-hidden pb-20 pt-14">
      <div aria-hidden="true" className="cover-glow -z-10" />
      <div className="shell">
        <Reveal>
          <h1 id="about-title" className="section-label">
            {about.title}
          </h1>
          <p className="display mt-8 text-[clamp(3.25rem,10.5vw,8.5rem)] leading-[0.94] text-fg lg:mt-[min(2.5rem,3svh)] lg:text-[clamp(3.5rem,min(9vw,13svh),8.5rem)]">
            {about.headline.map((line, index) => (
              <span key={line} className={index === 1 ? "serif block text-accent-text" : "block"}>
                {line}
              </span>
            ))}
          </p>
          <p className="mt-6 flex items-center gap-3 text-[0.9375rem] text-fg-2">
            <span aria-hidden="true" className="h-px w-8 bg-accent-text" />
            {about.headlineBy}
          </p>
        </Reveal>
        <Reveal delay={80} className="mt-12 lg:mt-[min(4rem,6svh)] lg:grid lg:grid-cols-12">
          <p className="text-[1.1875rem] leading-[1.6] text-fg-2 lg:col-span-7 lg:col-start-6">{about.intro}</p>
        </Reveal>
      </div>
    </section>
  );
}

function Audiences() {
  return (
    <section aria-labelledby="audience-title" className="screen relative py-20">
      <div className="shell">
        <Reveal>
          <p className="section-label">{about.audienceLabel}</p>
          <h2 id="audience-title" className="section-title mt-8 max-w-[50rem] lg:mt-[min(2rem,3svh)]">
            {about.audienceTitle}
          </h2>
        </Reveal>
        <ul className="mt-10 grid gap-5 lg:mt-[min(2.5rem,4svh)] lg:grid-cols-2">
          {about.audiences.map((audience, index) => {
            const Arrow = index === 0 ? ArrowDownRight : ArrowUpRight;
            return (
              <li key={audience.id}>
                <Reveal delay={index * 80} className="h-full">
                  <article className="flex h-full flex-col rounded-[1.5rem] border border-line bg-elevated p-7 sm:p-9 lg:p-[min(2.75rem,4.5svh)]">
                    <p className="flex items-center gap-2 text-sm font-medium text-accent-text">
                      <Arrow aria-hidden="true" size={16} strokeWidth={1.75} />
                      {audience.direction}
                    </p>
                    <h3 className="display mt-8 text-[clamp(1.875rem,3.2vw,2.5rem)] leading-[1.04] text-fg lg:mt-[min(2rem,3svh)] lg:text-[clamp(1.625rem,min(2.6vw,4svh),2.5rem)]">
                      {audience.title}
                    </h3>
                    <p className="mt-4 max-w-[30rem] text-[1rem] leading-[1.65] text-fg-2">{audience.text}</p>
                  </article>
                </Reveal>
              </li>
            );
          })}
        </ul>
        <Reveal delay={120}>
          <p className="mt-10 text-[0.9375rem] leading-[1.7] text-fg-3 lg:mt-[min(2.5rem,4svh)]">
            <span className="serif mr-2 text-[1.125rem] text-fg-2">{about.brandsLabel}</span>
            {about.brands.join(" · ")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/**
 * The fade for a portrait: it melts into the backdrop over its last stretch
 * in the frame (or the frame's bottom, if it runs past it), and at its sides.
 * The mask is measured on the figure, so frame heights are converted.
 */
function fadeMask(image: { top: number; height: number; sideFade: number }) {
  const bottom = Math.min(1, image.top + image.height);
  const onFigure = (frame: number) => `${(((frame - image.top) / image.height) * 100).toFixed(1)}%`;
  return {
    "--fade-start": onFigure(bottom - 0.16),
    "--fade-end": onFigure(bottom),
    "--side-fade": `${image.sideFade * 100}%`,
  };
}

function Founder() {
  const person = about.founder;
  return (
    <section aria-labelledby="founder-name" className="screen scheme-dark relative py-20">
      <div className="shell">
        <Reveal>
          <p className="section-label">{about.founderLabel}</p>
        </Reveal>

        <div className="mt-10 grid items-center gap-x-12 gap-y-10 lg:mt-[min(2.5rem,3svh)] lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            {/* The same studio frame as the founder's portrait on the home page */}
            <div className="relative mx-auto aspect-[4/5] w-full max-w-[30rem] overflow-hidden rounded-[2rem] border border-line lg:max-w-[min(30rem,calc((100svh-13rem)*0.8))]">
              <div aria-hidden="true" className="founder-backdrop absolute inset-0" />
              <p aria-hidden="true" className="serif founder-masthead absolute inset-x-0 top-[7%] text-center">
                {person.name.split(" ")[0]}
              </p>
              <div
                className="portrait-cutout absolute left-1/2 -translate-x-1/2"
                style={
                  {
                    top: `${person.image.top * 100}%`,
                    height: `${person.image.height * 100}%`,
                    aspectRatio: person.image.aspect,
                    ...fadeMask(person.image),
                  } as CSSProperties
                }
              >
                <Image
                  src={asset(person.image.src)}
                  alt={person.image.alt}
                  fill
                  unoptimized
                  sizes="(min-width: 64rem) 30rem, 92vw"
                  className="object-contain object-top"
                />
              </div>
              <p className="absolute bottom-5 left-5 rounded-full bg-black/45 px-3.5 py-1.5 text-[0.8125rem] font-medium text-white backdrop-blur-md">
                {person.badge}
              </p>
            </div>
          </Reveal>

          <Reveal delay={80} className="lg:col-span-7 lg:col-start-6 xl:col-span-6 xl:col-start-7">
            <h2 id="founder-name" className="section-title">
              {person.name}
            </h2>
            <p className="mt-3 text-[0.9375rem] font-medium text-accent-text">{person.role}</p>
            <div className="mt-7 flex max-w-[34rem] flex-col gap-4 text-[1.0625rem] leading-[1.65] text-fg-2 lg:mt-[min(1.75rem,2.6svh)] lg:text-[clamp(0.9375rem,2.15svh,1.0625rem)]">
              {person.bio.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-x-7">
              {person.links.map((link) => (
                <TextLink key={link.href} href={link.href} external>
                  {link.label}
                </TextLink>
              ))}
            </div>
            <Tech />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/** The tech behind Crorepreneur: a short note under hers, without a photo. */
function Tech() {
  const { tech } = about;
  return (
    <aside
      aria-labelledby="tech-name"
      className="mt-10 max-w-[34rem] border-t border-line pt-6 lg:mt-[min(2.5rem,4svh)]"
    >
      <p className="text-sm font-medium text-accent-text">{tech.label}</p>
      <h3 id="tech-name" className="display mt-2 text-[1.375rem] leading-tight text-fg">
        {tech.name}
      </h3>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
        <p className="text-[0.9375rem] leading-[1.6] text-fg-2">{tech.text}</p>
        <TextLink href={tech.link.href} external className="shrink-0">
          {tech.link.label}
        </TextLink>
      </div>
    </aside>
  );
}

function Beliefs() {
  return (
    <section aria-labelledby="beliefs-title" className="screen scheme-accent relative py-20">
      <div className="shell">
        <Reveal>
          <p className="section-label">{about.beliefsLabel}</p>
          <h2 id="beliefs-title" className="section-title mt-8 lg:mt-[min(2rem,3svh)]">
            {about.beliefsTitle}
          </h2>
        </Reveal>
        <Reveal delay={80}>
          <ul className="mt-10 grid gap-px overflow-hidden rounded-[1.5rem] border border-line bg-line sm:grid-cols-2 lg:mt-[min(2.5rem,4svh)] lg:grid-cols-4">
            {about.beliefs.map((belief, index) => (
              <li key={belief.title} className="bg-bg p-7 sm:p-9 lg:p-[min(2.25rem,3.5svh)]">
                <p aria-hidden="true" className="tabular text-[0.8125rem] text-fg-3">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="display mt-8 text-[clamp(1.75rem,3vw,2.375rem)] leading-[1.04] tracking-[-0.035em] text-fg lg:mt-[min(2rem,3svh)] lg:text-[clamp(1.375rem,min(1.9vw,3.2svh),2rem)]">
                  {belief.title}
                </h3>
                <p className="mt-4 max-w-[28rem] text-[0.9375rem] leading-[1.6] text-fg-2">{belief.text}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

function Close() {
  return (
    <section aria-labelledby="about-cta-title" className="screen scheme-ink relative isolate overflow-hidden py-20">
      <div
        aria-hidden="true"
        className="glow -z-10"
        style={{
          right: "-18%",
          bottom: "-55%",
          width: "70%",
          height: "120%",
          background: "radial-gradient(closest-side, var(--glow-a), transparent 72%)",
        }}
      />
      <div className="shell">
        <Reveal>
          <h2
            id="about-cta-title"
            className="display max-w-[56rem] text-[clamp(3rem,8.4vw,6rem)] leading-[0.98] text-fg lg:text-[clamp(2.75rem,min(6.4vw,9svh),6rem)]"
          >
            {about.ctaTitle}
          </h2>
          <p className="mt-6 max-w-lg text-[1.0625rem] leading-[1.6] text-fg-2">{about.ctaBody}</p>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Button href={ENQUIRY_FALLBACK_HREF} size="lg" enquiry>
              {hero.primaryCta.label}
            </Button>
            <BackLink label={about.back} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
