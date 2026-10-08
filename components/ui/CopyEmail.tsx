"use client";

import { Check, Copy } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/cn";

/** Shows the address as real, selectable text with a one-tap copy. */
export function CopyEmail({ email, className }: { email: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const textRef = useRef<HTMLSpanElement>(null);
  const timer = useRef<number | undefined>(undefined);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 2200);
    } catch {
      // Clipboard access can be refused. Select the address so it can be
      // copied by hand instead.
      const node = textRef.current;
      if (!node) return;
      const range = document.createRange();
      range.selectNodeContents(node);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }

  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      <span ref={textRef} className="select-all text-[0.9375rem] text-fg">
        {email}
      </span>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? "Email address copied" : "Copy email address"}
        className="grid size-11 place-items-center rounded-full text-fg-2 transition-colors duration-300 hover:bg-surface hover:text-fg"
      >
        {copied ? <Check size={16} strokeWidth={1.75} /> : <Copy size={16} strokeWidth={1.75} />}
      </button>
      <span aria-live="polite" className="text-[0.8125rem] text-fg-2">
        {copied ? "Copied" : ""}
      </span>
    </span>
  );
}
