import { enquiry as form, enquiryEmails, site } from "../content/site";
import type { Enquiry } from "../lib/enquiry";

/**
 * The two emails sent for every enquiry, as Resend's API takes them. The
 * copy lives in content/site.ts (`enquiryEmails`); this file lays it out.
 *
 * Email clients only render simple HTML, so the layout is tables and inline
 * styles, in the site's colours, with system fonts (and Georgia for the
 * serif voice) since web fonts rarely load in an inbox. The logo is a PNG,
 * because Gmail and Outlook don't show SVG.
 */
export type Email = {
  from: string;
  to: string[];
  reply_to: string[];
  subject: string;
  html: string;
  text: string;
};

const SANS = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const SERIF = "'Instrument Serif', Georgia, 'Times New Roman', serif";

const INK = "#0a0a0c";
const LIGHT = "#eeede8";
const LAVENDER = "#a59ce6";
const PAPER = "#f2f1ed";
const CARD = "#ffffff";
const SOFT = "#f8f7f4";
const LILAC = "#e6e3f3";
const FG = "#151517";
const FG2 = "#57565a";
const FG3 = "#87867f";
const LINE = "#e4e2dc";
const VIOLET = "#5548ba";

/** To the inbox: the enquiry in full, set so that replying answers the sender. */
export function inboxEmail(enquiry: Enquiry, received: Date): Email {
  const copy = enquiryEmails.inbox;
  const subject = fill(copy.subject, enquiry);
  const when = received.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });
  const details = fields(enquiry, true);

  const html = frame({
    title: subject,
    preview: fill(copy.intro, enquiry),
    footer: copy.footer,
    rows: [
      header(`
        <p style="${eyebrow(LAVENDER)}">${esc(copy.title)}</p>
        <h1 style="margin:0;font-family:${SANS};font-size:32px;line-height:1.1;font-weight:700;letter-spacing:-0.02em;color:${LIGHT};">${esc(enquiry.company)}</h1>
        <p style="margin:10px 0 0;font-family:${SANS};font-size:15px;line-height:1.5;color:#bdbcb6;">${esc(enquiry.name)} &middot; <a href="mailto:${esc(enquiry.email)}" style="color:${LIGHT};">${esc(enquiry.email)}</a></p>`),
      section(`<p style="${paragraph}">${esc(fill(copy.intro, enquiry))}</p>`, "32px 36px 8px"),
      section(card(details, enquiry.message), "16px 36px 8px"),
      section(
        `<p style="margin:0;font-family:${SANS};font-size:13px;line-height:1.5;color:${FG3};">${esc(copy.receivedLabel)}: ${esc(when)} IST</p>`,
        "16px 36px 36px",
        true,
      ),
    ],
  });

  const text = [
    subject,
    "",
    fill(copy.intro, enquiry),
    "",
    ...details.map(([label, value]) => `${label}: ${value}`),
    ...(enquiry.message ? ["", `${form.fields.message.label}:`, enquiry.message] : []),
    "",
    `${copy.receivedLabel}: ${when} IST`,
  ].join("\n");

  return {
    from: copy.from,
    to: [site.contact.email],
    reply_to: [enquiry.email],
    subject,
    html,
    text,
  };
}

/** To the sender: thanks, a promise of an answer within 24 hours, and a copy of what they sent. */
export function replyEmail(enquiry: Enquiry): Email {
  const copy = enquiryEmails.reply;
  const subject = fill(copy.subject, enquiry);
  const firstName = first(enquiry.name);
  const details = fields(enquiry, false);
  const call = copy.call.href ? bookingLink(copy.call.href, enquiry) : "";

  const steps = copy.next
    .map(
      (step, index) => `
        <tr>
          <td width="44" valign="top" style="padding:16px 0;border-top:1px solid ${LINE};font-family:${SANS};font-size:13px;line-height:1.5;font-weight:600;color:${VIOLET};">${String(index + 1).padStart(2, "0")}</td>
          <td valign="top" style="padding:16px 0;border-top:1px solid ${LINE};">
            <p style="margin:0;font-family:${SANS};font-size:15px;line-height:1.4;font-weight:600;color:${FG};">${esc(step.title)}</p>
            <p style="margin:4px 0 0;font-family:${SANS};font-size:14px;line-height:1.55;color:${FG2};">${esc(step.text)}</p>
          </td>
        </tr>`,
    )
    .join("");

  const html = frame({
    title: subject,
    preview: fill(copy.preview, enquiry),
    footer: copy.footer,
    rows: [
      header(`
        <p style="${eyebrow(LAVENDER)}">${esc(copy.eyebrow)}</p>
        <h1 style="margin:0;font-family:${SANS};font-size:42px;line-height:1.06;font-weight:700;letter-spacing:-0.03em;color:${LIGHT};">${esc(copy.title)}<br><span style="font-family:${SERIF};font-size:48px;font-style:italic;font-weight:400;letter-spacing:-0.01em;color:${LAVENDER};">${esc(firstName)}.</span></h1>`),
      section(`<p style="${paragraph}">${esc(fill(copy.body, enquiry))}</p>`, "36px 36px 8px"),
      call
        ? section(
            `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${LILAC};border-radius:16px;">
              <tr><td style="padding:22px 24px;">
                <p style="margin:0 0 14px;font-family:${SANS};font-size:15px;line-height:1.4;font-weight:600;color:${FG};">${esc(copy.call.intro)}</p>
                <a href="${esc(call)}" style="display:inline-block;padding:13px 22px;border-radius:999px;background-color:${INK};font-family:${SANS};font-size:14px;line-height:1;font-weight:600;color:${PAPER};text-decoration:none;">${esc(copy.call.label)} &rarr;</a>
              </td></tr>
            </table>`,
            "24px 36px 4px",
          )
        : "",
      section(
        `<p style="${eyebrow(VIOLET)}margin-bottom:6px;">${esc(copy.nextTitle)}</p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${steps}</table>`,
        "28px 36px 4px",
      ),
      section(card(details, enquiry.message, copy.summaryTitle), "16px 36px 8px"),
      section(
        `<p style="margin:0;font-family:${SANS};font-size:15px;line-height:1.5;color:${FG2};">${esc(copy.signOff)}</p>
        <p style="margin:6px 0 0;font-family:${SERIF};font-size:30px;line-height:1.1;font-style:italic;color:${FG};">${esc(copy.signature.name)}</p>
        <p style="margin:4px 0 0;font-family:${SANS};font-size:13px;line-height:1.5;color:${FG3};">${esc(copy.signature.role)}</p>`,
        "28px 36px 40px",
        true,
      ),
    ],
  });

  const text = [
    `${copy.title} ${firstName}.`,
    "",
    fill(copy.body, enquiry),
    ...(call ? ["", `${copy.call.intro} ${copy.call.label}: ${call}`] : []),
    "",
    copy.nextTitle,
    ...copy.next.map((step, index) => `${index + 1}. ${step.title}: ${step.text}`),
    "",
    copy.summaryTitle,
    ...details.map(([label, value]) => `${label}: ${value}`),
    ...(enquiry.message ? [`${form.fields.message.label}:`, enquiry.message] : []),
    "",
    copy.signOff,
    copy.signature.name,
    copy.signature.role,
    "",
    site.url,
    copy.footer,
  ].join("\n");

  return {
    from: copy.from,
    to: [enquiry.email],
    reply_to: [copy.replyTo],
    subject,
    html,
    text,
  };
}

/* ---------- Pieces ---------- */

const paragraph = `margin:0;font-family:${SANS};font-size:16px;line-height:1.65;color:#3d3c41;`;

function eyebrow(color: string) {
  return `margin:0 0 16px;font-family:${SANS};font-size:12px;line-height:1.4;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:${color};`;
}

/** The whole email: the page, a 600px column, and the footer under it. */
function frame({ title, preview, footer, rows }: { title: string; preview: string; footer: string; rows: string[] }) {
  const instagram = site.socials.find((social) => social.network === "instagram")?.href;
  const links = [
    `<a href="${site.url}" style="color:${FG2};text-decoration:none;">${site.url.replace(/^https?:\/\//, "")}</a>`,
    instagram ? `<a href="${esc(instagram)}" style="color:${FG2};text-decoration:none;">Instagram</a>` : "",
  ]
    .filter(Boolean)
    .join(" &middot; ");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${esc(title)}</title>
</head>
<body style="margin:0;padding:0;background-color:${PAPER};">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${esc(preview)}${"&#8199;&#847; ".repeat(60)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${PAPER};">
<tr><td align="center" style="padding:32px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
${rows.join("\n")}
<tr><td style="padding:28px 16px 8px;text-align:center;font-family:${SANS};font-size:12px;line-height:1.7;color:${FG3};">
${links}<br>${esc(footer)}
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

/** The dark band at the top: the logo, then whatever leads the email. */
function header(content: string) {
  return `<tr><td style="background-color:${INK};border-radius:20px 20px 0 0;padding:32px 36px 0;">
<a href="${site.url}" style="text-decoration:none;"><img src="${site.url}/brand/email-logo.png" width="196" height="25" alt="${esc(site.name)}" style="display:block;width:196px;height:25px;border:0;outline:none;"></a>
</td></tr>
<tr><td style="background-color:${INK};padding:40px 36px 44px;">${content}</td></tr>`;
}

/** A row of the white card; the last one rounds its bottom corners. */
function section(content: string, padding: string, last = false) {
  const corners = last ? "border-radius:0 0 20px 20px;" : "";
  return `<tr><td style="background-color:${CARD};${corners}padding:${padding};">${content}</td></tr>`;
}

/** The enquiry's details, label over value, in a soft panel. */
function card(details: [string, string][], message: string, title?: string) {
  const row = (label: string, value: string, multiline = false) => `
    <tr><td style="padding:8px 22px;">
      <p style="margin:0;font-family:${SANS};font-size:12px;line-height:1.5;color:${FG3};">${esc(label)}</p>
      <p style="margin:2px 0 0;font-family:${SANS};font-size:15px;line-height:1.55;color:${FG};">${multiline ? esc(value).replace(/\n/g, "<br>") : esc(value)}</p>
    </td></tr>`;
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${SOFT};border:1px solid ${LINE};border-radius:14px;">
    ${title ? `<tr><td style="padding:20px 22px 4px;"><p style="${eyebrow(VIOLET)}margin:0;">${esc(title)}</p></td></tr>` : ""}
    <tr><td style="height:10px;line-height:10px;font-size:0;">&nbsp;</td></tr>
    ${details.map(([label, value]) => row(label, value)).join("")}
    ${message ? row(form.fields.message.label, message, true) : ""}
    <tr><td style="height:12px;line-height:12px;font-size:0;">&nbsp;</td></tr>
  </table>`;
}

/** The fields that were filled in, labelled as on the form. The reply leaves out the sender's own name and email. */
function fields(enquiry: Enquiry, withContact: boolean): [string, string][] {
  const all: [string, string][] = [
    [enquiryEmails.inbox.labels.name, withContact ? enquiry.name : ""],
    [enquiryEmails.inbox.labels.email, withContact ? enquiry.email : ""],
    [form.fields.company.label, enquiry.company],
    [form.fields.website.label, enquiry.website],
    [form.fields.cities.label, enquiry.cities],
    [form.budgetLabel, enquiry.budget],
    [form.fields.phone.label, enquiry.phone],
  ];
  return all.filter(([, value]) => value);
}

/** A Calendly link opens with the sender's name and email already filled in. */
function bookingLink(href: string, enquiry: Enquiry) {
  try {
    const url = new URL(href);
    if (url.hostname.endsWith("calendly.com")) {
      url.searchParams.set("name", enquiry.name);
      url.searchParams.set("email", enquiry.email);
    }
    return url.toString();
  } catch {
    return href;
  }
}

function first(name: string) {
  return name.split(/\s+/)[0] || name;
}

/** Puts the sender's details into a line of copy. */
function fill(template: string, enquiry: Enquiry) {
  return template
    .replaceAll("{firstName}", first(enquiry.name))
    .replaceAll("{name}", enquiry.name)
    .replaceAll("{brand}", enquiry.company);
}

/** Everything the sender typed is escaped before it goes into the HTML. */
function esc(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
