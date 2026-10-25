import { cases } from "@/content/site";
import { RailButtons } from "@/components/ui/RailButtons";
import { Reveal } from "@/components/ui/Reveal";
import { CaseCard } from "@/components/work/CaseCard";

/**
 * The work, on one screen: the heading and the buttons on the left, a card
 * for each case study on a rail that runs off the right edge. Each card
 * opens the case's own page (app/work/[id]), with the whole story and its
 * videos; nothing plays here, so the home page stays light. The rail swipes
 * on touch, scrolls on a trackpad, and steps a card at a time with the
 * buttons.
 */
export function CaseStudies() {
  return (
    <section
      id="work"
      aria-labelledby="work-title"
      className="screen scheme-dark relative overflow-x-clip border-t border-line py-14 lg:py-20"
    >
      <div className="shell lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-10">
        <div className="lg:col-span-3">
          <Reveal>
            <p className="section-label">{cases.label}</p>
          </Reveal>
          <Reveal className="mt-6 lg:mt-[min(2rem,3svh)]">
            <h2 id="work-title" className="section-title lg:text-[clamp(2rem,min(3.4vw,6.5svh),3.5rem)]">
              {cases.title}
            </h2>
            <p className="mt-4 max-w-[26rem] text-[0.9375rem] leading-[1.6] text-fg-2">{cases.intro}</p>
            {/* Phones and tablets swipe the rail; the buttons are for mouse and keyboard. */}
            <div className="hidden lg:block">
              <RailButtons target="work-rail" prev={cases.prev} next={cases.next} className="mt-7" />
            </div>
          </Reveal>
        </div>

        <Reveal delay={80} className="mt-8 lg:col-span-9 lg:mt-0">
          <div id="work-rail" role="region" aria-label={cases.railLabel} tabIndex={0} className="case-rail">
            <ul className="case-track">
              {cases.items.map((study) => (
                <li key={study.id}>
                  <CaseCard study={study} />
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
