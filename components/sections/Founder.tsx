import Image from "next/image";
import type { CSSProperties } from "react";
import { founder, founderSection, site } from "@/content/site";
import { asset } from "@/lib/assets";
import { TextLink } from "@/components/ui/Button";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The founder, in her own frame: a portrait set like a story on her feed,
 * then her note, signature and the way the agency works.
 */
export function Founder() {
  const { image } = founder;
  const src = asset(image.src);

  return (
    <section id="founder" aria-labelledby="founder-title" className="screen relative py-14 lg:py-20">
      <div className="shell">
        <Reveal>
          <p className="section-label">{founderSection.label}</p>
        </Reveal>
      </div>
      <div className="shell mt-7 grid items-center gap-x-10 gap-y-9 lg:mt-[min(2.5rem,3svh)] lg:grid-cols-12">
        {/* Portrait frame */}
        <Reveal className="lg:col-span-5">
          <figure className="relative mx-auto w-full max-w-[17rem] sm:max-w-[22rem] lg:max-w-[min(28rem,calc((100svh-15rem)*0.8))]">
            <div className="founder-frame relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-line">
              <div aria-hidden="true" className="founder-backdrop absolute inset-0" />
              <p
                aria-hidden="true"
                className="serif founder-masthead absolute inset-x-0 top-[max(15%,4.25rem)] text-center"
              >
                {founder.firstName}
              </p>
              <div
                className="portrait-cutout cover-figure absolute bottom-0 left-1/2 w-[112%] -translate-x-1/2"
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
        <div className="lg:col-span-7 lg:col-start-6 xl:col-span-6 xl:col-start-7">
          <Reveal>
            <h2 id="founder-title" className="section-title">
              {founderSection.title}
            </h2>
            <blockquote className="mt-6 max-w-[36rem] font-serif text-[clamp(1.5rem,6.2vw,2.625rem)] leading-[1.1] tracking-[-0.01em] text-fg lg:mt-[min(1.75rem,2.6svh)] lg:max-w-[38rem] lg:text-[clamp(1.375rem,min(2.5vw,3.8svh),2.375rem)]">
              “{founderSection.quote}”
            </blockquote>
            <div className="mt-5 flex max-w-[34rem] flex-col gap-4 text-base leading-[1.6] text-fg-2 sm:mt-7 sm:text-[1.0625rem] lg:mt-[min(1.75rem,2.6svh)] lg:gap-[min(1rem,1.6svh)] lg:text-[clamp(0.9375rem,2.15svh,1.0625rem)]">
              {/* On phones, the first paragraph; the rest is on the About page. */}
              {founderSection.bio.map((paragraph, index) => (
                <p key={paragraph} className={index > 0 ? "max-sm:hidden" : undefined}>
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap items-end gap-x-8 gap-y-4 sm:mt-8 lg:mt-[min(1.75rem,2.6svh)]">
              <div>
                <p
                  aria-hidden="true"
                  className="serif text-[3rem] leading-[0.8] text-fg lg:text-[clamp(2.25rem,4.5svh,3rem)]"
                >
                  {founder.firstName}
                </p>
                <p className="mt-2 text-[0.9375rem] text-fg">{founder.name}</p>
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
              <TextLink href={site.about.href}>{founderSection.aboutLink}</TextLink>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <ul className="mt-8 lg:mt-[min(2.25rem,3.4svh)] lg:grid lg:grid-cols-3 lg:gap-x-6">
              {founderSection.principles.map((principle) => (
                <li
                  key={principle.name}
                  className="grid gap-x-6 gap-y-1 border-t border-line py-4 last:border-b sm:py-5 sm:grid-cols-[9rem_1fr] lg:block lg:pb-0 lg:pt-[min(1.125rem,1.8svh)] lg:last:border-b-0"
                >
                  <h3 className="font-medium text-fg">{principle.name}</h3>
                  <p className="text-[0.9375rem] leading-[1.6] text-fg-2 lg:mt-1.5 lg:text-[0.875rem] lg:leading-[1.55]">
                    {principle.text}
                  </p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
