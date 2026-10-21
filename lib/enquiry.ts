import { site } from "@/content/site";

/** A campaign enquiry, as the form collects it. */
export type Enquiry = {
  name: string;
  email: string;
  company: string;
  website: string;
  phone: string;
  /** Where the campaign should run. */
  cities: string;
  budget: string;
  message: string;
};

/**
 * Where the "Start a Campaign" buttons point. With script they open the form
 * instead; without it they still reach the inbox.
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
    enquiry.cities && `Cities or regions: ${enquiry.cities}`,
    enquiry.budget && `Monthly budget: ${enquiry.budget}`,
  ].filter(Boolean);
  return enquiry.message ? `${details.join("\n")}\n\n${enquiry.message}` : details.join("\n");
}

/**
 * Delivers an enquiry. There is no backend yet, so for now this opens the
 * visitor's email app with the enquiry filled in, addressed to the studio's
 * inbox, and resolves "handed-off". When the backend exists, POST the
 * enquiry to it here and resolve "sent"; the form already handles both.
 */
export async function sendEnquiry(enquiry: Enquiry): Promise<"sent" | "handed-off"> {
  const subject = `${site.contact.subject}: ${enquiry.company}`;
  window.location.href = `mailto:${site.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(formatEnquiry(enquiry))}`;
  return "handed-off";
}
