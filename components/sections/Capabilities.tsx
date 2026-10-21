import Image from "next/image";
import { capabilities } from "@/content/site";
import { asset } from "@/lib/assets";
import { Reveal } from "@/components/ui/Reveal";

/** Stills from the work, shown beside the offering. */
const STILLS = [
  {
    src: "/images/work/sunrise-chhath.webp",
    alt: "Anita Gupta preparing for Chhath, for ITC Sunrise",
    position: "50% 38%",
  },
  {
    src: "/images/work/jewellery-jharkhand.webp",
    alt: "A mother and daughter in a Jharkhand jewellery showroom",
    position: "50% 40%",
  },
  {
    src: "/images/work/jharkhand-tourism.webp",
    alt: "Creators at Jharkhand's State Level Influencer Meet",
    position: "50% 50%",
  },
];

/**
 * The one service, hyperlocal campaigns, as a full-width lavender band: the
 * offer and what a campaign includes on the left, stills from the work on a
 * dark card on the right, with what it is made for under them.
 */
export function Capabilities() {
  const { offering } = capabilities;

  return (
    <section id="services" aria-labelledby="services-title" className="screen screen-flush relative pt-20">
      <div className="shell">
        <Reveal>
          <p className="section-label">{capabilities.label}</p>
        </Reveal>
        <Reveal className="mt-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between lg:mt-[min(1.5rem,2.5svh)]">
          <h2 id="services-title" className="section-title">
            {capabilities.title}
          </h2>
          <p className="max-w-[26rem] text-fg-2 md:text-right">{capabilities.intro}</p>
        </Reveal>
      </div>

      <div className="scheme-accent mt-12 py-12 lg:mt-[min(2.5rem,3svh)] lg:flex lg:flex-1 lg:items-center lg:py-[min(3.25rem,5svh)]">
        <article aria-labelledby="offering-name" className="shell grid gap-10 lg:grid-cols-12 lg:gap-x-12">
          <Reveal className="lg:col-span-7">
            <h3
              id="offering-name"
              className="display text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.98] text-fg lg:text-[clamp(2.5rem,min(5vw,8svh),4rem)]"
            >
              {offering.name}
            </h3>
            <p className="display mt-5 text-[clamp(1.375rem,2.4vw,1.875rem)] leading-[1.15] tracking-[-0.03em] text-fg lg:mt-[min(1.25rem,2svh)] lg:text-[clamp(1.25rem,min(2.2vw,3.4svh),1.875rem)]">
              {offering.statement}
            </p>
            <p className="mt-5 max-w-xl text-[1rem] leading-[1.65] text-fg-2 lg:mt-[min(1.25rem,2svh)] lg:max-w-[40rem] lg:text-[clamp(0.9375rem,2.1svh,1rem)]">
              {offering.body}
            </p>

            <p className="mt-8 text-[0.8125rem] text-fg-3 lg:mt-[min(1.75rem,2.6svh)]">{offering.includesLabel}</p>
            <ul className="hook-list mt-3 flex flex-col gap-2.5 text-[0.9375rem] text-fg lg:grid lg:grid-cols-2 lg:gap-x-8 lg:gap-y-2">
              {offering.includes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={80} className="flex flex-col gap-6 lg:col-span-5 lg:gap-[min(1.5rem,2.5svh)]">
            <figure className="scheme-ink grid min-h-80 grid-cols-2 grid-rows-2 gap-2 rounded-[1.5rem] p-2 lg:min-h-0 lg:flex-1">
              {STILLS.map((still, index) => (
                <div
                  key={still.src}
                  className={
                    index === 0
                      ? "relative row-span-2 overflow-hidden rounded-lg"
                      : "relative overflow-hidden rounded-lg"
                  }
                >
                  <Image
                    src={asset(still.src)}
                    alt={still.alt}
                    fill
                    unoptimized
                    sizes="(min-width: 64rem) 16rem, 45vw"
                    className="object-cover"
                    style={{ objectPosition: still.position }}
                  />
                </div>
              ))}
            </figure>

            <div className="flex flex-col gap-3 border-t border-line pt-5 lg:pt-[min(1.25rem,2svh)]">
              <p className="text-[0.8125rem] text-fg-3">{offering.madeForLabel}</p>
              <ul className="flex flex-wrap gap-2">
                {offering.madeFor.map((use) => (
                  <li
                    key={use}
                    className="inline-flex min-h-9 items-center rounded-full border border-line-strong px-3.5 text-[0.8125rem] text-fg-2"
                  >
                    {use}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </article>
      </div>
    </section>
  );
}
