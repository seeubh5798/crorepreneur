import { careers } from "@/content/site";
import { applyHref } from "@/lib/careers";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The careers page: a short opening on who we are, then each open role on
 * its own card, with what the work is, who it suits, and what to know. The
 * Apply button at its foot opens a pop-up on how to apply (ApplyDialog);
 * without script it opens the email straight away.
 */
export function Careers() {
  const { role } = careers;
  const href = applyHref();

  return (
    <>
      <section
        aria-labelledby="careers-title"
        className="scheme-ink relative isolate overflow-hidden pb-14 pt-12 lg:pb-20 lg:pt-16"
      >
        <div aria-hidden="true" className="cover-glow -z-10" />
        <div className="shell">
          <Reveal>
            <h1 id="careers-title" className="section-label">
              {careers.title}
            </h1>
            <p className="display mt-6 text-[clamp(2.75rem,9vw,6rem)] leading-[0.95] text-fg lg:mt-8">
              <span className="block">{careers.headline[0]}</span>
              <span className="serif block text-[1.06em] text-accent-text">{careers.headline[1]}</span>
            </p>
            <p className="mt-6 max-w-[38rem] text-[1.0625rem] leading-[1.6] text-fg-2 lg:mt-8">{careers.intro}</p>
          </Reveal>
        </div>
      </section>

      <section aria-label={careers.rolesLabel} className="scheme-dark relative border-t border-line py-14 lg:py-20">
        <div className="shell">
          <Reveal>
            <p className="section-label">{careers.rolesLabel}</p>
          </Reveal>
          <Reveal delay={60} className="mt-7 lg:mt-9">
            <article
              aria-labelledby="role-title"
              className="rounded-[1.75rem] border border-line bg-elevated p-6 sm:p-9 lg:p-12"
            >
              <div>
                <ul className="flex flex-wrap gap-2">
                  {role.tags.map((tag) => (
                    <li
                      key={tag}
                      className="inline-flex min-h-8 items-center rounded-full border border-line-strong px-3.5 text-[0.8125rem] text-fg-2"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
                <h2 id="role-title" className="display mt-5 text-[clamp(2.25rem,6vw,4rem)] leading-none text-fg">
                  {role.title}
                </h2>
                <p className="mt-4 max-w-[38rem] text-[1.0625rem] leading-[1.6] text-fg-2">{role.team}</p>
              </div>

              <div className="mt-9 grid gap-9 border-t border-line pt-8 lg:mt-10 lg:grid-cols-12 lg:gap-x-12">
                <div className="lg:col-span-7">
                  <h3 className="text-sm font-medium text-accent-text">{role.doesLabel}</h3>
                  <ul className="hook-list mt-4 flex flex-col gap-3 text-[0.9375rem] leading-[1.55] text-fg">
                    {role.does.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="lg:col-span-5">
                  <h3 className="text-sm font-medium text-accent-text">{role.looksForLabel}</h3>
                  <ul className="hook-list mt-4 flex flex-col gap-3 text-[0.9375rem] leading-[1.55] text-fg">
                    {role.looksFor.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <h3 className="mt-8 text-sm font-medium text-accent-text">{role.goodLabel}</h3>
                  <ul className="hook-list mt-4 flex flex-col gap-3 text-[0.9375rem] leading-[1.55] text-fg-2">
                    {role.good.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-9 flex flex-col gap-5 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between lg:mt-10">
                <p className="display text-[1.5rem] leading-tight text-fg">{role.apply.lead}</p>
                <div className="shrink-0">
                  <Button href={href} opens="apply">
                    {role.apply.label}
                  </Button>
                </div>
              </div>
            </article>
          </Reveal>
        </div>
      </section>
    </>
  );
}
