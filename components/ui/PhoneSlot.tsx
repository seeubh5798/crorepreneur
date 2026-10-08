"use client";

import Image from "next/image";
import { founder, work } from "@/content/site";
import { cn } from "@/lib/cn";
import { useStory } from "@/lib/story";
import { asset } from "@/lib/assets";

type PhoneSlotProps = {
  /** Name the 3D phone looks for (data-anchor). */
  anchor: string;
  /** What the flat stand-in shows when the 3D layer is not running. */
  show: "founder" | "project";
  className?: string;
};

/**
 * Reserves the place where the 3D phone lands in a section. Until the 3D layer
 * is drawing (or if it never runs: no WebGL, reduced motion), a flat phone
 * stands in, so the layout never has a hole in it.
 */
export function PhoneSlot({ anchor, show, className }: PhoneSlotProps) {
  const live = useStory("live");
  const projectId = useStory("project");
  const project = work.projects.find((p) => p.id === projectId) ?? work.projects[0];

  return (
    <div data-anchor={anchor} className={cn("relative aspect-[76/156]", className)}>
      <div
        aria-hidden="true"
        data-live={live}
        className="phone-fallback absolute inset-0 overflow-hidden rounded-[15%/7.3%] border-[5px] border-[#2a2833] shadow-[var(--shadow-soft)]"
        style={{
          background:
            show === "project"
              ? `linear-gradient(160deg, ${project.palette[0]}, ${project.palette[1]})`
              : "linear-gradient(180deg, #34323b, #24232a 60%, #16161a)",
        }}
      >
        <span className="absolute left-1/2 top-[2.4%] h-[3.6%] w-[26%] -translate-x-1/2 rounded-full bg-black" />
        {show === "founder" ? (
          <>
            <p className="display absolute inset-x-0 top-[17%] text-center text-[clamp(1.25rem,3.4vw,2.4rem)] italic text-white/90">
              Crorepreneur
            </p>
            <span className="absolute inset-x-0 bottom-0 h-[72%]">
              <Image
                src={asset(founder.image.src)}
                alt=""
                fill
                unoptimized
                sizes="20rem"
                className="object-contain object-bottom"
              />
            </span>
          </>
        ) : (
          <p className="display absolute inset-x-[8%] top-[52%] text-[clamp(1.1rem,2.4vw,1.75rem)] leading-tight text-white">
            {project.title}
          </p>
        )}
        <span className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent" />
        <p className="absolute bottom-[7%] left-[8%] text-[0.75rem] font-medium text-white">
          {show === "founder" ? founder.instagram.user : project.handle}
        </p>
      </div>
    </div>
  );
}
