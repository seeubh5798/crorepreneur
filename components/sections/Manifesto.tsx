import { manifesto } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Why Crorepreneur. The line it all comes down to, set large: the ad in grey
 * with a violet line drawn through it as it arrives, the story said in the
 * serif voice. Under a rule, what that means: the first sentences lighting up
 * word by word as they scroll past (ScrollStory), the rest beside them. Then
 * the creator categories run past in a slow band.
 */
export function Manifesto() {
  const words = manifesto.statement.split(" ");
  const [ad, story] = manifesto.headline;
  return (
    <section id="manifesto" aria-labelledby="manifesto-title" className="screen relative py-14 lg:py-20">
      <div className="shell">
        <Reveal>
          <p className="section-label">{manifesto.label}</p>
        </Reveal>

        <Reveal delay={60} className="mt-6 lg:mt-[min(2.5rem,3.5svh)]">
          <h2
            id="manifesto-title"
            className="display text-[clamp(2.5rem,11.2vw,7.25rem)] leading-[0.98] lg:text-[clamp(3rem,min(8.4vw,10svh),7.25rem)]"
          >
            <span className="block text-fg-3">
              <span className="strike">{ad}</span>
            </span>
            <span className="serif block text-[1.06em] leading-[1.04] text-accent-text">{story}</span>
          </h2>
        </Reveal>

        <div className="mt-9 grid gap-x-12 gap-y-6 border-t border-line pt-7 lg:mt-[min(4rem,5svh)] lg:grid-cols-12 lg:pt-[min(3rem,4svh)]">
          <p
            data-manifesto
            className="display text-[clamp(1.5rem,4.4vw,3.125rem)] leading-[1.1] tracking-[-0.04em] text-fg lg:col-span-6 lg:text-[clamp(1.5rem,min(3.4vw,4.4svh),3.125rem)]"
          >
            {words.map((word, index) => (
              <span key={`${word}-${index}`} data-word className="manifesto-word">
                {word}{" "}
              </span>
            ))}
          </p>
          <Reveal
            delay={80}
            className="flex flex-col gap-4 text-base leading-[1.6] text-fg-2 sm:text-[1.0625rem] sm:leading-[1.65] lg:col-span-6 lg:col-start-7 lg:pt-1.5 xl:col-span-5 xl:col-start-8 lg:text-[clamp(0.9375rem,2.2svh,1.0625rem)]"
          >
            <p>{manifesto.body}</p>
            <p>
              <span className="font-medium text-fg">{manifesto.closing.lead}</span> {manifesto.closing.text}
            </p>
          </Reveal>
        </div>
      </div>

      <div className="mt-10 lg:mt-[min(4rem,5svh)]">
        <p className="shell mb-3 text-sm text-fg-3">{manifesto.categoriesLabel}</p>
        <div className="marquee border-y border-line" aria-label={manifesto.categories.join(", ")}>
          <div aria-hidden="true" className="marquee-track">
            {[0, 1].map((copy) => (
              <ul key={copy} className="marquee-group">
                {manifesto.categories.map((category) => (
                  <li key={category} className="display marquee-item">
                    {category}
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
