import { site } from "@/content/site";

/** A campaign enquiry, as the form collects it. */
export type Enquiry = {
  name: string;
  email: string;
  company: string;
  website: string;
  phone: string;
  /** Where the campaign should run: cities, regions or countries. */
  cities: string;
  budget: string;
  message: string;
};

/**
 * Where the "Let’s Grow Your Brand" buttons point. With script they open the
 * form instead; without it they still reach the inbox.
 */
export const ENQUIRY_FALLBACK_HREF = `mailto:${site.contact.email}?subject=${encodeURIComponent(site.contact.subject)}`;

/** The enquiry as plain text, for an email body. */
export function formatEnquiry(enquiry: Enquiry): string {
  const details = [
    `Name: ${enquiry.name}`,
    `Email: ${enquiry.email}`,
    `Brand: ${enquiry.company}`,
    enquiry.website && `Website / Instagram: ${enquiry.website}`,
    enquiry.phone && `Phone / WhatsApp: ${enquiry.phone}`,
    enquiry.cities && `Cities or markets: ${enquiry.cities}`,
    enquiry.budget && `Monthly budget: ${enquiry.budget}`,
  ].filter(Boolean);
  return enquiry.message ? `${details.join("\n")}\n\n${enquiry.message}` : details.join("\n");
}

/** Whether the site's server (worker/) can send enquiries, and the key for its spam check. */
export type EnquiryConfig = { enabled: boolean; turnstileSiteKey: string };

let config: Promise<EnquiryConfig> | undefined;

/**
 * Asks the server once per visit. Where it can't answer, as under
 * `next dev`, or hasn't been given its keys, the form uses the email app.
 */
export function getEnquiryConfig(): Promise<EnquiryConfig> {
  config ??= fetch("/api/enquiry", { headers: { accept: "application/json" } })
    .then((response) => (response.ok ? response.json() : null))
    .then((data: Partial<EnquiryConfig> | null) => {
      const key = typeof data?.turnstileSiteKey === "string" ? data.turnstileSiteKey : "";
      return { enabled: Boolean(data?.enabled && key), turnstileSiteKey: key };
    })
    .catch(() => ({ enabled: false, turnstileSiteKey: "" }));
  return config;
}

/**
 * Delivers an enquiry. Given a token from the spam check, the server emails
 * it to the inbox and sends the visitor a reply, and this resolves "sent".
 * Without one, or if that fails, it opens the visitor's email app with the
 * enquiry filled in, addressed to the inbox, and resolves "handed-off".
 */
export async function sendEnquiry(
  enquiry: Enquiry,
  check?: { token: string; trap: string },
): Promise<"sent" | "handed-off"> {
  if (check?.token) {
    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...enquiry, turnstileToken: check.token, referral_code: check.trap }),
      });
      if (response.ok) return "sent";
    } catch {
      // Offline, or the server is down: the email app still works.
    }
  }
  const subject = `${site.contact.subject}: ${enquiry.company}`;
  window.location.href = `mailto:${site.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(formatEnquiry(enquiry))}`;
  return "handed-off";
}
