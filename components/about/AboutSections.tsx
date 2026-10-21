import Image from "next/image";
import type { CSSProperties } from "react";
import { about, hero } from "@/content/site";
import { asset } from "@/lib/assets";
import { ENQUIRY_FALLBACK_HREF } from "@/lib/enquiry";
import { Button, TextLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { BackLink } from "./BackLink";

/**
 * The About page: Chabi's line on resonance, how Crorepreneur got here, the
 * two people behind it, what they believe, and the way to start a campaign.
 */
export function AboutSections() {
  return (
    <>
      <Opening />
      <Story />
      <Team />
      <Beliefs />
      <Close />
    </>
  );
}

function Opening() {
  return (
    <section aria-labelledby="about-title" className="relative pb-16 pt-14 lg:pb-24 lg:pt-20">
      <div className="shell">
        <Reveal>
          <h1 id="about-title" className="text-sm text-fg-3">
            {about.title}
          </h1>
          <p className="display mt-6 text-[clamp(3.25rem,10.5vw,8.75rem)] leading-[0.92] text-fg">
            {about.headline.map((line, index) => (
              <span key={line} className={index === 1 ? "block italic" : "block"}>
                {line}
              </span>
            ))}
          </p>
          <p className="mt-6 flex items-center gap-3 text-[0.9375rem] text-fg-2">
            <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
            {about.headlineBy}
          </p>
        </Reveal>
        <Reveal delay={80} className="mt-12 lg:mt-16 lg:grid lg:grid-cols-12">
          <p className="text-[1.1875rem] leading-[1.6] text-fg-2 lg:col-span-7 lg:col-start-6">{about.intro}</p>
        </Reveal>
      </div>
    </section>
  );
}

function Story() {
  return (
    <section aria-labelledby="story-title" className="relative py-16 lg:py-24">
      <div className="shell grid gap-10 lg:grid-cols-12 lg:gap-x-10">
        <Reveal className="lg:col-span-4">
          <h2 id="story-title" className="section-title">
            {about.storyTitle}
          </h2>
          <p className="mt-4 max-w-[22rem] text-fg-2">{about.storyIntro}</p>
        </Reveal>
        <ol className="lg:col-span-8">
          {about.story.map((step, index) => (
            <li key={step.year} className="border-t border-line last:border-b">
              <Reveal delay={index * 60} className="grid gap-x-8 gap-y-2 py-7 sm:grid-cols-[7.5rem_1fr]">
                <p className="display tabular text-[2.75rem] leading-none text-fg">{step.year}</p>
                <div>
                  <h3 className="text-[1.0625rem] font-medium text-fg">{step.title}</h3>
                  <p className="mt-2 max-w-[36rem] text-[0.9375rem] leading-[1.6] text-fg-2">{step.text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
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

function Team() {
  return (
    <section aria-labelledby="team-title" className="relative py-16 lg:py-24">
      <div className="shell">
        <Reveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h2 id="team-title" className="section-title">
            {about.teamTitle}
          </h2>
          <p className="max-w-[26rem] text-fg-2 md:text-right">{about.teamIntro}</p>
        </Reveal>

        <div className="mt-10 grid gap-x-10 gap-y-16 lg:mt-14 lg:grid-cols-2">
          {about.team.map((person, index) => (
            <Reveal key={person.id} delay={index * 90}>
              <article aria-labelledby={`${person.id}-name`}>
                {/* The same studio frame as the founder's portrait on the home page */}
                <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-line">
                  <div aria-hidden="true" className="founder-backdrop absolute inset-0" />
                  <p aria-hidden="true" className="display founder-masthead absolute inset-x-0 top-[7%] text-center italic">
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
                      sizes="(min-width: 64rem) 36rem, 92vw"
                      className="object-contain object-top"
                    />
                  </div>
                  <p className="absolute bottom-5 left-5 rounded-full bg-black/40 px-3.5 py-1.5 text-[0.8125rem] font-medium text-white backdrop-blur-md">
                    {person.badge}
                  </p>
                </div>

                <div className="mt-7 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 id={`${person.id}-name`} className="display text-[clamp(2rem,3.4vw,2.5rem)] leading-none text-fg">
                    {person.name}
                  </h3>
                  <p className="text-sm text-fg-2">{person.role}</p>
                </div>
                <p className="mt-3 text-[1.0625rem] text-fg">{person.line}</p>
                <div className="mt-4 flex flex-col gap-3 text-[0.9375rem] leading-[1.65] text-fg-2">
                  {person.bio.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                <ul className="mt-6 text-[0.875rem] text-fg-2">
                  {person.credentials.map((credential) => (
                    <li key={credential} className="border-t border-line py-2.5 last:border-b">
                      {credential}
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex flex-wrap gap-x-7">
                  {person.links.map((link) => (
                    <TextLink key={link.href} href={link.href} external>
                      {link.label}
                    </TextLink>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Beliefs() {
  return (
    <section aria-labelledby="beliefs-title" className="relative py-16 lg:py-24">
      <div className="shell">
        <Reveal>
          <h2 id="beliefs-title" className="section-title">
            {about.beliefsTitle}
          </h2>
        </Reveal>
        <Reveal delay={80}>
          <ul className="mt-10 grid gap-px overflow-hidden rounded-[1.5rem] border border-line bg-line sm:grid-cols-2 lg:mt-14">
            {about.beliefs.map((belief, index) => (
              <li key={belief.title} className="bg-bg p-7 sm:p-9 lg:p-11">
                <p aria-hidden="true" className="tabular text-[0.8125rem] text-fg-3">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="display mt-8 text-[clamp(1.75rem,3vw,2.375rem)] leading-[1.06] text-fg">{belief.title}</h3>
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
    <section aria-labelledby="about-cta-title" className="relative pb-16 pt-8 lg:pb-24">
      <div className="shell">
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-[2rem] border border-line bg-elevated px-6 py-12 sm:px-12 sm:py-14 lg:px-16 lg:py-16">
            <div
              aria-hidden="true"
              className="glow pointer-events-none -z-10"
              style={{
                right: "-10%",
                bottom: "-80%",
                width: "65%",
                height: "160%",
                background: "radial-gradient(closest-side, var(--glow-a), transparent 72%)",
              }}
            />
            <h2 id="about-cta-title" className="display max-w-[40rem] text-[clamp(2.5rem,6vw,4.5rem)] leading-[1] text-fg">
              {about.ctaTitle}
            </h2>
            <p className="mt-5 max-w-[30rem] text-[1.0625rem] leading-[1.6] text-fg-2">{about.ctaBody}</p>
            <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3">
              <Button href={ENQUIRY_FALLBACK_HREF} enquiry>
                {hero.primaryCta.label}
              </Button>
              <BackLink label={about.back} />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
