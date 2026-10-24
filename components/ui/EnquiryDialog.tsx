"use client";

import { X } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { enquiry as copy, site } from "@/content/site";
import { cn } from "@/lib/cn";
import { getEnquiryConfig, sendEnquiry, type Enquiry } from "@/lib/enquiry";
import { getLenis } from "@/lib/smooth";

type RequiredField = "name" | "email" | "company";
type Status = "editing" | "sending" | "handed-off" | "sent";
/** The spam check: not used, loading, passed, or broken (then the email app takes over). */
type Check = "off" | "loading" | "ready" | "error";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Cloudflare Turnstile's script, as far as this form uses it. */
type Turnstile = {
  render(container: HTMLElement, options: Record<string, unknown>): string;
  remove(widget: string): void;
  reset(widget: string): void;
};

let turnstileScript: Promise<Turnstile> | undefined;

/** Loads Turnstile the first time the form needs it. */
function loadTurnstile(): Promise<Turnstile> {
  turnstileScript ??= new Promise<Turnstile>((resolve, reject) => {
    const loaded = () => (window as { turnstile?: Turnstile }).turnstile;
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.onload = () => {
      const turnstile = loaded();
      if (turnstile) resolve(turnstile);
      else reject(new Error("Turnstile did not start"));
    };
    script.onerror = () => {
      turnstileScript = undefined;
      reject(new Error("Turnstile did not load"));
    };
    document.head.append(script);
  });
  return turnstileScript;
}

/**
 * The "Start a campaign" form, in a modal dialog. Any link or button marked
 * data-enquiry opens it; those links still point at the inbox, so they work
 * without script. Built on the native <dialog>: focus stays inside while it
 * is open, Escape or a click outside closes it, and focus returns to the
 * button that opened it. The page behind stops scrolling while it is open.
 *
 * When the site's server can send (see lib/enquiry.ts), the form shows
 * Turnstile, Cloudflare's spam check, which most people pass without doing
 * anything, and sends the enquiry with its token. Otherwise it opens the
 * visitor's email app, as it always has.
 */
export function EnquiryDialog() {
  const ref = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("editing");
  const [errors, setErrors] = useState<Partial<Record<RequiredField, string>>>({});
  const [siteKey, setSiteKey] = useState("");
  const [check, setCheck] = useState<Check>("off");
  const [checkNote, setCheckNote] = useState(false);
  const checkRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<string | null>(null);
  const tokenRef = useRef<string | null>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return;
      const trigger = event.target instanceof Element ? event.target.closest("[data-enquiry]") : null;
      if (!trigger || dialog.open) return;
      event.preventDefault();
      setStatus("editing");
      setCheckNote(false);
      setOpen(true);
      dialog.showModal();
      document.documentElement.classList.add("enquiry-open");
      getLenis()?.stop();
      getEnquiryConfig().then((config) => {
        if (!config.enabled) return;
        setSiteKey(config.turnstileSiteKey);
        setCheck((current) => (current === "off" ? "loading" : current));
      });
    };
    const onClose = () => {
      document.documentElement.classList.remove("enquiry-open");
      getLenis()?.start();
      setOpen(false);
      // A token works once and expires in five minutes, so each opening gets a fresh check.
      const widget = widgetRef.current;
      widgetRef.current = null;
      tokenRef.current = null;
      if (widget) {
        try {
          (window as { turnstile?: Turnstile }).turnstile?.remove(widget);
        } catch {
          // Already gone with the form.
        }
      }
      setCheck((current) => (current === "off" ? "off" : "loading"));
    };
    document.addEventListener("click", onClick);
    dialog.addEventListener("close", onClose);
    return () => {
      document.removeEventListener("click", onClick);
      dialog.removeEventListener("close", onClose);
    };
  }, []);

  // Puts the spam check in the form once it is open and wanted.
  useEffect(() => {
    if (!open || status !== "editing" || check !== "loading" || !siteKey || widgetRef.current) return;
    let cancelled = false;
    loadTurnstile()
      .then((turnstile) => {
        const container = checkRef.current;
        if (cancelled || !container || widgetRef.current) return;
        widgetRef.current = turnstile.render(container, {
          sitekey: siteKey,
          theme: "light",
          size: "flexible",
          action: "enquiry",
          callback: (token: string) => {
            tokenRef.current = token;
            setCheck("ready");
            setCheckNote(false);
          },
          "expired-callback": () => {
            tokenRef.current = null;
            setCheck("loading");
            if (widgetRef.current) turnstile.reset(widgetRef.current);
          },
          "error-callback": () => {
            tokenRef.current = null;
            setCheck("error");
          },
        });
      })
      .catch(() => {
        if (!cancelled) setCheck("error");
      });
    return () => {
      cancelled = true;
    };
  }, [open, status, check, siteKey]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const text = (key: string) => String(data.get(key) ?? "").trim();
    const entry: Enquiry = {
      name: text("name"),
      email: text("email"),
      company: text("company"),
      website: text("website"),
      phone: text("phone"),
      cities: text("cities"),
      budget: text("budget"),
      message: text("message"),
    };

    const found: Partial<Record<RequiredField, string>> = {};
    if (!entry.name) found.name = copy.errors.name;
    if (!EMAIL.test(entry.email)) found.email = copy.errors.email;
    if (!entry.company) found.company = copy.errors.company;
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    // With the spam check on, wait for its token; if it broke, the email app takes over.
    if (check === "loading" || check === "ready") {
      const token = tokenRef.current;
      if (!token) {
        setCheckNote(true);
        return;
      }
      tokenRef.current = null;
      setStatus("sending");
      setStatus(await sendEnquiry(entry, { token, trap: text("address") }));
      return;
    }

    setStatus("sending");
    setStatus(await sendEnquiry(entry));
  }

  const close = () => ref.current?.close();
  const done = status === "handed-off" || status === "sent";

  return (
    <dialog
      ref={ref}
      aria-labelledby="enquiry-title"
      data-lenis-prevent
      className="enquiry"
      onClick={(event) => {
        // The panel fills the dialog, so a click on the dialog itself is a click on the backdrop.
        if (event.target === event.currentTarget) close();
      }}
    >
      <div className="enquiry-panel">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 id="enquiry-title" className="display text-[2.25rem] leading-none text-fg sm:text-[2.75rem]">
              {status === "sent" ? copy.sent.title : status === "handed-off" ? copy.handedOff.title : copy.title}
            </h2>
            {!done && <p className="mt-3 max-w-[30rem] text-[0.9375rem] leading-[1.6] text-fg-2">{copy.intro}</p>}
          </div>
          <button
            type="button"
            aria-label={copy.close}
            onClick={close}
            className="grid size-10 shrink-0 place-items-center rounded-full border border-line-strong text-fg-2 transition-colors duration-300 hover:border-fg hover:text-fg"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {done ? (
          <div className="mt-6">
            <p className="max-w-[30rem] text-[1.0625rem] leading-[1.6] text-fg-2">
              {status === "sent" ? copy.sent.body : copy.handedOff.body}
            </p>
            {status === "handed-off" && (
              <p className="mt-4 text-sm text-fg-3">
                {copy.handedOff.fallback}{" "}
                <a href={`mailto:${site.contact.email}`} className="link-underline text-fg">
                  {site.contact.email}
                </a>
                .
              </p>
            )}
            <button type="button" onClick={close} className="enquiry-submit mt-8">
              {copy.close}
            </button>
          </div>
        ) : (
          <form noValidate onSubmit={submit} className="mt-8 grid gap-x-4 gap-y-5 sm:grid-cols-2">
            <Field name="name" {...copy.fields.name} error={errors.name} autoComplete="name" />
            <Field name="email" type="email" {...copy.fields.email} error={errors.email} autoComplete="email" />
            <Field name="company" {...copy.fields.company} error={errors.company} autoComplete="organization" />
            <Field name="website" {...copy.fields.website} optional autoComplete="url" />

            <Field name="cities" {...copy.fields.cities} optional className="sm:col-span-2" />

            <fieldset className="sm:col-span-2">
              <legend className="field-label">
                {copy.budgetLabel} <span className="text-fg-3">{copy.optional}</span>
              </legend>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {copy.budgets.map((budget) => (
                  <Chip key={budget} type="radio" name="budget" value={budget}>
                    {budget}
                  </Chip>
                ))}
              </div>
            </fieldset>

            <Field name="phone" type="tel" {...copy.fields.phone} optional autoComplete="tel" />
            <Field name="message" multiline {...copy.fields.message} optional className="sm:col-span-2" />

            {/* A field for bots only: people never see it, and anything typed in it is dropped. */}
            <div aria-hidden="true" className="enquiry-trap">
              <label>
                Address
                <input type="text" name="address" tabIndex={-1} autoComplete="off" />
              </label>
            </div>

            <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-end sm:justify-between">
              {check !== "off" && check !== "error" ? (
                <div className="flex flex-col gap-2">
                  <div ref={checkRef} aria-label={copy.check.label} className="enquiry-check" />
                  {checkNote && (
                    <p role="status" className="max-w-[20rem] text-[0.8125rem] leading-snug text-fg-2">
                      {copy.check.wait}
                    </p>
                  )}
                </div>
              ) : (
                <span />
              )}
              <button type="submit" disabled={status === "sending"} className="enquiry-submit self-end">
                {status === "sending" ? copy.sending : copy.submit}
              </button>
            </div>
          </form>
        )}
      </div>
    </dialog>
  );
}

type FieldProps = {
  name: string;
  label: string;
  placeholder: string;
  type?: string;
  error?: string;
  optional?: boolean;
  multiline?: boolean;
  autoComplete?: string;
  className?: string;
};

function Field({
  name,
  label,
  placeholder,
  type = "text",
  error,
  optional,
  multiline,
  autoComplete,
  className,
}: FieldProps) {
  const id = `enquiry-${name}`;
  const shared = {
    id,
    name,
    placeholder,
    autoComplete,
    required: !optional,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${id}-error` : undefined,
    className: "field-input",
  };
  return (
    <div className={cn("flex flex-col", className)}>
      <label htmlFor={id} className="field-label">
        {label} {optional && <span className="text-fg-3">{copy.optional}</span>}
      </label>
      {multiline ? <textarea rows={4} {...shared} /> : <input type={type} {...shared} />}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-[0.8125rem] text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

function Chip({ type, name, value, children }: { type: "radio"; name: string; value: string; children: ReactNode }) {
  return (
    <label className="chip">
      <input type={type} name={name} value={value} className="sr-only" />
      {children}
    </label>
  );
}
