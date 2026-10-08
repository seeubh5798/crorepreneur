import Image from "next/image";
import type { CSSProperties } from "react";
import { founder, hero, site } from "@/content/site";
import { asset } from "@/lib/assets";
import { Button, TextLink } from "@/components/ui/Button";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { TypeLines } from "@/components/ui/TypeLines";
import { ENQUIRY_FALLBACK_HREF } from "@/lib/enquiry";

/**
 * The cover. The masthead runs across the top, clear of everything; the
 * founder stands under it in the middle of the frame, sized to the space
 * left, so she never covers a letter or the headline beside her. The headline
 * types itself out; the 3D layer turns a gyroscope of satin rings behind her
 * and parks the phone at her shoulder. As the page scrolls she sinks into the
 * dark (see ScrollStory).
 *
 * The entrance is pure CSS, so it plays at first paint without script.
 */
export function Hero() {
  const { image } = founder;
  const src = asset(image.src);

  return (
    <section id="top" data-stage="hero" className="cover relative isolate overflow-clip">
      {/* ---- Visual layer: masthead, light, portrait */}
      <div className="cover-visual relative h-[76svh] min-h-[30rem] lg:absolute lg:inset-0 lg:h-auto">
        <div aria-hidden="true" data-cover-masthead className="cover-masthead absolute inset-x-0 flex justify-center">
          <p className="masthead display whitespace-nowrap">
            <span className="masthead-rise">
              <span className="italic">{site.wordmark.lead}</span>
              {site.wordmark.tail}
            </span>
          </p>
        </div>

        <div aria-hidden="true" className="cover-spot absolute" />

        <div className="absolute inset-x-0 bottom-0 flex justify-center">
          <div data-cover-portrait className="cover-portrait relative" style={{ aspectRatio: image.aspect }}>
            <div
              className="cover-figure portrait-cutout relative size-full"
              style={{ "--cover-mask": `url("${src}")` } as CSSProperties}
            >
              <Image
                src={src}
                alt={image.alt}
                fill
                unoptimized
                loading="eager"
                fetchPriority="high"
                sizes="(min-width: 64rem) 40rem, 90vw"
                className="object-contain object-bottom"
              />
              {/* Low-key grade and the scroll shade, both masked to her silhouette */}
              <span aria-hidden="true" className="cover-grade absolute inset-0" />
              <span aria-hidden="true" data-cover-shade className="cover-shade absolute inset-0" />
            </div>

            {/* Slots the 3D layer reads: the rings orbit her head; the phone waits at her shoulder. */}
            <span aria-hidden="true" data-anchor="halo" className="absolute left-[14%] right-[14%] top-[6%] h-[48%]" />
            <span
              aria-hidden="true"
              data-anchor="phone-hero"
              className="absolute right-[-9%] top-[13%] aspect-[76/156] h-[27%] lg:right-[-6%] lg:top-[28%] lg:h-[34%]"
            />
          </div>
        </div>
      </div>

      {/* ---- Copy layer */}
      {/* On wide screens the copy never starts above the masthead's lowest stroke. */}
      <div
        data-cover-copy
        className="shell relative z-10 -mt-[15svh] pb-10 lg:mt-0 lg:flex lg:min-h-svh lg:flex-col lg:justify-end lg:pb-12 lg:pt-[calc(var(--masthead-bottom)+1.5rem)]"
      >
        <div className="grid items-end gap-y-10 lg:grid-cols-12 lg:gap-x-6">
          <div className="lg:col-span-4">
            <h1 className="display text-[clamp(3.1rem,13.5vw,4.6rem)] leading-[0.92] text-fg lg:text-[clamp(3.25rem,min(5.6vw,8.5svh),6rem)]">
              <span className="sr-only">
                {site.name}. {hero.headline.join(" ")}
              </span>
              <TypeLines lines={hero.headline} start={350} />
            </h1>
            <p
              className="load-fade mt-6 max-w-[26rem] text-[1.0625rem] leading-[1.6] text-fg-2"
              style={{ "--d": "450ms" } as CSSProperties}
            >
              {hero.body}
            </p>
            <div
              className="load-fade mt-8 flex flex-wrap items-center gap-x-7 gap-y-2"
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

          {/* Cover lines, set like a magazine's */}
          <div
            className="load-fade hidden lg:col-span-3 lg:col-start-10 lg:block"
            style={{ "--d": "680ms" } as CSSProperties}
          >
            <div className="cover-note mb-10">
              <p className="font-display text-[1.75rem] italic leading-none text-fg">{founder.name}</p>
              <p className="mt-2 text-sm text-fg-2">{founder.role}</p>
              <a
                href={founder.instagram.href}
                target="_blank"
                rel="noreferrer"
                className="link-underline mt-3 inline-flex items-center gap-2 py-1 text-sm text-fg"
              >
                <InstagramIcon size={15} />
                {founder.instagram.handle}
              </a>
            </div>
            <ul className="text-right">
              {hero.coverLines.map((line) => (
                <li key={line} className="border-t border-line py-3 text-sm text-fg-2 last:border-b">
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="load-in mt-12 hidden items-center justify-center gap-3 text-xs text-fg-3 lg:flex"
          style={{ "--d": "1000ms" } as CSSProperties}
        >
          <span className="scroll-cue" />
          Scroll
        </div>
      </div>
    </section>
  );
}
