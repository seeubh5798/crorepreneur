import type { CSSProperties, ReactNode } from "react";
import { process } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The approach: five moves up a staircase, like the one in the logo. From
 * laptop width up, each move is a column standing one step higher than the
 * last, with a small graph on its step and its detail underneath; on phones
 * and tablets the same list simply stacks. Everything here is static markup
 * and inline SVG, so the section costs no script and no work per frame.
 */
export function Process() {
  const last = process.title.length - 1;
  const steps = process.steps.length;

  return (
    <section id="approach" aria-labelledby="approach-title" className="screen scheme-dark relative py-14 lg:py-20">
      <div className="shell">
        <Reveal>
          <p className="section-label">{process.label}</p>
        </Reveal>
        <Reveal className="mt-6 lg:mt-[min(2rem,3svh)]">
          <h2 id="approach-title" className="section-title lg:text-[clamp(2rem,min(3.7vw,6svh),3.75rem)]">
            {process.title.map((word, index) =>
              index === last ? (
                <span key={word} className="serif text-[1.06em] text-accent-text">
                  {word}
                </span>
              ) : (
                <span key={word}>{word} </span>
              ),
            )}
          </h2>
          <div className="mt-4 flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between md:gap-8 lg:mt-[min(1rem,1.4svh)]">
            <p className="text-fg-2">{process.intro}</p>
            <p className="text-xs text-fg-3">{process.note}</p>
          </div>
        </Reveal>

        <Reveal className="mt-8 lg:mt-[min(1rem,1.5svh)]">
          {/* On phones and tablets a row of cards that swipes sideways (and scrolls with the arrow keys). */}
          <ol className="stairs" tabIndex={0} aria-label={process.title.join(" ")}>
            {process.steps.map((step, index) => (
              <li key={step.id} style={{ "--down": steps - 1 - index } as CSSProperties}>
                <div aria-hidden="true" className="stair-graph">
                  {GRAPHS[step.id]}
                </div>
                {/* The number reads first, and shows at the end of the tread. */}
                <div className="flex flex-row-reverse items-baseline justify-between gap-3">
                  <p className="tabular text-xs text-fg-3">{String(index + 1).padStart(2, "0")}</p>
                  <h3 className="display text-[1.75rem] leading-none text-fg">{step.name}</h3>
                </div>
                <p className="mt-3 text-[0.9375rem] leading-[1.55] text-fg lg:mt-[min(0.75rem,1.2svh)] lg:text-[clamp(0.84rem,min(2svh,1.4vw),0.9375rem)]">
                  {step.lead}
                </p>
                <ul className="hook-list mt-4 flex flex-col gap-2.5 text-[0.875rem] leading-[1.55] text-fg-2 lg:mt-[min(0.875rem,1.4svh)] lg:gap-[min(0.5rem,0.9svh)] lg:text-[clamp(0.8125rem,min(1.85svh,1.3vw),0.875rem)]">
                  {step.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}

/*
 * One small graph per move, drawn on a 200 x 72 grid and anchored to its
 * bottom left, so each one stands on its step. Colours come from the theme.
 */
function Graph({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 200 72" preserveAspectRatio="xMinYMax meet" className="size-full overflow-visible">
      {children}
    </svg>
  );
}

const BARS = [
  { label: "Comments", value: 0.9, lit: true },
  { label: "Saves", value: 0.76, lit: true },
  { label: "Search", value: 0.62, lit: true },
  { label: "Followers", value: 0.3, lit: false },
];

const DOTS = [
  [8, 16],
  [20, 46],
  [30, 24],
  [42, 62],
  [50, 36],
  [16, 32],
  [62, 12],
  [70, 52],
  [84, 26],
  [92, 60],
  [102, 42],
  [40, 8],
  [10, 62],
  [78, 40],
] as const;

/** A smooth hump of buzz: rises from the baseline to `h` and back, centred on `x`. */
function hump(x: number, h: number) {
  const top = 70 - h;
  return `M${x - 46} 70C${x - 22} 70 ${x - 22} ${top} ${x} ${top}C${x + 22} ${top} ${x + 22} 70 ${x + 46} 70Z`;
}

const GRAPHS: Record<string, ReactNode> = {
  // Listen: the signals that matter outweigh the follower count.
  listen: (
    <Graph>
      {BARS.map((bar, i) => {
        const y = 2 + i * 18;
        return (
          <g key={bar.label}>
            <text x="0" y={y + 9.5} className="fill-fg-3 text-[11.5px]">
              {bar.label}
            </text>
            <rect
              x="66"
              y={y}
              width={1 + bar.value * 130}
              height="12"
              rx="3"
              className={bar.lit ? "fill-accent-text" : "fill-fg-3"}
              opacity={bar.lit ? 1 - i * 0.18 : 0.45}
            />
          </g>
        );
      })}
    </Graph>
  ),
  // Spark: many signals, one insight.
  spark: (
    <Graph>
      {DOTS.filter((_, i) => i % 3 === 0).map(([x, y]) => (
        <line key={`${x}-${y}`} x1={x} y1={y} x2="172" y2="36" className="stroke-fg-3" strokeWidth="1" opacity="0.4" />
      ))}
      {DOTS.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="2.6" className="fill-fg-3" />
      ))}
      <circle cx="172" cy="36" r="20" className="fill-accent-soft" />
      <circle cx="172" cy="36" r="9" className="fill-accent-text" />
    </Graph>
  ),
  // Create: made for the feed, in each platform's own shape.
  create: (
    <Graph>
      <rect
        x="8"
        y="6"
        width="36"
        height="64"
        rx="6"
        className="fill-accent-soft stroke-accent-text"
        strokeWidth="1.5"
      />
      <path d="M22 30L34 38L22 46Z" className="fill-accent-text" />
      <rect x="58" y="15" width="44" height="55" rx="5" className="fill-none stroke-fg-3" strokeWidth="1.3" />
      <path d="M66 58H94M66 64H84" className="stroke-fg-3" strokeWidth="1.3" strokeLinecap="round" />
      <rect x="116" y="22" width="48" height="48" rx="5" className="fill-none stroke-fg-3" strokeWidth="1.3" />
      <circle cx="140" cy="44" r="9" className="fill-none stroke-fg-3" strokeWidth="1.3" />
    </Graph>
  ),
  // Amplify: rolled out in sequence, so the conversation never goes quiet.
  amplify: (
    <Graph>
      <path d={hump(48, 32)} className="fill-accent-text stroke-accent-text" fillOpacity="0.14" strokeWidth="1.3" />
      <path d={hump(102, 46)} className="fill-accent-text stroke-accent-text" fillOpacity="0.22" strokeWidth="1.3" />
      <path d={hump(156, 62)} className="fill-accent-text stroke-accent-text" fillOpacity="0.32" strokeWidth="1.3" />
      <path d="M2 70H198" className="stroke-fg-3" strokeWidth="1.3" />
    </Graph>
  ),
  // Compound: each campaign starts higher than the last.
  compound: (
    <Graph>
      <path d="M58 44H70M118 26H130" className="stroke-fg-3" strokeWidth="1.3" strokeDasharray="2 3" />
      <path
        d="M10 64L58 44M70 44L118 26M130 26L174 8"
        className="stroke-accent-text"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path d="M180.5 5.4L174.9 13L171.1 3.8Z" className="fill-accent-text" />
      {[
        [10, 64],
        [70, 44],
        [130, 26],
      ].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="3.4" className="fill-bg stroke-accent-text" strokeWidth="1.6" />
      ))}
    </Graph>
  ),
};
