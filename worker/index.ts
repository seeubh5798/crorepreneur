import type { Enquiry } from "../lib/enquiry";
import { inboxEmail, replyEmail, type Email } from "./emails";

/**
 * The site's one piece of server code, on Cloudflare Workers. Every page is
 * a static file in out/, served straight from Cloudflare's assets; only
 * /api/* reaches this script (see wrangler.jsonc).
 *
 * GET  /api/enquiry  tells the form whether it can send, and the site key
 *                    for its spam check (Cloudflare Turnstile).
 * POST /api/enquiry  checks the token from that spam check, emails the
 *                    enquiry to the inbox (replying answers the sender),
 *                    then sends the sender a reply. Emails go out through
 *                    Resend.
 *
 * It sends only once RESEND_API_KEY, TURNSTILE_SECRET_KEY (secrets, set on
 * the Worker) and TURNSTILE_SITE_KEY (in wrangler.jsonc) are all there.
 * Until then, and whenever sending fails, the form opens the visitor's
 * email app instead, so no enquiry is lost.
 */

type Env = {
  ASSETS: { fetch(request: Request): Promise<Response> };
  RESEND_API_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
  TURNSTILE_SITE_KEY?: string;
  /** For local testing only: a stand-in for Resend's API. */
  RESEND_API_URL?: string;
};

/** The longest each field may be. Longer input is cut, not refused. */
const LIMITS: Record<keyof Enquiry, number> = {
  name: 120,
  email: 254,
  company: 160,
  website: 300,
  phone: 40,
  cities: 300,
  budget: 40,
  message: 5000,
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const worker = {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname !== "/api/enquiry") return env.ASSETS.fetch(request);

    if (request.method === "GET") {
      const on = ready(env);
      return json({ enabled: on, turnstileSiteKey: on ? env.TURNSTILE_SITE_KEY : "" });
    }
    if (request.method === "POST") return receive(request, env, url);
    return json({ error: "method" }, 405, { allow: "GET, POST" });
  },
};

export default worker;

function ready(env: Env) {
  return Boolean(env.RESEND_API_KEY && env.TURNSTILE_SECRET_KEY && env.TURNSTILE_SITE_KEY);
}

async function receive(request: Request, env: Env, url: URL): Promise<Response> {
  if (!ready(env)) return json({ error: "off" }, 503);

  // Only the site's own pages post here.
  const origin = request.headers.get("origin");
  if (origin && origin !== url.origin) return json({ error: "origin" }, 403);

  let body: Record<string, unknown>;
  try {
    const raw = await request.text();
    if (raw.length > 20_000) return json({ error: "size" }, 413);
    body = JSON.parse(raw);
    if (!body || typeof body !== "object") throw new Error("not an object");
  } catch {
    return json({ error: "body" }, 400);
  }

  // A field people never see (see EnquiryDialog): anything in it came from a bot.
  // It is told the enquiry went through, so it has no reason to try again.
  if (typeof body.referral_code === "string" && body.referral_code.trim()) {
    console.warn("Dropped an enquiry: the hidden trap field was filled in.");
    return json({ ok: true });
  }

  const enquiry = clean(body);
  if (!enquiry) return json({ error: "fields" }, 400);

  if (!(await human(body.turnstileToken, request, env))) return json({ error: "check" }, 403);

  let inbox: string;
  try {
    inbox = await send(env, inboxEmail(enquiry, new Date()));
  } catch (error) {
    console.error("The enquiry email failed:", error);
    return json({ error: "send" }, 502);
  }
  let reply = "";
  try {
    reply = await send(env, replyEmail(enquiry));
  } catch (error) {
    // The enquiry is in the inbox, which is what matters; the reply can be written by hand.
    console.error("The reply email failed:", error);
  }
  // Resend's ids for the two emails: search for them under Emails in Resend.
  console.log("Enquiry sent.", { inbox, reply: reply || "failed" });
  return json({ ok: true });
}

/** The enquiry, trimmed and cut to length, or null when a required field is missing. */
function clean(body: Record<string, unknown>): Enquiry | null {
  const field = (key: keyof Enquiry) => {
    const value = typeof body[key] === "string" ? (body[key] as string) : "";
    // Everything but the message is one line: no breaks or control characters, which
    // would otherwise reach the email's subject and headers.
    const tidy = key === "message" ? value.replace(/\r\n?/g, "\n") : value.replace(/[\u0000-\u001f\u007f]+/g, " ");
    return tidy.trim().slice(0, LIMITS[key]);
  };
  const enquiry: Enquiry = {
    name: field("name"),
    email: field("email"),
    company: field("company"),
    website: field("website"),
    phone: field("phone"),
    cities: field("cities"),
    budget: field("budget"),
    message: field("message"),
  };
  if (!enquiry.name || !enquiry.company || !EMAIL.test(enquiry.email)) return null;
  return enquiry;
}

/** Asks Turnstile whether the token came from a person. Each token works once. */
async function human(token: unknown, request: Request, env: Env) {
  if (typeof token !== "string" || !token || token.length > 2048) return false;
  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        secret: env.TURNSTILE_SECRET_KEY,
        response: token,
        remoteip: request.headers.get("cf-connecting-ip") ?? undefined,
      }),
    });
    const outcome = (await response.json()) as { success?: boolean };
    return outcome.success === true;
  } catch {
    return false;
  }
}

/** Sends one email through Resend, and returns its id there. */
async function send(env: Env, email: Email): Promise<string> {
  const response = await fetch(`${env.RESEND_API_URL || "https://api.resend.com"}/emails`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(email),
  });
  if (!response.ok) throw new Error(`Resend answered ${response.status}: ${(await response.text()).slice(0, 300)}`);
  const sent = (await response.json().catch(() => ({}))) as { id?: string };
  return sent.id ?? "unknown";
}

function json(data: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...headers },
  });
}
