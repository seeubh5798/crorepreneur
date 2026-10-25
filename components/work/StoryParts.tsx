"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";

type Part = { id: string; label: string; body: ReactNode };

/**
 * A case's story in three parts: the challenge, the creative solution, the
 * results. From laptop width up the three stand side by side. On phones and
 * tablets they would make a long scroll, so a switch above them shows one at
 * a time.
 */
export function StoryParts({ parts }: { parts: Part[] }) {
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const last = parts.length - 1;
    const moves: Record<string, number> = {
      ArrowRight: active === last ? 0 : active + 1,
      ArrowLeft: active === 0 ? last : active - 1,
      Home: 0,
      End: last,
    };
    if (!(event.key in moves)) return;
    event.preventDefault();
    setActive(moves[event.key]);
    listRef.current?.querySelectorAll<HTMLElement>('[role="tab"]')[moves[event.key]]?.focus();
  }

  return (
    <>
      <div ref={listRef} role="tablist" onKeyDown={onKeyDown} className="story-switch mt-7">
        {parts.map((part, index) => (
          <button
            key={part.id}
            type="button"
            role="tab"
            id={`story-${part.id}-tab`}
            aria-selected={index === active}
            aria-controls={`story-${part.id}`}
            tabIndex={index === active ? 0 : -1}
            onClick={() => setActive(index)}
          >
            {part.label}
          </button>
        ))}
      </div>
      <ol className="story-columns mt-7 lg:mt-[min(2.5rem,4svh)]">
        {parts.map((part, index) => (
          <li
            key={part.id}
            id={`story-${part.id}`}
            role="tabpanel"
            aria-labelledby={`story-${part.id}-title`}
            data-active={index === active}
          >
            <p className="tabular text-xs text-fg-3">{String(index + 1).padStart(2, "0")}</p>
            <h3
              id={`story-${part.id}-title`}
              className="display mt-2 text-[1.75rem] leading-none text-fg lg:text-[clamp(1.5rem,min(2.4vw,4svh),2rem)]"
            >
              {part.label}
            </h3>
            <div className="mt-5 lg:mt-[min(1.25rem,2svh)]">{part.body}</div>
          </li>
        ))}
      </ol>
    </>
  );
}
