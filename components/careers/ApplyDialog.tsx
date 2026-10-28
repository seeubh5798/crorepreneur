"use client";

import { ArrowUpRight, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { careers, site } from "@/content/site";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { applyHref } from "@/lib/careers";
import { getLenis } from "@/lib/smooth";

/**
 * How to apply, in a small pop-up: what to send, and where. Any link marked
 * data-opens="apply" opens it; those links still write the email directly,
 * so they work without script. Like the enquiry form, it is the native
 * <dialog>: Escape or a click outside closes it, focus comes back to the
 * button, and the page behind stays put.
 */
export function ApplyDialog() {
  const ref = useRef<HTMLDialogElement>(null);
  const { role } = careers;
  const { apply } = role;

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return;
      const trigger = event.target instanceof Element ? event.target.closest('[data-opens="apply"]') : null;
      if (!trigger || dialog.open) return;
      event.preventDefault();
      dialog.showModal();
      document.documentElement.classList.add("enquiry-open");
      getLenis()?.stop();
    };
    const onClose = () => {
      document.documentElement.classList.remove("enquiry-open");
      getLenis()?.start();
    };
    document.addEventListener("click", onClick);
    dialog.addEventListener("close", onClose);
    return () => {
      document.removeEventListener("click", onClick);
      dialog.removeEventListener("close", onClose);
    };
  }, []);

  const close = () => ref.current?.close();

  return (
    <dialog
      ref={ref}
      aria-labelledby="apply-title"
      data-lenis-prevent
      className="enquiry enquiry-small"
      onClick={(event) => {
        // The panel fills the dialog, so a click on the dialog itself is a click on the backdrop.
        if (event.target === event.currentTarget) close();
      }}
    >
      <div className="enquiry-panel">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-sm font-medium text-accent-text">
              {role.title} · {role.city}
            </p>
            <h2 id="apply-title" className="display mt-2 text-[2rem] leading-none text-fg sm:text-[2.5rem]">
              {apply.title}
            </h2>
          </div>
          <button
            type="button"
            aria-label={apply.close}
            onClick={close}
            className="grid size-10 shrink-0 place-items-center rounded-full border border-line-strong text-fg-2 transition-colors duration-300 hover:border-fg hover:text-fg"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        <p className="mt-5 text-[1.0625rem] leading-[1.6] text-fg-2">{apply.note}</p>

        <div className="mt-6 rounded-2xl border border-line bg-surface px-4 py-3">
          <p className="text-[0.8125rem] text-fg-3">{apply.write}</p>
          <CopyEmail email={site.contact.email} className="-mr-2 mt-0.5" />
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            onClick={close}
            className="inline-flex min-h-12 items-center rounded-full px-5 text-[0.9375rem] font-medium text-fg-2 transition-colors duration-300 hover:text-fg"
          >
            {apply.close}
          </button>
          <a href={applyHref()} className="enquiry-submit gap-2">
            {apply.button}
            <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.75} />
          </a>
        </div>
      </div>
    </dialog>
  );
}
