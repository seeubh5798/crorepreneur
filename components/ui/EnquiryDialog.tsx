"use client";

import { X } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { enquiry as copy, site } from "@/content/site";
import { cn } from "@/lib/cn";
import { sendEnquiry, type Enquiry } from "@/lib/enquiry";
import { getLenis } from "@/lib/smooth";

type RequiredField = "name" | "email" | "company";
type Status = "editing" | "sending" | "handed-off" | "sent";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * The "Start a Campaign" form, in a modal dialog. Any link or button marked
 * data-enquiry opens it; those links still point at the inbox, so they work
 * without script. Built on the native <dialog>: focus stays inside while it
 * is open, Escape or a click outside closes it, and focus returns to the
 * button that opened it. The page behind stops scrolling while it is open.
 */
export function EnquiryDialog() {
  const ref = useRef<HTMLDialogElement>(null);
  const [status, setStatus] = useState<Status>("editing");
  const [errors, setErrors] = useState<Partial<Record<RequiredField, string>>>({});

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return;
      const trigger = event.target instanceof Element ? event.target.closest("[data-enquiry]") : null;
      if (!trigger || dialog.open) return;
      event.preventDefault();
      setStatus("editing");
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

            <div className="flex items-center justify-end sm:col-span-2">
              <button type="submit" disabled={status === "sending"} className="enquiry-submit">
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

function Field({ name, label, placeholder, type = "text", error, optional, multiline, autoComplete, className }: FieldProps) {
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
