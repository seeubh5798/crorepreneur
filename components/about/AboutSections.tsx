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
 * with, the founder, the tech behind Crorepreneur in a band under her (with
 * his portrait, smaller than hers), what we believe, and the way to start a
 * campaign.
 */
export function AboutSections() {
  return (
    <>
      <Opening />
      <Audiences />
      <Founder />
      <Tech />
      <Beliefs />
      <Close />
    </>
  );
}

function Opening() {
  return (
    <section
      aria-labelledby="about-title"
      className="screen scheme-ink relative isolate overflow-hidden pb-14 pt-12 lg:pb-20 lg:pt-14"
    >
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
        <Reveal delay={80} className="mt-8 lg:mt-[min(4rem,6svh)] lg:grid lg:grid-cols-12">
          <p className="text-[1.1875rem] leading-[1.6] text-fg-2 lg:col-span-7 lg:col-start-6">{about.intro}</p>
        </Reveal>
      </div>
    </section>
  );
}

function Audiences() {
  return (
    <section aria-labelledby="audience-title" className="screen relative py-14 lg:py-20">
      <div className="shell">
        <Reveal>
          <p className="section-label">{about.audienceLabel}</p>
          <h2 id="audience-title" className="section-title mt-6 max-w-[50rem] lg:mt-[min(2rem,3svh)]">
            {about.audienceTitle}
          </h2>
        </Reveal>
        <ul className="mt-7 grid gap-3 sm:gap-5 lg:mt-[min(2.5rem,4svh)] lg:grid-cols-2">
          {about.audiences.map((audience, index) => {
            const Arrow = index === 0 ? ArrowDownRight : ArrowUpRight;
            return (
              <li key={audience.id}>
                <Reveal delay={index * 80} className="h-full">
                  <article className="flex h-full flex-col rounded-[1.5rem] border border-line bg-elevated p-6 sm:p-9 lg:p-[min(2.75rem,4.5svh)]">
                    <p className="flex items-center gap-2 text-sm font-medium text-accent-text">
                      <Arrow aria-hidden="true" size={16} strokeWidth={1.75} />
                      {audience.direction}
                    </p>
                    <h3 className="display mt-5 text-[clamp(1.75rem,3.2vw,2.5rem)] sm:mt-8 leading-[1.04] text-fg lg:mt-[min(2rem,3svh)] lg:text-[clamp(1.625rem,min(2.6vw,4svh),2.5rem)]">
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
          <p className="mt-7 text-[0.9375rem] leading-[1.7] text-fg-3 sm:mt-10 lg:mt-[min(2.5rem,4svh)]">
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
    <section aria-labelledby="founder-name" className="screen scheme-dark relative py-14 lg:py-20">
      <div className="shell">
        <Reveal>
          <p className="section-label">{about.founderLabel}</p>
        </Reveal>

        <div className="mt-7 grid items-center gap-x-12 gap-y-8 lg:mt-[min(2.5rem,3svh)] lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            {/* The same studio frame as the founder's portrait on the home page */}
            <div className="relative mx-auto aspect-[4/5] w-full max-w-[17rem] overflow-hidden rounded-[2rem] border border-line sm:max-w-[22rem] lg:max-w-[min(30rem,calc((100svh-13rem)*0.8))]">
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
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/**
 * The tech behind Crorepreneur: a band under her section, with his portrait
 * on the left, smaller than hers, and his note on the right.
 */
function Tech() {
  const { tech } = about;
  return (
    <section
      aria-labelledby="tech-name"
      className="scheme-dark relative border-t border-line py-12 lg:py-[min(4.5rem,8svh)]"
    >
      <div className="shell grid items-center gap-x-12 gap-y-8 lg:grid-cols-12">
        <Reveal className="lg:col-span-3">
          <div className="relative aspect-[4/5] w-44 overflow-hidden rounded-[1.5rem] border border-line sm:w-52 lg:w-full lg:max-w-[17rem]">
            <Image
              src={asset(tech.image.src)}
              alt={tech.image.alt}
              fill
              unoptimized
              sizes="(min-width: 64rem) 17rem, 13rem"
              className="object-cover"
            />
            <p className="absolute bottom-3 left-3 rounded-full bg-black/45 px-3 py-1.5 text-[0.75rem] font-medium text-white backdrop-blur-md">
              {tech.badge}
            </p>
          </div>
        </Reveal>
        <Reveal delay={80} className="lg:col-span-8 lg:col-start-5">
          <p className="section-label">{tech.label}</p>
          <h2 id="tech-name" className="display mt-6 text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.05] text-fg">
            {tech.name}
          </h2>
          <p className="mt-5 max-w-[44rem] text-[1.0625rem] leading-[1.7] text-fg-2">{tech.text}</p>
          <div className="mt-5 flex flex-wrap gap-x-7">
            {tech.links.map((link) => (
              <TextLink key={link.href} href={link.href} external>
                {link.label}
              </TextLink>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Beliefs() {
  return (
    <section aria-labelledby="beliefs-title" className="screen scheme-accent relative py-14 lg:py-20">
      <div className="shell">
        <Reveal>
          <p className="section-label">{about.beliefsLabel}</p>
          <h2 id="beliefs-title" className="section-title mt-6 lg:mt-[min(2rem,3svh)]">
            {about.beliefsTitle}
          </h2>
        </Reveal>
        <Reveal delay={80}>
          {/* Phones: a row of cards that swipes sideways. From tablets up: one panel, split into two or four. */}
          <ul
            tabIndex={0}
            aria-label={about.beliefsTitle}
            className="-mx-5 mt-7 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:mt-10 sm:grid sm:grid-cols-2 sm:gap-px sm:overflow-hidden sm:rounded-[1.5rem] sm:border sm:border-line sm:bg-line sm:px-0 lg:mt-[min(2.5rem,4svh)] lg:grid-cols-4"
          >
            {about.beliefs.map((belief, index) => (
              <li
                key={belief.title}
                className="w-[78vw] max-w-[20rem] shrink-0 snap-start rounded-[1.25rem] border border-line bg-bg p-6 sm:w-auto sm:max-w-none sm:rounded-none sm:border-0 sm:p-9 lg:p-[min(2.25rem,3.5svh)]"
              >
                <p aria-hidden="true" className="tabular text-[0.8125rem] text-fg-3">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="display mt-5 text-[clamp(1.75rem,3vw,2.375rem)] leading-[1.04] sm:mt-8 tracking-[-0.035em] text-fg lg:mt-[min(2rem,3svh)] lg:text-[clamp(1.375rem,min(1.9vw,3.2svh),2rem)]">
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
    <section
      aria-labelledby="about-cta-title"
      className="screen scheme-ink relative isolate overflow-hidden py-14 lg:py-20"
    >
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
