import { cta, site } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { Reveal } from "@/components/ui/Reveal";

/** The close: one crore, set large, and the call to start a campaign. */
export function FinalCTA() {
  const mailto = `mailto:${site.contact.email}?subject=${encodeURIComponent(site.contact.subject)}`;

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="relative pb-16 pt-16 lg:pb-20 lg:pt-24"
    >
      <div className="shell">
        <div
          className="contact-panel relative isolate overflow-hidden rounded-[2rem] border border-line px-6 py-12 sm:px-12 sm:py-14 lg:px-16 lg:py-16"
        >
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
            <div
              className="glow"
              style={{
                right: "-12%",
                bottom: "-70%",
                width: "70%",
                height: "150%",
                background: "radial-gradient(closest-side, var(--glow-a), transparent 72%)",
              }}
            />
          </div>

          <p
            aria-hidden="true"
            className="crore-figure display tabular mb-8 text-[clamp(3.25rem,13vw,10.5rem)] leading-none sm:mb-10 lg:mb-12"
          >
            {cta.figure}
          </p>

          <div className="grid items-end gap-x-10 gap-y-10 lg:grid-cols-12">
            <Reveal className="lg:col-span-8">
              <h2
                id="contact-title"
                className="display text-[clamp(2.75rem,11vw,4rem)] leading-[0.98] text-fg md:text-[clamp(4rem,6.2vw,5.75rem)]"
              >
                {cta.headline.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h2>
              <p className="mt-6 max-w-[30rem] text-[1.0625rem] leading-[1.6] text-fg-2">{cta.body}</p>
              <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Button href={mailto} enquiry>
                  {cta.button}
                </Button>
                <CopyEmail email={site.contact.email} />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
