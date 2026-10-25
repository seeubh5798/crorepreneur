import { proof } from "@/content/site";
import { TextLink } from "@/components/ui/Button";
import { CountUp } from "@/components/ui/CountUp";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The track record, on one screen: the four numbers on the left, the Forbes
 * India feature on a lavender panel on the right. Type only, with no Forbes
 * logo or photography.
 */
export function Proof() {
  const { press } = proof;
  return (
    <section id="proof" aria-labelledby="proof-title" className="screen scheme-dark relative py-14 lg:py-20">
      <div className="shell grid gap-x-12 gap-y-9 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-5">
          <Reveal>
            <p className="section-label">{proof.label}</p>
            <h2 id="proof-title" className="section-title mt-6 lg:mt-[min(2rem,3svh)]">
              {proof.title}
            </h2>
          </Reveal>
          <Reveal delay={60}>
            <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-5 lg:mt-[min(2.5rem,4svh)] lg:gap-y-[min(2rem,3.5svh)]">
              {proof.highlights.map((highlight) => (
                <div key={highlight.label} className="flex flex-col border-t border-line pt-4">
                  <dt className="order-2 mt-2 text-[0.8125rem] text-fg-3">{highlight.label}</dt>
                  <dd className="display tabular order-1 text-[clamp(2.25rem,min(5vw,7svh),3.5rem)] leading-none text-fg">
                    <CountUp metric={highlight} />
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <Reveal delay={100} className="lg:col-span-7">
          <article
            aria-labelledby="press-outlet"
            className="scheme-accent rounded-[1.75rem] px-5 py-7 sm:rounded-[2rem] sm:px-10 sm:py-9 lg:px-11 lg:py-[min(3rem,5.5svh)]"
          >
            <p className="section-label">{press.label}</p>
            <h3 id="press-outlet" className="display mt-4 text-[clamp(3rem,min(7vw,11svh),7rem)] leading-[0.9] text-fg">
              {press.outlet}
            </h3>
            <div className="mt-5 grid gap-x-8 gap-y-4 border-t border-line-strong pt-5 sm:mt-6 sm:pt-6 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
              <div>
                <p className="text-[1.0625rem] font-medium text-fg">{press.honour}</p>
                <p className="mt-2 text-[0.875rem] leading-[1.55] text-fg-2">“{press.headline}”</p>
                <p className="mt-1.5 text-[0.8125rem] text-fg-3">{press.date}</p>
              </div>
              <div>
                <blockquote>
                  <p className="serif text-[clamp(1.375rem,min(2.2vw,3.4svh),1.875rem)] leading-[1.18] text-fg">
                    “{press.quote}”
                  </p>
                  <footer className="mt-3 text-[0.875rem] text-fg-2">{press.by}</footer>
                </blockquote>
                <TextLink href={press.link.href} external className="mt-3">
                  {press.link.label}
                </TextLink>
              </div>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
