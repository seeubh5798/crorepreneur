import { founder, work, type Project } from "@/content/site";
import { asset } from "@/lib/assets";
import { formatCompact } from "@/lib/story";
import { cssFont } from "../shared";

/*
 * Draws the phone's screen with the 2D canvas API: a reel in a generic
 * short-video layout (no platform branding). One canvas for the screen, which
 * changes rarely, and a small one for the view counter, which changes as the
 * page scrolls, so only a few kilobytes are re-uploaded per frame.
 */

export const SCREEN_W = 560;
export const SCREEN_H = 1200;

let portrait: HTMLImageElement | null = null;
let portraitReady: Promise<HTMLImageElement> | null = null;

/** Loads the founder cutout once, for drawing onto the screen. */
export function loadPortrait(): Promise<HTMLImageElement> {
  if (!portraitReady) {
    portraitReady = new Promise((resolve, reject) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        portrait = img;
        resolve(img);
      };
      img.onerror = reject;
      img.src = asset(founder.image.src);
    });
  }
  return portraitReady;
}

function fonts() {
  return {
    serif: cssFont("--font-instrument", "Georgia, serif"),
    sans: cssFont("--font-geist", "system-ui, sans-serif"),
  };
}

function bubble(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  ctx.beginPath();
  ctx.arc(x, y, s * 0.42, Math.PI * 0.62, Math.PI * 0.62 + Math.PI * 1.8);
  ctx.lineTo(x - s * 0.44, y + s * 0.44);
  ctx.closePath();
}

function plane(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  ctx.beginPath();
  ctx.moveTo(x - s * 0.46, y - s * 0.02);
  ctx.lineTo(x + s * 0.46, y - s * 0.4);
  ctx.lineTo(x + s * 0.1, y + s * 0.46);
  ctx.lineTo(x - s * 0.04, y + s * 0.08);
  ctx.closePath();
  ctx.moveTo(x - s * 0.04, y + s * 0.08);
  ctx.lineTo(x + s * 0.46, y - s * 0.4);
}

function bookmark(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  ctx.beginPath();
  ctx.moveTo(x - s * 0.3, y - s * 0.42);
  ctx.lineTo(x + s * 0.3, y - s * 0.42);
  ctx.lineTo(x + s * 0.3, y + s * 0.42);
  ctx.lineTo(x, y + s * 0.18);
  ctx.lineTo(x - s * 0.3, y + s * 0.42);
  ctx.closePath();
}

function pill(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  const r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Status bar, island and the right-hand action rail shared by every screen. */
function chrome(ctx: CanvasRenderingContext2D, comments: string) {
  const { sans } = fonts();
  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.font = `600 26px ${sans}`;
  ctx.textBaseline = "middle";
  ctx.fillText("9:41", 52, 52);
  // Battery
  ctx.strokeStyle = "rgba(255,255,255,0.85)";
  ctx.lineWidth = 2.5;
  pill(ctx, SCREEN_W - 98, 40, 46, 24);
  ctx.stroke();
  ctx.fillRect(SCREEN_W - 94, 44, 32, 16);
  // Island
  ctx.fillStyle = "#000";
  pill(ctx, SCREEN_W / 2 - 74, 28, 148, 46);
  ctx.fill();

  // Header
  ctx.fillStyle = "#fff";
  ctx.font = `600 34px ${sans}`;
  ctx.fillText("Reels", 40, 128);

  // Action rail
  const x = SCREEN_W - 58;
  ctx.lineWidth = 4;
  ctx.lineJoin = "round";
  ctx.strokeStyle = "#fff";
  ctx.fillStyle = "#fff";
  ctx.font = `600 22px ${sans}`;
  ctx.textAlign = "center";
  bubble(ctx, x, 694, 54);
  ctx.stroke();
  ctx.fillText(comments, x, 744);
  plane(ctx, x, 812, 54);
  ctx.stroke();
  ctx.fillText("Share", x, 862);
  bookmark(ctx, x, 930, 52);
  ctx.stroke();
  ctx.fillText("Save", x, 980);
  ctx.textAlign = "left";
}

function shade(ctx: CanvasRenderingContext2D) {
  const top = ctx.createLinearGradient(0, 0, 0, 220);
  top.addColorStop(0, "rgba(0,0,0,0.45)");
  top.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = top;
  ctx.fillRect(0, 0, SCREEN_W, 220);
  const bottom = ctx.createLinearGradient(0, SCREEN_H - 520, 0, SCREEN_H);
  bottom.addColorStop(0, "rgba(0,0,0,0)");
  bottom.addColorStop(1, "rgba(0,0,0,0.78)");
  ctx.fillStyle = bottom;
  ctx.fillRect(0, SCREEN_H - 520, SCREEN_W, 520);
}

function avatar(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, fill: string, initial?: string) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillStyle = fill;
  ctx.fillRect(x - r, y - r, r * 2, r * 2);
  if (!initial && portrait) {
    // Head and shoulders from the founder cutout
    const w = portrait.naturalWidth;
    const h = portrait.naturalHeight;
    const crop = w * 0.62;
    ctx.drawImage(portrait, (w - crop) / 2, h * 0.04, crop, crop, x - r, y - r, r * 2, r * 2);
  }
  if (initial) {
    ctx.fillStyle = "#fff";
    ctx.font = `600 ${r}px ${fonts().sans}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(initial, x, y + 1);
    ctx.textAlign = "left";
  }
  ctx.restore();
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
}

function wrap(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(" ");
  let line = "";
  let cursor = y;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, cursor);
      line = word;
      cursor += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, cursor);
  return cursor;
}

let grainPattern: CanvasPattern | null = null;

/** Fine monochrome noise over the whole screen, for a matte, printed finish. */
function grain(ctx: CanvasRenderingContext2D, alpha: number) {
  if (!grainPattern) {
    const tile = document.createElement("canvas");
    tile.width = tile.height = 128;
    const tileCtx = tile.getContext("2d");
    if (!tileCtx) return;
    const image = tileCtx.createImageData(128, 128);
    for (let i = 0; i < image.data.length; i += 4) {
      const v = Math.random() * 255;
      image.data[i] = image.data[i + 1] = image.data[i + 2] = v;
      image.data[i + 3] = 255;
    }
    tileCtx.putImageData(image, 0, 0);
    grainPattern = ctx.createPattern(tile, "repeat");
  }
  if (!grainPattern) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.globalCompositeOperation = "overlay";
  ctx.fillStyle = grainPattern;
  ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
  ctx.restore();
}

/** The founder's own reel: her portrait on a studio backdrop, handle and a follow button. */
export function drawFounderScreen(ctx: CanvasRenderingContext2D) {
  const { serif, sans } = fonts();
  // Charcoal seamless paper, the backdrop of a portrait studio
  const bg = ctx.createLinearGradient(0, 0, 0, SCREEN_H);
  bg.addColorStop(0, "#34323b");
  bg.addColorStop(0.6, "#24232a");
  bg.addColorStop(1, "#16161a");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);

  // Soft light on the paper behind her
  const glow = ctx.createRadialGradient(SCREEN_W * 0.5, SCREEN_H * 0.34, 20, SCREEN_W * 0.5, SCREEN_H * 0.34, 520);
  glow.addColorStop(0, "rgba(238,232,246,0.24)");
  glow.addColorStop(1, "rgba(238,232,246,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);

  // Masthead behind her head, like the cover of the site itself
  ctx.fillStyle = "rgba(240,237,230,0.9)";
  ctx.font = `italic 400 104px ${serif}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillText("Crorepreneur", SCREEN_W / 2, 300);
  ctx.textAlign = "left";

  if (portrait) {
    // Sized so her head sits below the masthead rather than over it.
    const h = SCREEN_H * 0.72;
    const w = h * (portrait.naturalWidth / portrait.naturalHeight);
    ctx.drawImage(portrait, (SCREEN_W - w) / 2, SCREEN_H - h, w, h);
  }

  grain(ctx, 0.08);
  shade(ctx);
  chrome(ctx, "8,431");

  // Handle and follow
  avatar(ctx, 76, 1012, 34, "#3a3842");
  ctx.fillStyle = "#fff";
  ctx.font = `600 28px ${sans}`;
  ctx.textBaseline = "middle";
  ctx.fillText(founder.instagram.user, 124, 1012);
  const followX = 124 + ctx.measureText(founder.instagram.user).width + 18;
  ctx.strokeStyle = "rgba(255,255,255,0.9)";
  ctx.lineWidth = 2.5;
  pill(ctx, followX, 990, 104, 44);
  ctx.stroke();
  ctx.font = `600 22px ${sans}`;
  ctx.fillText("Follow", followX + 20, 1013);

  ctx.font = `400 25px ${sans}`;
  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.textBaseline = "alphabetic";
  ctx.fillText("Founder, Crorepreneur. Turning attention into crores.", 40, 1086);
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.font = `400 22px ${sans}`;
  ctx.fillText("♪  Original audio", 40, 1126);
}

function drawArt(ctx: CanvasRenderingContext2D, project: Project) {
  ctx.save();
  ctx.globalAlpha = 0.9;
  ctx.strokeStyle = "rgba(255,255,255,0.75)";
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 3;
  if (project.art === "vessels") {
    // A thrown vase and a bowl on a shelf
    ctx.beginPath();
    ctx.moveTo(250, 300);
    ctx.lineTo(310, 300);
    ctx.bezierCurveTo(304, 370, 400, 400, 400, 520);
    ctx.bezierCurveTo(400, 630, 352, 690, 336, 690);
    ctx.lineTo(224, 690);
    ctx.bezierCurveTo(208, 690, 160, 630, 160, 520);
    ctx.bezierCurveTo(160, 400, 256, 370, 250, 300);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    for (const [y, rx] of [
      [420, 90],
      [500, 118],
      [580, 112],
      [640, 80],
    ]) {
      ctx.beginPath();
      ctx.ellipse(280, y, rx, 10, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.moveTo(400, 600);
    ctx.bezierCurveTo(400, 668, 444, 690, 470, 690);
    ctx.lineTo(520, 690);
    ctx.bezierCurveTo(546, 690, 590, 668, 590, 600);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(60, 690);
    ctx.lineTo(SCREEN_W, 690);
    ctx.stroke();
  } else if (project.art === "currents") {
    ctx.beginPath();
    ctx.arc(360, 500, 170, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(360, 500, 118, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(360, 500, 14, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    for (let i = 0; i < 12; i++) {
      const y = 250 + i * 46;
      const bend = 50 - i * 8;
      ctx.globalAlpha = i % 4 === 0 ? 0.95 : 0.45;
      ctx.beginPath();
      ctx.moveTo(-20, y);
      ctx.bezierCurveTo(180, y - bend, 360, y + bend, SCREEN_W + 20, y - bend * 0.6);
      ctx.stroke();
    }
  } else {
    // Glow: drops and soft circles
    for (const [x, y, r, a] of [
      [300, 470, 200, 0.16],
      [300, 470, 130, 0.22],
      [160, 330, 60, 0.3],
      [430, 640, 70, 0.26],
    ]) {
      ctx.globalAlpha = 1;
      ctx.fillStyle = `rgba(255,255,255,${a})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.moveTo(300, 330);
    ctx.bezierCurveTo(300, 330, 230, 430, 230, 480);
    ctx.bezierCurveTo(230, 520, 262, 552, 300, 552);
    ctx.bezierCurveTo(338, 552, 370, 520, 370, 480);
    ctx.bezierCurveTo(370, 430, 300, 330, 300, 330);
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();
}

/** A campaign reel: artwork in the brand's colours, caption and creator handle. */
export function drawProjectScreen(ctx: CanvasRenderingContext2D, projectId: string) {
  const project = work.projects.find((p) => p.id === projectId) ?? work.projects[0];
  const { serif, sans } = fonts();
  const [a, b] = project.palette;
  const bg = ctx.createLinearGradient(0, 0, SCREEN_W * 0.4, SCREEN_H);
  bg.addColorStop(0, a);
  bg.addColorStop(1, b);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);

  drawArt(ctx, project);

  ctx.fillStyle = "#fff";
  ctx.textBaseline = "alphabetic";
  ctx.font = `400 64px ${serif}`;
  wrap(ctx, project.title, 40, 820, SCREEN_W - 150, 66);

  grain(ctx, 0.08);
  shade(ctx);
  chrome(ctx, "2,190");

  avatar(ctx, 76, 1012, 34, b, project.client[0]);
  ctx.fillStyle = "#fff";
  ctx.font = `600 28px ${sans}`;
  ctx.textBaseline = "middle";
  ctx.fillText(project.handle, 124, 1012);
  ctx.font = `400 23px ${sans}`;
  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(`Paid partnership · ${project.sector}`, 40, 1086);
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.font = `400 22px ${sans}`;
  ctx.fillText(`♪  ${project.client} × Crorepreneur`, 40, 1126);
}

export const COUNTER_W = 512;
export const COUNTER_H = 96;

/** The view counter that sits over the reel. */
export function drawCounter(ctx: CanvasRenderingContext2D, views: number) {
  const { sans } = fonts();
  ctx.clearRect(0, 0, COUNTER_W, COUNTER_H);
  ctx.fillStyle = "rgba(10,10,14,0.55)";
  pill(ctx, 4, 12, COUNTER_W - 8, COUNTER_H - 24);
  ctx.fill();
  // Play glyph
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.moveTo(40, 32);
  ctx.lineTo(64, 48);
  ctx.lineTo(40, 64);
  ctx.closePath();
  ctx.fill();
  ctx.font = `600 34px ${sans}`;
  ctx.textBaseline = "middle";
  const text = `${views >= 1e7 - 0.5 ? "1,00,00,000" : formatCompact(views)} views`;
  ctx.fillText(text, 84, 49);
}
