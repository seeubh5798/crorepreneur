"use client";

import { useEffect, useRef, useState } from "react";
import { cta, process } from "@/content/site";
import { cn } from "@/lib/cn";
import { Reveal } from "@/components/ui/Reveal";

/*
 * The chart is drawn on a 100 x 100 grid and stretched to its box.
 * Vertical axis is a log scale: 1 lakh at the bottom tick, 1 crore at the top.
 * The four steps sit at the centre of four equal columns, so the nodes line
 * up with the step text underneath on wide screens.
 */
const Y_LAKH = 86;
const Y_CRORE = 20;
const STEP_X = [12.5, 37.5, 62.5, 87.5];
const TICK_Y = [Y_LAKH, (Y_LAKH + Y_CRORE) / 2, Y_CRORE];

/** Height of the curve at x. Flat before the first step, compounding after. */
function curveY(x: number) {
  const t = Math.max(0, (x - STEP_X[0]) / (STEP_X[3] - STEP_X[0]));
  return Y_LAKH - (Y_LAKH - Y_CRORE) * Math.pow(t, 1.7);
}

const CURVE_POINTS = Array.from({ length: 101 }, (_, i) => [i, curveY(i)] as const);
const CURVE_PATH = CURVE_POINTS.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y.toFixed(2)}`).join(" ");
const AREA_PATH = `${CURVE_PATH} L100,100 L0,100 Z`;

export function Process() {
  const chartRef = useRef<HTMLDivElement>(null);
  const [hot, setHot] = useState<number | null>(null);

  // Draw the curve left to right when the chart arrives on screen. It starts
  // fully drawn, and is only wound back if it is still below the fold.
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (chart.getBoundingClientRect().top < window.innerHeight * 0.8) return;

    chart.dataset.drawn = "false";
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          chart.dataset.drawn = "true";
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(chart);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="approach" data-stage="approach" aria-labelledby="approach-title" className="relative py-16 lg:py-24">
      <div className="shell">
        <Reveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h2 id="approach-title" className="section-title">
            {process.title.join(" ")}
          </h2>
          <p className="max-w-[26rem] text-fg-2 md:text-right">{process.intro}</p>
        </Reveal>

        <div className="mt-10 lg:mt-14">
          {/* Chart */}
          <div
            ref={chartRef}
            data-drawn="true"
            className="group/chart relative h-56 sm:h-64 lg:h-[clamp(12rem,calc(100svh-33rem),20rem)]"
            role="img"
            aria-label={`Illustrative growth curve across the four steps, rising from one lakh to ${process.chart.markLabel.toLowerCase()} of ${cta.figure} views.`}
          >
            {/* Gridlines and tick labels */}
            {TICK_Y.map((y, index) => {
              const isCrore = index === TICK_Y.length - 1;
              return (
                <div
                  key={y}
                  aria-hidden="true"
                  className="absolute inset-x-0 flex -translate-y-1/2 items-center gap-3"
                  style={{ top: `${y}%` }}
                >
                  <span className="tabular w-11 shrink-0 text-xs text-fg-3">{process.chart.ticks[index]}</span>
                  <span
                    className={cn(
                      "h-px flex-1",
                      isCrore
                        ? "bg-[repeating-linear-gradient(90deg,var(--accent-text)_0_6px,transparent_6px_12px)] opacity-70"
                        : "bg-line",
                    )}
                  />
                  {isCrore && (
                    <span className="tabular absolute bottom-full left-14 mb-1.5 text-xs text-accent-text">
                      {process.chart.markLabel}, {cta.figure}
                    </span>
                  )}
                </div>
              );
            })}

            {/* Curve */}
            <div
              aria-hidden="true"
              className={cn(
                "absolute inset-y-0 left-14 right-0",
                "[clip-path:inset(-10%_0_-10%_0)] transition-[clip-path] duration-[2200ms] ease-out-expo",
                "group-data-[drawn=false]/chart:[clip-path:inset(-10%_100%_-10%_0)] group-data-[drawn=false]/chart:duration-0",
              )}
            >
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="absolute inset-0 size-full overflow-visible"
              >
                <defs>
                  <linearGradient id="curve-area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="var(--accent)" stopOpacity="0.14" />
                    <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={AREA_PATH} fill="url(#curve-area)" />
                <path
                  d={CURVE_PATH}
                  fill="none"
                  stroke="var(--accent-text)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>

              {/* Nodes */}
              {STEP_X.map((x, index) => {
                const last = index === STEP_X.length - 1;
                const active = hot === index;
                return (
                  <span
                    key={x}
                    className={cn(
                      "absolute grid size-3.5 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border",
                      "transition-[scale,background-color,border-color,box-shadow] duration-500 ease-out-expo",
                      last || active
                        ? "border-accent-text bg-accent-text shadow-[0_0_0_6px_var(--accent-soft)]"
                        : "border-accent-text bg-bg",
                      active && "scale-125",
                    )}
                    style={{ left: `${x}%`, top: `${curveY(x)}%` }}
                  />
                );
              })}
            </div>
          </div>

          {/* Steps */}
          <ol className="mt-2 grid grid-cols-2 gap-x-5 lg:ml-14 lg:grid-cols-4 lg:gap-x-0">
            {process.steps.map((step, index) => (
              <li
                key={step.name}
                onPointerEnter={() => setHot(index)}
                onPointerLeave={() => setHot(null)}
                className="border-t border-line py-6 lg:border-t-0 lg:px-5 lg:py-4 lg:text-center"
              >
                <Reveal delay={index * 90}>
                  <p className="tabular text-xs text-fg-3">0{index + 1}</p>
                  <h3
                    className={cn(
                      "display mt-2 text-[2rem] transition-colors duration-500 lg:text-[2.25rem]",
                      hot === index ? "text-accent-text" : "text-fg",
                    )}
                  >
                    {step.name}
                  </h3>
                  <p className="mt-3 max-w-[22rem] text-[0.9375rem] leading-[1.6] text-fg-2 lg:mx-auto">{step.text}</p>
                </Reveal>
              </li>
            ))}
          </ol>

          <p className="mt-6 text-xs text-fg-3 lg:ml-14">
            {process.chart.axisLabel}. {process.chart.note}
          </p>
        </div>
      </div>
    </section>
  );
}
