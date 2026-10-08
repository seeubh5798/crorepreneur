"use client";

import { PerformanceMonitor } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { Color, Fog, MathUtils, NeutralToneMapping, SRGBColorSpace } from "three";
import { setStory, story } from "@/lib/story";
import { cssColor, watchTheme } from "../shared";
import { refreshAnchors } from "./anchors";
import { Orrery } from "./Orrery";
import { Phone, type PhoneState } from "./Phone";
import { Studio } from "./Studio";

/** Moves the camera a touch with the mouse, for depth between the layers. */
function CameraRig() {
  const { camera } = useThree();
  useFrame((_, delta) => {
    const dt = Math.min(delta, 1 / 8);
    camera.position.x = MathUtils.damp(camera.position.x, story.pointer.x * 0.5, 2.5, dt);
    camera.position.y = MathUtils.damp(camera.position.y, -story.pointer.y * 0.35, 2.5, dt);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

/** Khronos PBR Neutral, exactly as the renderer applies it (linear in and out). */
function neutral([r, g, b]: number[]): number[] {
  const start = 0.8 - 0.04;
  const x = Math.min(r, g, b);
  const offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
  const c = [r - offset, g - offset, b - offset];
  const peak = Math.max(...c);
  if (peak < start) return c;
  const d = 1 - start;
  const newPeak = 1 - (d * d) / (peak + d - start);
  const k = 1 - 1 / (0.15 * (peak - newPeak) + 1);
  return c.map((v) => v * (newPeak / peak) * (1 - k) + newPeak * k);
}

/** The colour that comes out of the tone map as `target`, found by fixed-point iteration. */
function beforeToneMap(target: Color): Color {
  const want = [target.r, target.g, target.b];
  let c = [...want];
  for (let i = 0; i < 60; i++) {
    const got = neutral(c);
    c = c.map((v, k) => Math.max(0, v + want[k] - got[k]));
  }
  return new Color(c[0], c[1], c[2]);
}

/**
 * Atmosphere: objects far behind the phone fade into the page colour, the way
 * distance softens things in a photograph, at no cost per frame. The fog
 * colour is chosen to land exactly on the page's --bg after tone mapping, and
 * eases across when the theme changes, as the page does.
 */
function Atmosphere() {
  const { scene } = useThree();
  const fog = useMemo(() => new Fog(new Color(), 11, 24), []);
  const target = useRef(new Color());

  useEffect(() => {
    const read = () => target.current.copy(beforeToneMap(cssColor("--bg", "#0a0a0c")));
    read();
    fog.color.copy(target.current);
    scene.fog = fog;
    const stop = watchTheme(read);
    return () => {
      stop();
      scene.fog = null;
    };
  }, [scene, fog]);

  useFrame((_, delta) => {
    fog.color.lerp(target.current, 1 - Math.exp(-Math.min(delta, 1 / 8) * 9));
  });
  return null;
}

/** Tells the page the 3D is drawing, after the first frames have rendered. */
function Ready() {
  const frames = useRef(0);
  useFrame(() => {
    frames.current += 1;
    if (frames.current === 3) setStory({ live: true });
  });
  useEffect(() => () => setStory({ live: false }), []);
  return null;
}

/**
 * The fixed 3D layer behind the whole page. The HTML scrolls over it; the
 * objects find their places from marked slots in the HTML (data-anchor).
 * It renders straight to a transparent canvas with no post-processing, so a
 * frame stays cheap and scrolling stays smooth; if the frame rate still drops,
 * it lowers the resolution rather than stutter.
 */
export default function StoryCanvas({ compact }: { compact: boolean }) {
  const phone = useRef<PhoneState>({ x: 0, y: -6, z: -2, scale: 1 });
  const [maxDpr, setMaxDpr] = useState(compact ? 1.25 : 1.5);

  useEffect(() => {
    window.addEventListener("resize", refreshAnchors);
    return () => window.removeEventListener("resize", refreshAnchors);
  }, []);

  return (
    <Canvas
      dpr={[1, maxDpr]}
      camera={{ fov: 32, position: [0, 0, 10], near: 0.1, far: 60 }}
      gl={{
        alpha: true,
        antialias: true,
        stencil: false,
        powerPreference: "high-performance",
        toneMapping: NeutralToneMapping,
        outputColorSpace: SRGBColorSpace,
      }}
      style={{ position: "absolute", inset: 0 }}
      aria-hidden="true"
    >
      <PerformanceMonitor flipflops={2} onDecline={() => setMaxDpr(1)} />
      <Atmosphere />
      <Studio phone={phone} />
      <CameraRig />
      <Phone shared={phone} />
      <Orrery phone={phone} compact={compact} />
      <Ready />
    </Canvas>
  );
}
