"use client";

import {
  ArrowUpRight,
  GalleryVerticalEnd,
  Maximize,
  Minimize,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  SkipForward,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import type { CaseVideo } from "@/content/site";
import { asset } from "@/lib/assets";
import { getLenis } from "@/lib/smooth";

const REDUCED = "(prefers-reduced-motion: reduce)";
/** How long the controls stay up after the last move of the mouse or tap, while playing. */
const IDLE_MS = 2800;
/** How far the skip buttons jump, and the arrow keys. */
const SKIP_SECONDS = 10;
const ARROW_SECONDS = 5;
/** Keys a focused slider answers itself. */
const SLIDER_KEYS = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "PageUp", "PageDown"];

/** Videos wait for a press of play when the visitor asked for less motion or to save data. */
function quiet(): boolean {
  const saveData = (navigator as { connection?: { saveData?: boolean } }).connection?.saveData;
  return Boolean(saveData) || typeof IntersectionObserver === "undefined" || window.matchMedia(REDUCED).matches;
}

function subscribe(onChange: () => void) {
  const query = window.matchMedia(REDUCED);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/**
 * The copy of a video to play: the full-quality one, unless the visitor is
 * on a slow connection or saving data, who get the light one.
 */
function pick(clip: CaseVideo): string {
  const connection = (navigator as { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  const slow = Boolean(connection?.saveData) || /(^|-)2g|3g/.test(connection?.effectiveType ?? "");
  return asset(clip.hd && !slow ? clip.hd : clip.src);
}

/** "1:05". */
function clock(seconds: number): string {
  const whole = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
}

/** Why a play() call failed, if it says. */
function failure(error: unknown): string | undefined {
  return (error as { name?: string } | null)?.name;
}

/**
 * Before it starts; playing by itself, silently; waiting on its still for a
 * press of play; or playing because someone asked for it.
 */
type Mode = "starting" | "silent" | "still" | "watching";

export type PlayerLabels = Record<
  | "sound"
  | "play"
  | "pause"
  | "replay"
  | "back"
  | "forward"
  | "mute"
  | "unmute"
  | "volume"
  | "seek"
  | "of"
  | "fullscreen"
  | "exitFullscreen"
  | "reels"
  | "next"
  | "close"
  | "nowPlaying",
  string
>;

type CasePlayerProps = {
  /** Whose video it is: the case's name. */
  name: string;
  videos: readonly CaseVideo[];
  /** "tall" for Reels, "wide" for films. */
  shape: "tall" | "wide";
  labels: PlayerLabels;
};

type FullscreenDocument = Document & {
  webkitFullscreenElement?: Element | null;
  webkitFullscreenEnabled?: boolean;
  webkitExitFullscreen?: () => void;
};
type FullscreenElement = HTMLElement & { webkitRequestFullscreen?: () => void };

/**
 * A case's video, across the full width of the page, in a player made to
 * feel like a film night rather than a web page: a slim violet progress bar
 * with the time left, play, ten seconds back and forward, sound, the title,
 * and full screen, all fading away while it plays and back with a move of
 * the mouse or a tap. There is no download, picture in picture or speed
 * menu, and no right-click menu on the video.
 *
 * It fills the width: a film is trimmed a little at the top and bottom when
 * the screen is wider than the film, and a Reel on a phone held upright a
 * little at the top and bottom too (never more than about a sixth). On
 * very wide or very short screens, and in full screen, the whole picture
 * shows, on a soft wash of its own colours. With several Reels, a panel on
 * the right switches between them, and each rolls on to the next.
 *
 * Like a title on Netflix, it starts by itself, silently, while it is on
 * screen (browsers allow nothing louder), and "Sound on", a click on the
 * picture or M plays it from the start with sound. With reduced motion or
 * data saver on, or when a phone won't let it start, it waits on its still
 * for a press of play. On an iPhone, which can't put a page element full
 * screen, full screen fills the screen within the page, so the controls stay
 * these ones.
 *
 * Keys, once it has focus: space or K to play and pause, the arrows to skip
 * five seconds, M for sound, F for full screen, Escape to leave it.
 */
export function CasePlayer({ name, videos, shape, labels }: CasePlayerProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const reelsButtonRef = useRef<HTMLButtonElement>(null);
  const modeRef = useRef<Mode>("starting");
  const indexRef = useRef(0);
  const idleRef = useRef(0);
  const clickRef = useRef(0);
  const toggledRef = useRef(0);
  const pointerRef = useRef("mouse");

  const [index, setIndex] = useState(0);
  const [mode, setModeState] = useState<Mode>("starting");
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [volume, setVolume] = useState(1);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [waiting, setWaiting] = useState(false);
  const [ended, setEnded] = useState(false);
  const [awake, setAwake] = useState(true);
  const [reelsOpen, setReelsOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  /** Full screen within the page, for iPhones, and the height the player leaves behind. */
  const [filling, setFilling] = useState(false);
  const [room, setRoom] = useState(0);
  /** The picture would have to grow more than 2.2 times to fill the width (a 540p film on a 4K screen). */
  const [stretched, setStretched] = useState(false);
  const waits = useSyncExternalStore(subscribe, quiet, () => false);

  const current = videos[index];
  const several = videos.length > 1;
  const shown: Mode = waits && (mode === "starting" || mode === "silent") ? "still" : mode;
  const chrome = awake || !playing || reelsOpen;
  const full = fullscreen || filling;

  function setMode(next: Mode) {
    modeRef.current = next;
    setModeState(next);
  }

  // The progress bar is painted straight onto the page, every frame while
  // playing, so it glides rather than ticks.
  function paint() {
    const video = videoRef.current;
    const bar = barRef.current;
    if (!video || !bar) return;
    const length = video.duration;
    const known = Number.isFinite(length) && length > 0;
    let loaded = 0;
    for (let i = 0; i < video.buffered.length; i += 1) {
      if (video.buffered.start(i) <= video.currentTime + 0.5) loaded = video.buffered.end(i);
    }
    bar.style.setProperty("--played", known ? String(video.currentTime / length) : "0");
    bar.style.setProperty("--buffered", known ? String(Math.min(1, loaded / length)) : "0");
  }

  // Once it plays, the controls fade after a while, until the next move or tap.
  useEffect(() => {
    if (!playing) return;
    window.clearTimeout(idleRef.current);
    idleRef.current = window.setTimeout(() => setAwake(false), IDLE_MS);
  }, [playing]);

  useEffect(() => {
    if (!playing) return;
    let frame = 0;
    const tick = () => {
      paint();
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing]);

  // The page is written with the light copy, which nothing downloads until
  // it plays; once in the browser, the player swaps in the right one.
  useEffect(() => {
    const video = videoRef.current;
    if (video) video.src = pick(videos[0]);
  }, [videos]);

  // It starts by itself, silently, the first time it is on screen (unless it
  // waits for a press of play). Whatever is playing pauses off screen and
  // picks up again on return, unless it was paused by hand.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (!waits) {
      video.muted = true;
      video.defaultMuted = true;
    }
    let started = waits;
    let pausedByScroll = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!started) {
            started = true;
            video
              .play()
              .then(() => {
                if (modeRef.current === "starting") setMode("silent");
              })
              .catch((error: unknown) => {
                // Scrolled away before it began: try again on return. (Paused by
                // hand, or another Reel chosen, it stays as it was left.)
                if (failure(error) === "AbortError") {
                  if (pausedByScroll && modeRef.current === "starting") started = false;
                  return;
                }
                if (modeRef.current === "starting") setMode("still");
              });
          } else if (pausedByScroll) {
            void video.play().catch(() => undefined);
          }
          pausedByScroll = false;
        } else if (!video.paused) {
          video.pause();
          pausedByScroll = true;
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [waits]);

  // Full screen comes and goes with Escape, too.
  useEffect(() => {
    const doc = document as FullscreenDocument;
    const onChange = () => {
      const element = doc.fullscreenElement ?? doc.webkitFullscreenElement ?? null;
      setFullscreen(element !== null && element === stageRef.current);
    };
    doc.addEventListener("fullscreenchange", onChange);
    doc.addEventListener("webkitfullscreenchange", onChange);
    return () => {
      doc.removeEventListener("fullscreenchange", onChange);
      doc.removeEventListener("webkitfullscreenchange", onChange);
    };
  }, []);

  // Full screen within the page: the page behind stays put.
  useEffect(() => {
    if (!filling) return;
    const root = document.documentElement;
    root.classList.add("video-full");
    getLenis()?.stop();
    return () => {
      root.classList.remove("video-full");
      getLenis()?.start();
    };
  }, [filling]);

  // Filling the width is worth it only while the picture stays fairly sharp.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => setStretched(stage.clientWidth > current.width * 2.2));
    observer.observe(stage);
    return () => observer.disconnect();
  }, [current.width]);

  // The open Reels panel shows the Reel that is playing.
  useEffect(() => {
    const panel = panelRef.current;
    if (!reelsOpen || !panel) return;
    const now = panel.querySelector<HTMLElement>('[aria-current="true"]');
    const list = panel.querySelector<HTMLElement>("ol");
    if (!now || !list) return;
    panel.scrollTop = now.offsetTop - panel.clientHeight / 2 + now.offsetHeight / 2;
    list.scrollLeft = now.offsetLeft - list.offsetLeft - 8;
  }, [reelsOpen, index]);

  useEffect(
    () => () => {
      window.clearTimeout(idleRef.current);
      window.clearTimeout(clickRef.current);
    },
    [],
  );

  /** Brings the controls up, and lets them fade again after a while. */
  function wake() {
    setAwake(true);
    window.clearTimeout(idleRef.current);
    idleRef.current = window.setTimeout(() => setAwake(false), IDLE_MS);
  }

  /** Puts one of the videos in the player and plays it. With `sound`, call it from a click. */
  function load(at: number, sound: boolean) {
    const video = videoRef.current;
    if (!video) return;
    indexRef.current = at;
    setIndex(at);
    setEnded(false);
    setTime(0);
    setDuration(0);
    video.poster = asset(videos[at].poster);
    video.src = pick(videos[at]);
    video.muted = !sound;
    paint();
    void video.play().catch((error: unknown) => {
      // Only when the sound itself was refused (Safari, when it isn't a click),
      // and only for this Reel, does it play silently instead.
      if (!sound || failure(error) !== "NotAllowedError" || indexRef.current !== at) return;
      video.muted = true;
      void video.play().catch(() => undefined);
    });
  }

  /** From a click: the video again from the start (unless it has only just begun), with sound. */
  function watch() {
    const video = videoRef.current;
    if (!video) return;
    setMode("watching");
    setEnded(false);
    if (video.currentTime > 3 || video.ended) video.currentTime = 0;
    video.muted = false;
    if (video.volume === 0) video.volume = 1;
    void video.play().catch(() => undefined);
  }

  /** The picture's click: the first one starts it properly, with sound; then play and pause. */
  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (shown === "still" || shown === "starting" || modeRef.current === "silent" || ended) {
      watch();
      return;
    }
    if (video.paused) void video.play().catch(() => undefined);
    else video.pause();
  }

  /**
   * The play/pause button, Space and K: always what the button says. Before
   * anyone has asked for sound, it pauses and resumes the silent start as it
   * is, and Sound on (or a click on the picture) is still there for sound.
   */
  function pressPlayButton() {
    const video = videoRef.current;
    if (!video) return;
    if (modeRef.current === "silent" || (modeRef.current === "starting" && shown !== "still")) {
      if (video.paused) void video.play().catch(() => undefined);
      else video.pause();
      return;
    }
    togglePlay();
  }

  function toggleSound() {
    const video = videoRef.current;
    if (!video) return;
    // The first sound is the start of watching it properly.
    if (modeRef.current !== "watching") {
      watch();
      return;
    }
    video.muted = !video.muted;
    if (!video.muted && video.volume === 0) video.volume = 1;
  }

  function skip(seconds: number) {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration)) return;
    video.currentTime = Math.min(Math.max(0, video.currentTime + seconds), video.duration - 0.1);
    setTime(video.currentTime);
    paint();
  }

  function choose(at: number) {
    setMode("watching");
    setReelsOpen(false);
    load(at, true);
  }

  function toggleFullscreen() {
    const doc = document as FullscreenDocument;
    if (filling) {
      setFilling(false);
      return;
    }
    if (doc.fullscreenElement ?? doc.webkitFullscreenElement) {
      if (doc.exitFullscreen) void doc.exitFullscreen().catch(() => undefined);
      else doc.webkitExitFullscreen?.();
      return;
    }
    const stage = stageRef.current as FullscreenElement | null;
    if (stage && (doc.fullscreenEnabled || doc.webkitFullscreenEnabled)) {
      if (stage.requestFullscreen) void stage.requestFullscreen().catch(() => undefined);
      else stage.webkitRequestFullscreen?.();
      return;
    }
    // An iPhone can put only a bare video full screen, in Apple's own player
    // (with its speed menu); instead, the player fills the screen in the page.
    setRoom(stage?.offsetHeight ?? 0);
    setFilling(true);
  }

  function onEnded() {
    const video = videoRef.current;
    if (!video) return;
    const at = indexRef.current;
    // Reels roll on to the next; silently, the showcase starts over.
    if (several && at < videos.length - 1) {
      load(at + 1, modeRef.current === "watching" && !video.muted);
      return;
    }
    if (modeRef.current !== "watching") {
      if (several) load(0, false);
      else {
        video.currentTime = 0;
        void video.play().catch(() => undefined);
      }
      return;
    }
    setEnded(true);
  }

  // A click on the picture: play or pause (the first one turns the sound
  // on), and a double click for full screen. A tap on a phone shows or hides
  // the controls instead, as the buttons are under the finger. Either way, a
  // press beside the open Reels panel closes it.
  function onSurfaceClick() {
    if (reelsOpen) {
      setReelsOpen(false);
      return;
    }
    if (pointerRef.current !== "mouse") {
      if (chrome && playing) {
        window.clearTimeout(idleRef.current);
        setAwake(false);
      } else wake();
      return;
    }
    wake();
    // The first click starts it with sound, so it runs straight away, inside the click.
    if (modeRef.current !== "watching" || ended || shown === "still") {
      togglePlay();
      return;
    }
    // Later ones wait a moment, in case it is the first of a double click.
    window.clearTimeout(clickRef.current);
    clickRef.current = window.setTimeout(() => {
      togglePlay();
      toggledRef.current = performance.now();
    }, 220);
  }

  function onSurfaceDoubleClick() {
    window.clearTimeout(clickRef.current);
    // The first click of a slow double click may already have paused it: undo that.
    if (performance.now() - toggledRef.current < 700) togglePlay();
    toggleFullscreen();
  }

  // After a click on one of the buttons, focus moves to the player itself, so
  // Space and K go on playing and pausing rather than pressing that button
  // again, and nothing is lost when the button goes away (Sound on, a Reel).
  // From the keyboard, focus stays on the button, or returns to Reels.
  function onStageClick(event: MouseEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement;
    const control = target === stageRef.current ? null : target.closest("button, input");
    if (!control) return;
    if (event.detail === 0 && control.matches(".player-reel, .player-panel-close")) {
      reelsButtonRef.current?.focus({ preventScroll: true });
      return;
    }
    if (event.detail > 0 || control.matches(".player-sound, .player-big")) {
      stageRef.current?.focus({ preventScroll: true });
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    // Leave Find (Cmd or Ctrl+F), Back (Alt+Left) and the rest to the browser.
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    const target = event.target as HTMLElement;
    if (event.key === "Escape") {
      if (reelsOpen) {
        setReelsOpen(false);
        reelsButtonRef.current?.focus({ preventScroll: true });
      } else if (filling) setFilling(false);
      else return;
      event.preventDefault();
      return;
    }
    // Buttons answer Space and Enter themselves; sliders their arrows.
    const onButton = target !== stageRef.current && target.closest("button, a");
    if (onButton && (event.key === " " || event.key === "Enter")) return;
    if (target.tagName === "INPUT" && SLIDER_KEYS.includes(event.key)) return;
    switch (event.key) {
      case " ":
      case "k":
      case "K":
        pressPlayButton();
        break;
      case "ArrowLeft":
        skip(-ARROW_SECONDS);
        break;
      case "ArrowRight":
        skip(ARROW_SECONDS);
        break;
      case "m":
      case "M":
        toggleSound();
        break;
      case "f":
      case "F":
        toggleFullscreen();
        break;
      default:
        return;
    }
    event.preventDefault();
    wake();
  }

  const left = Math.max(0, duration - time);
  const big =
    shown === "still" || ended ? (
      <button
        type="button"
        onClick={togglePlay}
        aria-label={ended ? labels.replay : labels.play}
        className="player-big"
      >
        {ended ? (
          <RotateCcw aria-hidden="true" strokeWidth={1.75} />
        ) : (
          <Play aria-hidden="true" fill="currentColor" strokeWidth={0} />
        )}
      </button>
    ) : waiting && playing ? (
      <span aria-hidden="true" className="player-spinner" />
    ) : null;

  return (
    <>
      <div
        ref={stageRef}
        role="region"
        aria-label={`${name}: ${current.caption}`}
        tabIndex={0}
        data-shape={shape}
        data-chrome={chrome ? "shown" : "hidden"}
        data-full={filling ? "" : undefined}
        data-clip={current.width / current.height > 0.6 ? "boxy" : undefined}
        data-stretched={stretched ? "" : undefined}
        className="player"
        style={{ "--video-w": current.width, "--video-h": current.height } as CSSProperties}
        onKeyDown={onKeyDown}
        onClick={onStageClick}
        onFocus={(event) => {
          if (event.target === event.currentTarget && event.currentTarget.matches(":focus-visible")) wake();
        }}
        onPointerMove={(event) => {
          if (event.pointerType === "mouse") wake();
        }}
        onPointerDown={(event) => {
          pointerRef.current = event.pointerType;
          // A finger on the controls keeps them up.
          if (event.pointerType !== "mouse" && (event.target as HTMLElement).closest(".player-chrome")) wake();
        }}
        onContextMenu={(event) => event.preventDefault()}
      >
        <div aria-hidden="true" className="player-wash">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset(current.poster)} alt="" decoding="async" />
        </div>

        <video
          ref={videoRef}
          src={asset(videos[0].src)}
          poster={asset(videos[0].poster)}
          muted
          playsInline
          preload="none"
          disablePictureInPicture
          disableRemotePlayback
          controlsList="nodownload noplaybackrate noremoteplayback"
          x-webkit-airplay="deny"
          aria-hidden="true"
          tabIndex={-1}
          onPlay={() => {
            setPlaying(true);
            setEnded(false);
          }}
          onPause={() => {
            setPlaying(false);
            paint();
          }}
          onWaiting={() => setWaiting(true)}
          onPlaying={(event) => {
            setWaiting(false);
            // Keep what the player says in step with what plays, whatever started it.
            if (event.currentTarget.muted && (modeRef.current === "starting" || modeRef.current === "still")) {
              setMode("silent");
            }
          }}
          onCanPlay={() => setWaiting(false)}
          onTimeUpdate={(event) => setTime(event.currentTarget.currentTime)}
          onDurationChange={(event) => {
            setDuration(event.currentTarget.duration);
            paint();
          }}
          onProgress={paint}
          onSeeked={(event) => {
            paint();
            if (!event.currentTarget.ended) setEnded(false);
          }}
          onVolumeChange={(event) => {
            const video = event.currentTarget;
            setMuted(video.muted);
            setVolume(video.volume);
            if (!video.muted && modeRef.current !== "watching") setMode("watching");
          }}
          onEnded={onEnded}
        />

        <div
          aria-hidden="true"
          className="player-surface"
          onClick={onSurfaceClick}
          onDoubleClick={onSurfaceDoubleClick}
        />

        {big && <div className="player-center">{big}</div>}

        {shown === "silent" && !reelsOpen && (
          <button type="button" onClick={watch} className="player-sound">
            <VolumeX aria-hidden="true" size={18} strokeWidth={1.75} />
            {labels.sound}
          </button>
        )}

        <div className="player-chrome">
          <div className="player-bar">
            <div className="player-timeline">
              <div ref={barRef} className="player-progress">
                <span aria-hidden="true" className="player-track">
                  <span className="player-buffered" />
                  <span className="player-played" />
                </span>
                <span aria-hidden="true" className="player-thumb" />
                <input
                  type="range"
                  min={0}
                  max={duration || 0}
                  step={0.1}
                  value={Math.min(time, duration || 0)}
                  aria-label={labels.seek}
                  aria-valuetext={`${clock(time)} ${labels.of} ${duration ? clock(duration) : current.length}`}
                  onChange={(event) => {
                    const video = videoRef.current;
                    if (!video) return;
                    video.currentTime = Number(event.currentTarget.value);
                    setTime(video.currentTime);
                    paint();
                    wake();
                  }}
                  onKeyDown={(event) => {
                    if (event.metaKey || event.ctrlKey || event.altKey) return;
                    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
                    event.preventDefault();
                    skip(event.key === "ArrowLeft" ? -ARROW_SECONDS : ARROW_SECONDS);
                    wake();
                  }}
                />
              </div>
              <span className="player-time">{duration ? clock(left) : current.length}</span>
            </div>

            <div className="player-buttons">
              <div className="player-group">
                <Control label={playing ? labels.pause : labels.play} onClick={pressPlayButton}>
                  {playing ? (
                    <Pause fill="currentColor" strokeWidth={0} />
                  ) : (
                    <Play fill="currentColor" strokeWidth={0} />
                  )}
                </Control>
                <Control label={labels.back} onClick={() => skip(-SKIP_SECONDS)} className="player-skip">
                  <RotateCcw strokeWidth={1.75} />
                  <span>{SKIP_SECONDS}</span>
                </Control>
                <Control label={labels.forward} onClick={() => skip(SKIP_SECONDS)} className="player-skip">
                  <RotateCw strokeWidth={1.75} />
                  <span>{SKIP_SECONDS}</span>
                </Control>
                <div className="player-volume">
                  <Control label={muted ? labels.unmute : labels.mute} onClick={toggleSound}>
                    {muted || volume === 0 ? <VolumeX strokeWidth={1.75} /> : <Volume2 strokeWidth={1.75} />}
                  </Control>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={muted ? 0 : volume}
                    aria-label={labels.volume}
                    onChange={(event) => {
                      const video = videoRef.current;
                      if (!video) return;
                      const level = Number(event.currentTarget.value);
                      video.volume = level;
                      video.muted = level === 0;
                    }}
                  />
                </div>
              </div>

              <p className="player-title">
                <span>{name}</span>
                <span className="text-white/70"> · {current.caption}</span>
              </p>

              <div className="player-group">
                {several && (
                  <>
                    <Control
                      label={labels.next}
                      onClick={() => choose((index + 1) % videos.length)}
                      className="player-next"
                    >
                      <SkipForward fill="currentColor" strokeWidth={1.5} />
                    </Control>
                    <button
                      ref={reelsButtonRef}
                      type="button"
                      aria-label={`${labels.reels}: ${index + 1} ${labels.of} ${videos.length}`}
                      aria-expanded={reelsOpen}
                      aria-controls="player-reels"
                      onClick={() => setReelsOpen((open) => !open)}
                      className="player-reels-button"
                    >
                      <GalleryVerticalEnd aria-hidden="true" strokeWidth={1.75} />
                      <span aria-hidden="true">{labels.reels}</span>
                      <span aria-hidden="true" className="tabular text-white/70">
                        {index + 1}/{videos.length}
                      </span>
                    </button>
                  </>
                )}
                <Control label={full ? labels.exitFullscreen : labels.fullscreen} onClick={toggleFullscreen}>
                  {full ? <Minimize strokeWidth={1.75} /> : <Maximize strokeWidth={1.75} />}
                </Control>
              </div>
            </div>
          </div>

          {several && reelsOpen && (
            <div ref={panelRef} id="player-reels" className="player-panel" data-lenis-prevent>
              <div className="player-panel-head">
                <p>{labels.reels}</p>
                <Control label={labels.close} onClick={() => setReelsOpen(false)} className="player-panel-close">
                  <X strokeWidth={1.75} />
                </Control>
              </div>
              <ol>
                {videos.map((video, at) => (
                  <li key={video.src}>
                    <button
                      type="button"
                      aria-current={at === index ? "true" : undefined}
                      aria-label={`${at + 1}. ${video.caption} (${video.length})`}
                      onClick={() => choose(at)}
                      className="player-reel"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={asset(video.poster)} alt="" loading="lazy" decoding="async" />
                      <span aria-hidden="true" className="min-w-0">
                        <span className="block text-[0.8125rem] text-white/70">
                          {at + 1}. {at === index ? labels.nowPlaying : video.length}
                        </span>
                        <span className="player-reel-caption mt-0.5 block font-medium">{video.caption}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>

      {filling && <div aria-hidden="true" style={{ height: room }} />}

      <div className="shell flex flex-wrap items-center gap-x-3 gap-y-1 py-3 text-[0.8125rem] text-fg-2">
        <span>{labels.nowPlaying}</span>
        <span className="text-fg">{current.caption}</span>
        <span className="tabular">{current.length}</span>
        <a
          href={current.original.href}
          target="_blank"
          rel="noopener noreferrer"
          className="arrow-host inline-flex min-h-9 items-center gap-1 font-medium text-fg"
        >
          <span className="link-underline pb-0.5">{current.original.label}</span>
          <ArrowUpRight aria-hidden="true" size={14} strokeWidth={1.75} />
        </a>
      </div>
    </>
  );
}

/** One of the player's round buttons: an icon, named for screen readers and in a tooltip. */
function Control({
  label,
  onClick,
  className,
  children,
}: {
  label: string;
  onClick: () => void;
  className?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`player-button ${className ?? ""}`}
    >
      {children}
    </button>
  );
}
