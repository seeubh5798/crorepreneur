"use client";

import { Environment, Lightformer } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import {
  ACESFilmicToneMapping,
  CapsuleGeometry,
  SRGBColorSpace,
  TorusGeometry,
  type Group,
  type PerspectiveCamera,
} from "three";
import { applySatinTheme, createSatinMaterial, easeOutExpo, watchTheme } from "../shared";

type Glyph = "1" | "," | "0";

/** 1,00,00,000, grouped the Indian way. */
const NUMBER: Glyph[] = ["1", ",", "0", "0", ",", "0", "0", ",", "0", "0", "0"];

/** Horizontal advance of each glyph, as a share of the numeral height. */
const ADVANCE: Record<Glyph, number> = { "1": 0.44, ",": 0.3, "0": 0.76 };

/** Width of the whole number, as a share of the numeral height. */
const TOTAL = NUMBER.reduce((sum, glyph) => sum + ADVANCE[glyph], 0) - 0.11;

function rand(index: number, k: number) {
  const v = Math.sin(index * 12.9898 + k * 78.233) * 43758.5453;
  return v - Math.floor(v);
}

function Numerals({ container, onReady }: { container: RefObject<HTMLDivElement | null>; onReady: () => void }) {
  const { size, camera } = useThree();
  const pivots = useRef<Array<Group | null>>([]);
  const material = useMemo(() => createSatinMaterial(), []);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const introStart = useRef<number | null>(null);
  const turn = useRef(NUMBER.map(() => ({ x: 0, y: 0 })));
  const scatter = useMemo(
    () =>
      NUMBER.map((_, i) => ({
        x: (rand(i, 1) - 0.5) * 2.4,
        y: (rand(i, 2) - 0.5) * 1.6,
        z: -3 - rand(i, 3) * 5,
        rx: (rand(i, 4) - 0.5) * Math.PI * 3,
        ry: (rand(i, 5) - 0.5) * Math.PI * 3,
      })),
    [],
  );

  useEffect(() => {
    const stop = watchTheme(() => applySatinTheme(material));
    return () => {
      stop();
      material.dispose();
    };
  }, [material]);

  // Layout: numeral height, glyph positions and geometry, from the canvas size.
  const layout = useMemo(() => {
    const width = size.width;
    const height = size.height;
    const numeral = Math.min((width * 0.96) / TOTAL, height * 0.8);
    const stroke = numeral * 0.058;
    // Set flush left, like the headline under it.
    const glyphs: { glyph: Glyph; x: number }[] = [];
    let cursor = -width / 2 + numeral * 0.14;
    for (const glyph of NUMBER) {
      const visual = glyph === "0" ? 0.62 * numeral : glyph === "1" ? 0.3 * numeral : 0.12 * numeral;
      glyphs.push({ glyph, x: cursor + visual / 2 });
      cursor += ADVANCE[glyph] * numeral;
    }
    const zero = new TorusGeometry(numeral * 0.31 - stroke, stroke, 28, 110);
    const stem = new CapsuleGeometry(stroke, numeral - stroke * 2, 8, 20);
    const flag = new CapsuleGeometry(stroke * 0.9, numeral * 0.15, 8, 12);
    const tail = new CapsuleGeometry(stroke * 0.95, numeral * 0.1, 8, 12);
    return { width, height, numeral, stroke, glyphs, zero, stem, flag, tail };
  }, [size.width, size.height]);

  useEffect(
    () => () => {
      layout.zero.dispose();
      layout.stem.dispose();
      layout.flag.dispose();
      layout.tail.dispose();
    },
    [layout],
  );

  // The canvas is very wide, so the lens is set by its width: a 38 degree
  // horizontal view keeps numerals at the ends from stretching.
  useEffect(() => {
    const cam = camera as PerspectiveCamera;
    cam.fov = (2 * Math.atan(Math.tan((19 * Math.PI) / 180) / (layout.width / layout.height)) * 180) / Math.PI;
    cam.position.set(0, 0, layout.height / 2 / Math.tan((cam.fov * Math.PI) / 360));
    cam.near = cam.position.z * 0.05;
    cam.far = cam.position.z + layout.numeral * 20;
    cam.updateProjectionMatrix();
  }, [camera, layout]);

  // Pointer over the whole panel, and the fly-in when the figure is in view.
  useEffect(() => {
    const wrap = container.current;
    const area = wrap?.closest<HTMLElement>("[data-crore-area]") ?? wrap;
    if (!wrap || !area) return;
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const rect = wrap.getBoundingClientRect();
      pointer.current = {
        x: event.clientX - rect.left - rect.width / 2,
        y: rect.height / 2 - (event.clientY - rect.top),
      };
    };
    const onLeave = () => {
      pointer.current = null;
    };
    area.addEventListener("pointermove", onMove, { passive: true });
    area.addEventListener("pointerleave", onLeave);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && introStart.current === null) introStart.current = performance.now() / 1000;
      },
      { threshold: 0.35 },
    );
    observer.observe(wrap);
    onReady();
    return () => {
      area.removeEventListener("pointermove", onMove);
      area.removeEventListener("pointerleave", onLeave);
      observer.disconnect();
    };
  }, [container, onReady]);

  useFrame(() => {
    const now = performance.now() / 1000;
    const elapsed = introStart.current === null ? -1 : now - introStart.current;
    const { width, height, glyphs } = layout;
    glyphs.forEach(({ x }, i) => {
      const pivot = pivots.current[i];
      if (!pivot) return;
      pivot.visible = elapsed >= 0;
      const t = easeOutExpo(Math.max(0, (elapsed - i * 0.075) / 1.7));
      const inv = 1 - t;

      // Each numeral turns to face the cursor, as if it were a point some
      // distance in front of the screen; with no cursor, a slow wave.
      let targetY: number;
      let targetX: number;
      if (pointer.current) {
        const distance = width * 1.1;
        targetY = Math.atan((pointer.current.x - x) / distance);
        targetX = Math.atan(-pointer.current.y / distance) * 0.8;
      } else {
        targetY = Math.sin(now * 0.9 - i * 0.42) * 0.32;
        targetX = Math.cos(now * 0.7 - i * 0.3) * 0.08;
      }
      const turnState = turn.current[i];
      turnState.y += (targetY - turnState.y) * 0.08;
      turnState.x += (targetX - turnState.x) * 0.08;

      const from = scatter[i];
      pivot.position.set(x + from.x * width * inv, from.y * height * inv, from.z * layout.numeral * inv);
      pivot.rotation.set(turnState.x + from.rx * inv, turnState.y + from.ry * inv, 0);
    });
  });

  const { numeral, stroke } = layout;
  const flagAngle = 0.95;
  return (
    <>
      {layout.glyphs.map(({ glyph }, i) => (
        <group
          key={i}
          ref={(node) => {
            pivots.current[i] = node;
          }}
          visible={false}
        >
          {glyph === "0" && <mesh geometry={layout.zero} material={material} scale={[1, 0.5 / 0.31, 1]} />}
          {glyph === "1" && (
            <>
              <mesh geometry={layout.stem} material={material} />
              <mesh
                geometry={layout.flag}
                material={material}
                rotation={[0, 0, flagAngle]}
                position={[
                  -Math.sin(flagAngle) * (numeral * 0.075 + stroke * 0.4),
                  numeral / 2 - stroke - Math.cos(flagAngle) * (numeral * 0.075 + stroke * 0.4),
                  0,
                ]}
              />
            </>
          )}
          {glyph === "," && (
            <mesh
              geometry={layout.tail}
              material={material}
              rotation={[0, 0, -0.38]}
              position={[0, -numeral * 0.47, 0]}
            />
          )}
        </group>
      ))}
    </>
  );
}

/** The closing figure's own small canvas. It only draws while it is on screen. */
export default function CroreScene({
  container,
  onReady,
}: {
  container: RefObject<HTMLDivElement | null>;
  onReady: () => void;
}) {
  const compact = typeof window !== "undefined" && window.matchMedia("(max-width: 63.99rem)").matches;
  const [onScreen, setOnScreen] = useState(true);

  useEffect(() => {
    const wrap = container.current;
    if (!wrap) return;
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));
    observer.observe(wrap);
    return () => observer.disconnect();
  }, [container]);

  return (
    <Canvas
      frameloop={onScreen ? "always" : "never"}
      dpr={[1, compact ? 1.5 : 1.75]}
      camera={{ fov: 10, position: [0, 0, 1000], near: 1, far: 10000 }}
      gl={{ alpha: true, antialias: true, toneMapping: ACESFilmicToneMapping, outputColorSpace: SRGBColorSpace }}
      style={{ position: "absolute", inset: 0 }}
      aria-hidden="true"
    >
      {/* A soft-box studio for the satin metal, rendered once. */}
      <Environment resolution={256} frames={1}>
        <color attach="background" args={["#0c0c10"]} />
        <Lightformer form="rect" intensity={3.2} scale={[10, 3]} position={[0, 6, 4]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={1.5} color="#dcd8f2" scale={[3, 8]} position={[-7, 0, 3]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={1.3} color="#d6def0" scale={[3, 8]} position={[7, 0, 3]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={1.4} color="#f4ebe4" scale={[10, 1.5]} position={[0, -4, 6]} target={[0, 0, 0]} />
      </Environment>
      <Numerals container={container} onReady={onReady} />
    </Canvas>
  );
}
