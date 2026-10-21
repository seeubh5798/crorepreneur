import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { founder, hero, site } from "@/content/site";
import { asset } from "@/lib/assets";
import { Button, TextLink } from "@/components/ui/Button";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { TypeLines } from "@/components/ui/TypeLines";
import { ENQUIRY_FALLBACK_HREF } from "@/lib/enquiry";

/**
 * The cover, on the dark ground. Under a line in spaced capitals, the headline
 * types itself out on the left, its last word in the serif voice; the founder
 * stands in a soft violet spotlight on the right; the pitch, its key words
 * picked out, and the two actions sit at the bottom left. Along the bottom
 * edge, the brands we have worked with run on a slow loop. As the page
 * scrolls she sinks a little and the copy lifts away (see ScrollStory).
 *
 * The entrance is pure CSS, so it plays at first paint without script.
 */
export function Hero() {
  const { image } = founder;
  const src = asset(image.src);

  return (
    <section id="top" className="scheme-ink cover relative isolate flex min-h-svh flex-col overflow-clip">
      <div aria-hidden="true" className="cover-glow" />

      <div className="shell relative grid flex-1 grid-cols-[minmax(0,1fr)] pt-[calc(var(--header-h)+1.5rem)] lg:grid-cols-12 lg:gap-x-6 lg:pt-[calc(var(--header-h)+min(2.5rem,2svh))]">
        {/* ---- Copy */}
        <div data-cover-copy className="relative z-10 flex flex-col lg:col-span-7 lg:pb-[min(3rem,5svh)]">
          <p
            className="load-fade text-[0.8125rem] font-semibold uppercase tracking-[0.22em] text-accent-text lg:text-[clamp(0.875rem,1.9svh,1.0625rem)]"
            style={{ "--d": "120ms" } as CSSProperties}
          >
            {hero.eyebrow}
          </p>
          <h1 className="cover-headline display mt-5 text-[clamp(3.6rem,16vw,5.5rem)] leading-[0.95] text-fg lg:mt-[min(1.75rem,2.2svh)] lg:text-[clamp(4rem,min(8.6vw,14svh),8.5rem)] lg:leading-[0.92]">
            <span className="sr-only">
              {site.name}. {hero.headline.join(" ")}
            </span>
            <TypeLines lines={hero.headline} start={350} />
          </h1>

          <div className="mt-10 lg:mt-auto">
            <p
              className="load-fade max-w-[30rem] text-[1.0625rem] leading-[1.6] text-fg-2"
              style={{ "--d": "450ms" } as CSSProperties}
            >
              {highlight(hero.body, hero.bodyHighlight)}
            </p>
            <div
              className="load-fade mt-8 flex flex-wrap items-center gap-x-7 gap-y-3 lg:mt-[min(2rem,3.5svh)]"
              style={{ "--d": "560ms" } as CSSProperties}
            >
              <Button href={ENQUIRY_FALLBACK_HREF} enquiry>
                {hero.primaryCta.label}
              </Button>
              <TextLink href={hero.secondaryCta.href} direction="down">
                {hero.secondaryCta.label}
              </TextLink>
            </div>
          </div>
        </div>

        {/* ---- The founder, in the spotlight. Her card sits under the photo on
             phones and tablets, and on its lower corner on wider screens. */}
        <div className="relative mt-12 flex justify-center lg:col-span-5 lg:mt-0 lg:items-end lg:justify-end">
          <div data-cover-portrait className="relative flex w-full origin-bottom flex-col items-center lg:w-auto">
            <div className="cover-portrait relative" style={{ aspectRatio: image.aspect }}>
              <div className="cover-figure portrait-cutout relative size-full">
                <Image
                  src={src}
                  alt={image.alt}
                  fill
                  unoptimized
                  loading="eager"
                  fetchPriority="high"
                  sizes="(min-width: 64rem) 36rem, 80vw"
                  className="object-contain object-bottom"
                />
              </div>
            </div>
            <div
              className="load-fade relative mt-3 w-full max-w-[30rem] rounded-2xl border border-line bg-[rgba(10,10,12,0.66)] px-4 py-3 backdrop-blur-md lg:absolute lg:bottom-8 lg:-right-2 lg:mt-0 lg:w-auto lg:max-w-none"
              style={{ "--d": "760ms" } as CSSProperties}
            >
              <p className="serif text-[1.375rem] leading-none text-fg">{founder.name}</p>
              <p className="mt-1.5 text-[0.8125rem] text-fg-3">{founder.role}</p>
              <ul className="mt-2.5 border-t border-line pt-2.5 text-[0.8125rem] leading-snug text-fg-2">
                {founder.credentials.map((credential) => (
                  <li key={credential}>{credential}</li>
                ))}
              </ul>
              <a
                href={founder.instagram.href}
                target="_blank"
                rel="noreferrer"
                className="link-underline mt-1.5 inline-flex items-center gap-1.5 text-[0.8125rem] text-fg"
              >
                <InstagramIcon size={13} />
                {founder.instagram.handle}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ---- The brands we have worked with, on a loop. The list is read once, plainly. */}
      <div className="load-in relative border-t border-line" style={{ "--d": "850ms" } as CSSProperties}>
        <div className="shell flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:gap-8 lg:py-[min(1.25rem,2.4svh)]">
          <p className="serif shrink-0 text-[1.125rem] leading-none text-fg-2">{hero.clientsLabel}</p>
          <div className="marquee marquee-brands min-w-0 flex-1">
            <ul className="sr-only">
              {hero.clients.map((client) => (
                <li key={client}>{client}</li>
              ))}
            </ul>
            <div aria-hidden="true" className="marquee-track">
              {[0, 1].map((copy) => (
                <ul key={copy} className="marquee-group">
                  {/* Twice per group, so the band stays full on the widest screens. */}
                  {[...hero.clients, ...hero.clients].map((client, index) => (
                    <li key={`${client}-${index}`} className="brand-item">
                      {client}
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** The text with `words` picked out, or the plain text if they are not in it. */
function highlight(text: string, words: string): ReactNode {
  const at = text.indexOf(words);
  if (at < 0) return text;
  return (
    <>
      {text.slice(0, at)}
      <strong className="cover-highlight">{words}</strong>
      {text.slice(at + words.length)}
    </>
  );
}
