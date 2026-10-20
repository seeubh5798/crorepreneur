"use client";

import { useEffect, useMemo, useState } from "react";

type TypeLinesProps = {
  lines: readonly string[];
  /** Wait before the first character, in ms. */
  start?: number;
  /** Time per typed character, in ms (a little varied, like a person typing). */
  type?: number;
  /** Rest at the end of each line, in ms. */
  rest?: number;
  /** How long the finished text stays before it is erased, in ms. */
  hold?: number;
  /** Time per erased character, in ms. */
  erase?: number;
};

/**
 * Lines that type themselves, hold, erase and type again for as long as the
 * page is open, with a caret riding after the last character. Every character
 * keeps its place from the first paint and is only shown or hidden, so nothing
 * reflows. It runs on a timer (a few updates a second, nothing per frame).
 * Without script the text is simply there (see the CSS), and for visitors who
 * prefer reduced motion it is there and still. Hidden from assistive tech, so
 * pair it with a plain copy of the text.
 */
export function TypeLines({ lines, start = 400, type = 58, rest = 300, hold = 2800, erase = 24 }: TypeLinesProps) {
  const chars = useMemo(() => lines.map((line) => Array.from(line)), [lines]);
  const total = chars.reduce((sum, line) => sum + line.length, 0);
  const lineEnds = useMemo(() => chars.map((_, i) => chars.slice(0, i + 1).flat().length), [chars]);
  const [shown, setShown] = useState(0);
  const [holding, setHolding] = useState(false);

  useEffect(() => {
    // Reduced motion: the CSS shows every character, still, with no caret.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer = 0;
    let count = 0;
    let typing = true;
    const tick = () => {
      if (typing) {
        count += 1;
        setShown(count);
        if (count >= total) {
          typing = false;
          setHolding(true);
          timer = window.setTimeout(tick, hold);
          return;
        }
        // A small, repeatable unevenness, so it reads as typed rather than printed.
        const jitter = ((count * 37) % 23) - 8;
        timer = window.setTimeout(tick, lineEnds.includes(count) ? rest : type + jitter);
      } else {
        if (count === total) setHolding(false);
        count -= 1;
        setShown(count);
        if (count <= 0) {
          typing = true;
          timer = window.setTimeout(tick, rest * 1.5);
          return;
        }
        timer = window.setTimeout(tick, erase);
      }
    };
    timer = window.setTimeout(tick, start);
    return () => window.clearTimeout(timer);
  }, [total, lineEnds, start, type, rest, hold, erase]);

  return (
    <span aria-hidden="true" className="type-lines" data-holding={holding || undefined}>
      {chars.map((line, lineIndex) => (
        <span key={lineIndex} className="type-line">
          {line.map((char, charIndex) => {
            const i = (lineIndex === 0 ? 0 : lineEnds[lineIndex - 1]) + charIndex;
            const caret = shown === 0 ? (i === 0 ? "before" : undefined) : i === shown - 1 ? "after" : undefined;
            return (
              <span key={i} className="type-char" data-on={i < shown || undefined} data-caret={caret}>
                {char}
              </span>
            );
          })}
        </span>
      ))}
    </span>
  );
}
