"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { capabilities } from "@/content/site";
import { cn } from "@/lib/cn";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Services as five columns that share one row. The chosen column opens to
 * show its detail and the others narrow to their names. On narrow screens
 * the same markup stacks into an accordion.
 */
export function Capabilities() {
  const [active, setActive] = useState(0);

  return (
    <section id="services" data-stage="services" aria-labelledby="services-title" className="relative py-16 lg:py-24">
      <div className="shell">
        <Reveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h2 id="services-title" className="section-title">
            {capabilities.title}
          </h2>
          <p className="max-w-[26rem] text-fg-2 md:text-right">{capabilities.intro}</p>
        </Reveal>

        <Reveal delay={80} className="mt-10 lg:mt-14">
          <div className="cap-row flex flex-col border-b border-line lg:h-[27rem] lg:flex-row lg:border-t">
            {capabilities.items.map((item, index) => {
              const open = index === active;
              const panelId = `service-${item.id}`;
              return (
                <div
                  key={item.id}
                  data-active={open}
                  className={cn(
                    "cap-panel group relative overflow-hidden border-t border-line",
                    "lg:flex-[1_1_0%] lg:border-l lg:border-t-0 lg:first:border-l-0 lg:data-[active=true]:grow-[3.4]",
                    "lg:data-[active=true]:bg-elevated",
                  )}
                >
                  {/* A line of brand colour marks the open column */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute inset-x-0 top-0 hidden h-px origin-left transition-transform duration-700 ease-out-expo lg:block",
                      open ? "scale-x-100" : "scale-x-0",
                    )}
                    style={{ background: "var(--brand-line)" }}
                  />
                  <h3 className="lg:absolute lg:inset-0">
                    <button
                      type="button"
                      aria-expanded={open}
                      aria-controls={panelId}
                      onClick={() => setActive(index)}
                      onFocus={() => setActive(index)}
                      onPointerEnter={(event) => {
                        if (event.pointerType === "mouse") setActive(index);
                      }}
                      className={cn(
                        "flex w-full items-center justify-between gap-4 py-5 text-left text-[1.0625rem] font-medium",
                        "transition-colors duration-500 lg:h-full lg:flex-col lg:items-start lg:p-6 lg:text-[0.9375rem]",
                        open ? "text-fg" : "text-fg-2 hover:text-fg",
                      )}
                    >
                      <span>{item.name}</span>
                      <Plus
                        aria-hidden="true"
                        size={18}
                        strokeWidth={1.5}
                        className={cn(
                          "shrink-0 transition-[transform,opacity] duration-500 ease-out-expo",
                          open ? "rotate-45 lg:opacity-0" : "rotate-0",
                        )}
                      />
                    </button>
                  </h3>

                  <div
                    id={panelId}
                    aria-hidden={!open}
                    className={cn(
                      "grid transition-[grid-template-rows] duration-700 ease-out-expo",
                      open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                      "lg:pointer-events-none lg:absolute lg:bottom-0 lg:left-0 lg:block",
                    )}
                  >
                    <div className="overflow-hidden lg:overflow-visible">
                      <div
                        className={cn(
                          "cap-detail pb-7 lg:w-[45.9cqw] lg:p-6 lg:pr-10",
                          open ? "opacity-100 lg:delay-150" : "opacity-0 lg:translate-y-3",
                        )}
                      >
                        <p className="display max-w-[26rem] text-[1.75rem] leading-[1.08] text-fg lg:text-[2.25rem]">
                          {item.statement}
                        </p>
                        <ul className="mt-6 max-w-[26rem] text-[0.9375rem] text-fg-2">
                          {item.deliverables.map((deliverable) => (
                            <li key={deliverable} className="border-t border-line py-2.5">
                              {deliverable}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
