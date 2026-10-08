"use client";

import { AnimatePresence, m } from "motion/react";
import { useRef, type CSSProperties, type KeyboardEvent } from "react";
import { work } from "@/content/site";
import { cn } from "@/lib/cn";
import { setStory, useStory } from "@/lib/story";
import { CountUp } from "@/components/ui/CountUp";
import { Figure } from "@/components/ui/Figure";
import { PhoneSlot } from "@/components/ui/PhoneSlot";
import { Reveal } from "@/components/ui/Reveal";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Selected campaigns. Choosing one (hover, tap or arrow keys) updates the
 * numbers here and turns the 3D phone, whose screen shows that campaign's
 * reel. The phone's slot sits on the right on wide screens and between the
 * list and the numbers on narrow ones.
 */
export function ProjectShowcase() {
  const activeId = useStory("project");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const { projects } = work;
  const active = Math.max(
    0,
    projects.findIndex((p) => p.id === activeId),
  );
  const project = projects[active];

  function select(index: number) {
    setStory({ project: projects[index].id });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const last = projects.length - 1;
    let next: number | null = null;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") next = active === last ? 0 : active + 1;
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = active === 0 ? last : active - 1;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = last;
    if (next === null) return;
    event.preventDefault();
    select(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <section id="work" data-stage="work" aria-labelledby="work-title" className="relative py-16 lg:py-24">
      <div className="shell">
        <Reveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h2 id="work-title" className="section-title">
            {work.title}
          </h2>
          <div className="max-w-[26rem] md:text-right">
            <p className="text-fg-2">{work.intro}</p>
            {work.sampleNotice && <p className="mt-1 text-[0.8125rem] text-fg-3">{work.sampleNotice}</p>}
          </div>
        </Reveal>

        <Reveal delay={80} className="mt-10 grid gap-x-10 gap-y-8 lg:mt-14 lg:grid-cols-12">
          <div className="lg:col-span-6">
            {/* Campaign list */}
            <div role="tablist" aria-label="Campaigns" onKeyDown={handleKeyDown} className="grid grid-cols-3 lg:block">
              {projects.map((item, index) => {
                const selected = index === active;
                return (
                  <button
                    key={item.id}
                    ref={(node) => {
                      tabRefs.current[index] = node;
                    }}
                    type="button"
                    role="tab"
                    id={`work-tab-${item.id}`}
                    aria-selected={selected}
                    aria-controls="work-panel"
                    tabIndex={selected ? 0 : -1}
                    onClick={() => select(index)}
                    onFocus={() => select(index)}
                    onPointerEnter={(event) => {
                      if (event.pointerType === "mouse") select(index);
                    }}
                    className={cn(
                      "group relative flex w-full flex-col items-start gap-1 border-t border-line py-4 text-left",
                      "transition-colors duration-500 lg:flex-row lg:items-baseline lg:justify-between lg:gap-6 lg:py-5",
                      selected ? "text-fg" : "text-fg-3 hover:text-fg-2",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute inset-x-0 -top-px h-px origin-left transition-transform duration-700 ease-out-expo",
                        selected ? "scale-x-100" : "scale-x-0",
                      )}
                      style={{ background: "var(--brand-line)" }}
                    />
                    <span className="display text-[1.375rem] xs:text-[1.5rem] lg:text-[2.25rem]">{item.client}</span>
                    <span className="hidden text-sm text-fg-2 lg:block">
                      {item.sector}, {item.year}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Phone slot on narrow screens */}
            <div className="relative mt-8 flex justify-center lg:hidden">
              <div
                aria-hidden="true"
                className="slot-glow absolute inset-[-8%]"
                style={{ "--tone": project.tone } as CSSProperties}
              />
              <PhoneSlot anchor="phone-work-narrow" show="project" className="h-[min(60svh,30rem)] max-w-full" />
            </div>

            {/* Details */}
            <div
              role="tabpanel"
              id="work-panel"
              aria-labelledby={`work-tab-${project.id}`}
              aria-live="polite"
              className="mt-8 lg:mt-10"
            >
              <AnimatePresence mode="wait" initial={false}>
                <m.div
                  key={project.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  <p className="display text-[clamp(4rem,15vw,5.5rem)] leading-[0.9] text-fg lg:text-[clamp(5rem,7.4vw,7.5rem)]">
                    <CountUp metric={project.headline} />
                  </p>
                  <p className="mt-2 text-[0.9375rem] text-fg-2">{project.headline.label}</p>
                  <p className="mt-6 max-w-[32rem] text-[1.0625rem] leading-[1.6] text-fg-2">{project.summary}</p>
                  <ul className="mt-7 grid max-w-[32rem] grid-cols-2 gap-x-6 border-t border-line pt-5">
                    {project.supporting.map((item) => (
                      <li key={item.label}>
                        <p className="display tabular text-[2rem] text-fg">
                          <Figure>{item.figure}</Figure>
                        </p>
                        <p className="mt-1.5 text-[0.8125rem] text-fg-2">{item.label}</p>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-6 text-[0.8125rem] text-fg-3">{project.services.join(", ")}</p>
                </m.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Phone slot on wide screens */}
          <div className="relative hidden items-center justify-center lg:col-span-5 lg:col-start-8 lg:flex">
            <div
              aria-hidden="true"
              className="slot-glow absolute inset-[-6%]"
              style={{ "--tone": project.tone } as CSSProperties}
            />
            <PhoneSlot anchor="phone-work" show="project" className="h-[min(68svh,38rem)]" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
