import { capabilities } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The one service, hyperlocal campaigns, as a single open panel: what it is
 * on the left, what a campaign includes on the right, and what it is made
 * for underneath. On narrow screens the three parts stack.
 */
export function Capabilities() {
  const { offering } = capabilities;

  return (
    <section id="services" aria-labelledby="services-title" className="relative py-16 lg:py-24">
      <div className="shell">
        <Reveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h2 id="services-title" className="section-title">
            {capabilities.title}
          </h2>
          <p className="max-w-[26rem] text-fg-2 md:text-right">{capabilities.intro}</p>
        </Reveal>

        <Reveal delay={80} className="mt-10 lg:mt-14">
          <article
            aria-labelledby="offering-name"
            className="relative grid gap-10 border-y border-line bg-elevated px-5 py-8 sm:px-8 lg:grid-cols-[1.1fr_1fr] lg:gap-x-16 lg:px-10 lg:py-12"
          >
            {/* The line of brand colour that marks an open panel */}
            <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px" style={{ background: "var(--brand-line)" }} />

            <div>
              <h3 id="offering-name" className="text-[0.9375rem] font-medium text-fg">
                {offering.name}
              </h3>
              <p className="display mt-6 max-w-[30rem] text-[2.25rem] leading-[1.04] text-fg sm:text-[2.75rem] lg:text-[3.25rem]">
                {offering.statement}
              </p>
              <p className="mt-6 max-w-[32rem] text-[1rem] leading-[1.65] text-fg-2">{offering.body}</p>
            </div>

            <div>
              <p className="text-[0.8125rem] text-fg-3">{offering.includesLabel}</p>
              <ol className="mt-3 text-[0.9375rem] text-fg-2">
                {offering.includes.map((item, index) => (
                  <li key={item} className="flex gap-4 border-t border-line py-3">
                    <span aria-hidden="true" className="tabular w-6 shrink-0 text-fg-3">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="flex flex-col gap-3 border-t border-line pt-6 lg:col-span-2 lg:flex-row lg:items-center lg:gap-6">
              <p className="shrink-0 text-[0.8125rem] text-fg-3">{offering.madeForLabel}</p>
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
          </article>
        </Reveal>
      </div>
    </section>
  );
}
