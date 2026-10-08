import Image from "next/image";
import type { CSSProperties } from "react";
import { founder, founderSection } from "@/content/site";
import { asset } from "@/lib/assets";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The founder, in her own frame: a portrait set like a story on her feed,
 * with the 3D layer's objects circling behind it, then her note, signature
 * and the way the agency works.
 */
export function Founder() {
  const { image } = founder;
  const src = asset(image.src);

  return (
    <section id="founder" data-stage="founder" aria-labelledby="founder-title" className="relative py-16 lg:py-28">
      <div className="shell grid items-center gap-x-10 gap-y-12 lg:grid-cols-12">
        {/* Portrait frame */}
        <Reveal className="lg:col-span-5">
          <figure className="relative mx-auto w-full max-w-[28rem]">
            <div
              data-anchor="founder-frame"
              className="founder-frame relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-line"
            >
              <div aria-hidden="true" className="founder-backdrop absolute inset-0" />
              <p aria-hidden="true" className="display founder-masthead absolute inset-x-0 top-[15%] text-center italic">
                {founder.firstName}
              </p>
              <div
                className="portrait-cutout cover-figure absolute bottom-0 left-1/2 h-[68%] -translate-x-1/2"
                style={
                  {
                    aspectRatio: image.aspect,
                    "--cover-mask": `url("${src}")`,
                    "--fade-start": "70%",
                    "--fade-end": "100%",
                    "--side-fade": `${image.sideFade * 100}%`,
                  } as CSSProperties
                }
              >
                <Image
                  src={src}
                  alt={image.alt}
                  fill
                  unoptimized
                  sizes="28rem"
                  className="object-contain object-bottom"
                />
              </div>

              {/* Story bar and handle, like a post on her own feed */}
              <div aria-hidden="true" className="absolute inset-x-4 top-4 flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="story-bar" style={{ "--i": i } as CSSProperties}>
                    <span />
                  </span>
                ))}
              </div>
              <div className="absolute left-4 top-8 flex items-center gap-2.5 rounded-full bg-black/25 py-1.5 pl-1.5 pr-3.5 backdrop-blur-md">
                <span className="relative block size-7 overflow-hidden rounded-full border border-white/70">
                  <Image
                    src={src}
                    alt=""
                    fill
                    unoptimized
                    sizes="56px"
                    className="object-cover"
                    style={{
                      objectPosition: image.avatar.position,
                      transform: `scale(${image.avatar.scale})`,
                      transformOrigin: image.avatar.position,
                    }}
                  />
                </span>
                <span className="text-[0.8125rem] font-medium text-white">{founder.instagram.user}</span>
              </div>
            </div>
            <figcaption className="mt-4 flex items-center justify-between text-sm text-fg-2">
              <span>{founder.role}</span>
              <a
                href={founder.instagram.href}
                target="_blank"
                rel="noreferrer"
                className="link-underline inline-flex items-center gap-2 py-1 text-fg"
              >
                <InstagramIcon size={15} />
                {founder.instagram.handle}
              </a>
            </figcaption>
          </figure>
        </Reveal>

        {/* Note */}
        <div className="lg:col-span-6 lg:col-start-7">
          <Reveal>
            <h2 id="founder-title" className="section-title">
              {founderSection.title}
            </h2>
            <blockquote className="display mt-8 max-w-[34rem] text-[clamp(1.75rem,4.6vw,2.5rem)] leading-[1.12] text-fg">
              “{founderSection.quote}”
            </blockquote>
            <div className="mt-7 flex max-w-[34rem] flex-col gap-4 text-[1.0625rem] leading-[1.6] text-fg-2">
              {founderSection.bio.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-end gap-x-8 gap-y-5">
              <div>
                <p aria-hidden="true" className="font-display text-[3rem] italic leading-[0.8] text-fg">
                  {founder.firstName}
                </p>
                <p className="mt-2 text-[0.9375rem] text-fg-2">
                  <span className="text-fg">{founder.name}</span>, {founder.role}
                </p>
              </div>
              <a
                href={founder.instagram.href}
                target="_blank"
                rel="noreferrer"
                className="arrow-host inline-flex h-11 items-center gap-2.5 rounded-full border border-line-strong px-5 text-sm font-medium text-fg transition-colors duration-300 hover:border-fg"
              >
                <InstagramIcon size={16} />
                {founderSection.follow}
              </a>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <ul className="mt-12">
              {founderSection.principles.map((principle) => (
                <li
                  key={principle.name}
                  className="grid gap-x-6 gap-y-1 border-t border-line py-5 last:border-b sm:grid-cols-[9rem_1fr]"
                >
                  <h3 className="font-medium text-fg">{principle.name}</h3>
                  <p className="text-[0.9375rem] leading-[1.6] text-fg-2">{principle.text}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
