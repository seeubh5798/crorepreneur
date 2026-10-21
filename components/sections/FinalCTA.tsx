import { cta, site } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The close, on the dark ground: one crore in satin, the line it all comes
 * down to set as large as the cover, and the big button to start a campaign.
 */
export function FinalCTA() {
  const mailto = `mailto:${site.contact.email}?subject=${encodeURIComponent(site.contact.subject)}`;

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="screen scheme-ink relative isolate overflow-hidden py-20"
    >
      <div
        aria-hidden="true"
        className="glow -z-10"
        style={{
          right: "-18%",
          bottom: "-55%",
          width: "70%",
          height: "120%",
          background: "radial-gradient(closest-side, var(--glow-a), transparent 72%)",
        }}
      />
      <div className="shell">
        <Reveal>
          <p
            aria-hidden="true"
            className="crore-figure display tabular text-[clamp(3rem,12vw,9.5rem)] leading-none lg:text-[clamp(3rem,min(10vw,13svh),9.5rem)]"
          >
            {cta.figure}
          </p>
          <h2
            id="contact-title"
            className="display mt-6 text-[clamp(3rem,9.6vw,6.5rem)] leading-[0.98] text-fg lg:mt-[min(2rem,3svh)] lg:text-[clamp(2.75rem,min(6.4vw,9svh),6.5rem)]"
          >
            {cta.headline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          <p className="mt-8 max-w-lg text-[1.0625rem] leading-[1.6] text-fg-2 lg:mt-[min(2rem,3svh)]">{cta.body}</p>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5 lg:mt-[min(2.5rem,4svh)]">
            <Button href={mailto} size="lg" enquiry>
              {cta.button}
            </Button>
            <CopyEmail email={site.contact.email} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
