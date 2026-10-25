import type { Enquiry } from "../lib/enquiry";
import { inboxEmail, replyEmail, type Email } from "./emails";

/**
 * The site's one piece of server code, on Cloudflare Workers. Every page is
 * a static file in out/, served straight from Cloudflare's assets; only
 * /api/* and /videos/* reach this script (see wrangler.jsonc).
 *
 * GET  /api/enquiry  tells the form whether it can send, and the site key
 *                    for its spam check (Cloudflare Turnstile).
 * POST /api/enquiry  checks the token from that spam check, emails the
 *                    enquiry to the inbox (replying answers the sender),
 *                    then sends the sender a reply. Emails go out through
 *                    Resend.
 * GET  /videos/*     the case studies' videos, in pieces when a browser
 *                    asks for them that way (see `video`).
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

/** The part of a Worker's context this script uses. */
type Context = { waitUntil(promise: Promise<unknown>): void };

const worker = {
  async fetch(request: Request, env: Env, context: Context): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/videos/")) return video(request, env, context, url);
    if (url.pathname !== "/api/enquiry") return env.ASSETS.fetch(request);

    if (request.method === "GET") {
      const on = ready(env);
      return json({
        enabled: on,
        turnstileSiteKey: on ? env.TURNSTILE_SITE_KEY : "",
      });
    }
    if (request.method === "POST") return receive(request, env, url);
    return json({ error: "method" }, 405, { allow: "GET, POST" });
  },
};

export default worker;

/**
 * A video. Safari, on iPhones and Macs, plays a video only from a server
 * that sends it in pieces when asked (a Range request, answered "206 Partial
 * Content"), and Cloudflare's file server always sends the whole file. So
 * videos come through here. Each is kept in Cloudflare's cache, which cuts
 * pieces from what it holds, under a key that changes whenever the file
 * does. Until a data centre has its copy, the piece is cut from the file as
 * it streams past, so nothing waits for (or holds) the whole file.
 */
async function video(request: Request, env: Env, context: Context, url: URL): Promise<Response> {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response(null, { status: 405, headers: { allow: "GET, HEAD" } });
  }
  const path = `${url.origin}${url.pathname}`;
  const file = await env.ASSETS.fetch(new Request(path));
  const etag = file.headers.get("etag");
  // A missing video gets the site's 404 page.
  if (!file.ok || !file.body || !etag) return file;

  const head = request.method === "HEAD";
  const headers = new Headers(file.headers);
  headers.set("accept-ranges", "bytes");

  // The browser already has this version, whole or in part: nothing to send.
  if (sameFile(request.headers.get("if-none-match"), etag)) {
    void file.body.cancel();
    return new Response(null, { status: 304, headers });
  }

  // If-Range names the copy the browser has part of; if the file has changed
  // since, it gets the whole new one instead of a piece.
  const ifRange = request.headers.get("if-range");
  const range = ifRange && ifRange !== etag ? null : parseRange(request.headers.get("range"));

  // Cloudflare's cache cuts the piece itself, from its copy of the file.
  const cache = (caches as unknown as { default?: Cache }).default;
  const key = new Request(`${path}?v=${encodeURIComponent(etag)}`);
  const kept = cache && (await cache.match(range ? new Request(key, { headers: { range: range.header } }) : key));
  if (kept && (!range || kept.status === 206 || kept.status === 416)) {
    void file.body.cancel();
    const out = new Headers(kept.headers);
    // The browser gets the file's own caching rules, not the cache's.
    const rule = file.headers.get("cache-control");
    if (rule) out.set("cache-control", rule);
    else out.delete("cache-control");
    if (head) void kept.body?.cancel();
    return new Response(head ? null : kept.body, { status: kept.status, headers: out });
  }
  if (kept) void kept.body?.cancel();

  // Not in this data centre's cache yet: a copy is made for next time from a
  // second read of the file, while this answer comes from the first.
  if (cache) context.waitUntil(keep(env, path, cache, key).catch(() => undefined));

  const length = file.headers.get("content-length");
  const size = length === null ? NaN : Number(length);
  // Without its size, the file is read whole to cut the piece (the local preview does this).
  if (!Number.isFinite(size)) return fromWhole(file, headers, range, head);

  if (!range) {
    if (head) void file.body.cancel();
    return new Response(head ? null : file.body, { status: 200, headers });
  }
  const piece = range.within(size);
  if (!piece) {
    void file.body.cancel();
    return unsatisfiable(size);
  }
  const [first, last] = piece;
  headers.set("content-range", `bytes ${first}-${last}/${size}`);
  headers.set("content-length", String(last - first + 1));
  if (head) {
    void file.body.cancel();
    return new Response(null, { status: 206, headers });
  }
  const body = first === 0 && last === size - 1 ? file.body : slice(file.body, first, last);
  return new Response(fixedLength(body, last - first + 1), { status: 206, headers });
}

/** Puts a copy of the file in the cache, as the cache needs it: with its length, so it can cut pieces. */
async function keep(env: Env, path: string, cache: Cache, key: Request): Promise<void> {
  const copy = await env.ASSETS.fetch(new Request(path));
  if (!copy.ok || !copy.body) return;
  const headers = new Headers(copy.headers);
  headers.set("accept-ranges", "bytes");
  headers.set("cache-control", "public, max-age=31536000, immutable");
  const body = copy.headers.has("content-length") ? copy.body : await copy.arrayBuffer();
  await cache.put(key, new Response(body, { headers }));
}

/** The answer when the file's size is unknown: read it whole, then cut the piece. */
async function fromWhole(file: Response, headers: Headers, range: ByteRange | null, head: boolean): Promise<Response> {
  const bytes = await file.arrayBuffer();
  const size = bytes.byteLength;
  if (!range) {
    headers.set("content-length", String(size));
    return new Response(head ? null : bytes, { status: 200, headers });
  }
  const piece = range.within(size);
  if (!piece) return unsatisfiable(size);
  const [first, last] = piece;
  headers.set("content-range", `bytes ${first}-${last}/${size}`);
  headers.set("content-length", String(last - first + 1));
  return new Response(head ? null : bytes.slice(first, last + 1), { status: 206, headers });
}

function unsatisfiable(size: number): Response {
  return new Response(null, { status: 416, headers: { "content-range": `bytes */${size}`, "accept-ranges": "bytes" } });
}

/** Bytes `first` to `last` of a stream, as a stream. It stops reading the file once it has them. */
function slice(body: ReadableStream<Uint8Array>, first: number, last: number): ReadableStream<Uint8Array> {
  const reader = body.getReader();
  let seen = 0;
  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) {
          controller.close();
          return;
        }
        const start = Math.max(first - seen, 0);
        const end = Math.min(last + 1 - seen, value.byteLength);
        seen += value.byteLength;
        if (end > start) controller.enqueue(value.subarray(start, end));
        if (seen > last) {
          controller.close();
          void reader.cancel();
          return;
        }
        if (end > start) return;
      }
    },
    cancel(reason) {
      return reader.cancel(reason);
    },
  });
}

/** On Cloudflare, a stream that says its length up front, so the browser gets a Content-Length. */
function fixedLength(body: ReadableStream<Uint8Array>, length: number): ReadableStream<Uint8Array> {
  const Fixed = (globalThis as { FixedLengthStream?: new (length: number) => TransformStream<Uint8Array, Uint8Array> })
    .FixedLengthStream;
  return Fixed ? body.pipeThrough(new Fixed(length)) : body;
}

type ByteRange = {
  /** The header again, tidied, to ask the cache with. */
  header: string;
  /** Its first and last byte in a file of this size; null if it starts past the end. */
  within(size: number): [number, number] | null;
};

/**
 * The one piece of a file a Range header asks for. Null means the whole
 * file: no header, several pieces at once, or one that makes no sense,
 * which a server may ignore.
 */
function parseRange(header: string | null): ByteRange | null {
  const match = header ? /^bytes=(\d*)-(\d*)$/.exec(header.trim()) : null;
  if (!match || (!match[1] && !match[2])) return null;
  const [, from, to] = match;
  if (from && to && Number(to) < Number(from)) return null;
  return {
    header: `bytes=${from}-${to}`,
    within(size) {
      if (!from) {
        // The last so many bytes.
        const length = Number(to);
        return length > 0 && size > 0 ? [Math.max(0, size - length), size - 1] : null;
      }
      const first = Number(from);
      if (first >= size) return null;
      return [first, to ? Math.min(Number(to), size - 1) : size - 1];
    },
  };
}

/** Whether an If-None-Match header names this version of the file. */
function sameFile(header: string | null, etag: string): boolean {
  if (!header) return false;
  const bare = (tag: string) => tag.trim().replace(/^W\//, "");
  return header.split(",").some((tag) => tag.trim() === "*" || bare(tag) === bare(etag));
}

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
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...headers,
    },
  });
}
