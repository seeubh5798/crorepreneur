"use client";

import { RoundedBox } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  AdditiveBlending,
  CanvasTexture,
  CylinderGeometry,
  Group,
  MathUtils,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  PlaneGeometry,
  SRGBColorSpace,
  type Mesh,
} from "three";
import gsap from "gsap";
import { story, subscribeStory, type StageId } from "@/lib/story";
import { PHONE_ANCHOR, PHONE_POSE, firstAnchorBox } from "./anchors";
import { flatShape, puffy, roundedRect } from "./geometry";
import {
  COUNTER_H,
  COUNTER_W,
  SCREEN_H,
  SCREEN_W,
  drawCounter,
  drawFounderScreen,
  drawProjectScreen,
  loadPortrait,
} from "./screen";

/** Phone size in world units. Everything else is scaled from the anchors. */
export const PHONE_W = 0.76;
export const PHONE_H = 1.56;
const DEPTH = 0.05;
const BEVEL = 0.026;
const SCREEN_INSET = 0.035;

export type PhoneState = { x: number; y: number; z: number; scale: number };

/**
 * The phone that carries the story. It flies to whichever slot the current
 * section reserves for it, tumbles while the page is moving, and swaps its
 * screen between the founder's reel and the selected campaign.
 */
export function Phone({ shared }: { shared: { current: PhoneState } }) {
  const outer = useRef<Group>(null);
  const spinner = useRef<Group>(null);
  const { size, viewport } = useThree();
  const counterRef = useRef<Mesh>(null);
  const barFillRef = useRef<Mesh>(null);
  const flip = useRef({ value: 0 });
  const lastStage = useRef<StageId>(story.stage);
  const placed = useRef(false);

  // ---- Geometry and materials
  const parts = useMemo(() => {
    const bodyShape = roundedRect(PHONE_W, PHONE_H, 0.13);
    const body = puffy(bodyShape, DEPTH, BEVEL, 32);
    const sw = PHONE_W - SCREEN_INSET * 2;
    const sh = PHONE_H - SCREEN_INSET * 2;
    const screen = flatShape(roundedRect(sw, sh, 0.1), sw, sh, 24);
    const back = flatShape(roundedRect(PHONE_W - 0.02, PHONE_H - 0.02, 0.12), PHONE_W, PHONE_H, 24);
    const bump = puffy(roundedRect(0.3, 0.3, 0.08), 0.012, 0.012, 16);
    const lens = new CylinderGeometry(0.048, 0.052, 0.03, 32);
    const counter = new PlaneGeometry(0.5, (0.5 * COUNTER_H) / COUNTER_W);

    // Satin titanium frame, a soft-touch frosted back, and dark glass lenses.
    const frameMaterial = new MeshPhysicalMaterial({
      color: "#8c8b93",
      metalness: 1,
      roughness: 0.48,
      anisotropy: 0.4,
    });
    const backMaterial = new MeshPhysicalMaterial({
      color: "#4b4663",
      metalness: 0,
      roughness: 0.62,
      sheen: 0.6,
      sheenRoughness: 0.7,
      sheenColor: "#b9b2e6",
    });
    const lensMaterial = new MeshPhysicalMaterial({ color: "#0a0a12", metalness: 0.4, roughness: 0.12, clearcoat: 1 });

    const screenCanvas = document.createElement("canvas");
    screenCanvas.width = SCREEN_W;
    screenCanvas.height = SCREEN_H;
    const screenTexture = new CanvasTexture(screenCanvas);
    screenTexture.colorSpace = SRGBColorSpace;
    screenTexture.anisotropy = 4;
    const screenMaterial = new MeshBasicMaterial({ map: screenTexture, toneMapped: false });

    // A black layer that only adds reflections: an anti-glare screen, so the
    // light slides across it in a soft band as it turns, without a mirror glint.
    const glassMaterial = new MeshPhysicalMaterial({
      color: "#000000",
      roughness: 0.34,
      metalness: 0,
      specularIntensity: 0.35,
      envMapIntensity: 0.55,
      transparent: true,
      blending: AdditiveBlending,
      depthWrite: false,
    });

    const counterCanvas = document.createElement("canvas");
    counterCanvas.width = COUNTER_W;
    counterCanvas.height = COUNTER_H;
    const counterTexture = new CanvasTexture(counterCanvas);
    counterTexture.colorSpace = SRGBColorSpace;
    const counterMaterial = new MeshBasicMaterial({
      map: counterTexture,
      transparent: true,
      toneMapped: false,
      depthWrite: false,
    });

    // The reel's playback bar along the bottom of the screen; the fill grows from the left.
    const bar = new PlaneGeometry(sw * 0.86, 0.007);
    const barFill = new PlaneGeometry(sw * 0.86, 0.007);
    barFill.translate((sw * 0.86) / 2, 0, 0);
    const barMaterial = new MeshBasicMaterial({
      color: "#ffffff",
      transparent: true,
      opacity: 0.3,
      toneMapped: false,
      depthWrite: false,
    });
    const barFillMaterial = new MeshBasicMaterial({
      color: "#ffffff",
      transparent: true,
      opacity: 0.92,
      toneMapped: false,
      depthWrite: false,
    });

    return {
      body,
      screen,
      back,
      bump,
      lens,
      counter,
      bar,
      barFill,
      frameMaterial,
      backMaterial,
      lensMaterial,
      screenCanvas,
      screenTexture,
      screenMaterial,
      glassMaterial,
      counterCanvas,
      counterTexture,
      counterMaterial,
      barMaterial,
      barFillMaterial,
    };
  }, []);

  useEffect(
    () => () => {
      Object.values(parts).forEach((part) => {
        if (part && typeof (part as { dispose?: () => void }).dispose === "function") {
          (part as { dispose: () => void }).dispose();
        }
      });
    },
    [parts],
  );

  // ---- Screen content
  const screenKey = useRef("");
  const counterValue = useRef(-1);

  function drawScreen(force = false) {
    const key = story.stage === "work" ? `project:${story.project}` : "founder";
    if (!force && key === screenKey.current) return;
    screenKey.current = key;
    const ctx = parts.screenCanvas.getContext("2d");
    if (!ctx) return;
    if (key === "founder") drawFounderScreen(ctx);
    else drawProjectScreen(ctx, story.project);
    parts.screenTexture.needsUpdate = true;
  }

  useEffect(() => {
    let alive = true;
    drawScreen(true);
    // Redraw once the photo and the web fonts are ready.
    Promise.all([loadPortrait().catch(() => null), document.fonts?.ready]).then(() => {
      if (alive) drawScreen(true);
    });

    // A full turn when the screen changes, swapping content while edge-on.
    let lastProject = story.project;
    const unsubscribe = subscribeStory(() => {
      const changedProject = story.project !== lastProject && story.stage === "work";
      lastProject = story.project;
      if (!changedProject) return;
      gsap.to(flip.current, {
        value: Math.round(flip.current.value / (Math.PI * 2)) * Math.PI * 2 + Math.PI * 2,
        duration: 1.1,
        ease: "expo.out",
        overwrite: true,
        onUpdate() {
          if (this.progress() > 0.08) drawScreen();
        },
      });
    });
    return () => {
      alive = false;
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parts]);

  // ---- Motion
  useFrame((state, delta) => {
    const group = outer.current;
    const spin = spinner.current;
    if (!group || !spin) return;
    const dt = Math.min(delta, 1 / 8);
    const t = state.clock.elapsedTime;

    // Target from the current section's slot, in world units at z = 0.
    const stage = story.stage;
    const box = firstAnchorBox(PHONE_ANCHOR[stage]);
    let tx: number;
    let ty: number;
    let tz = 0;
    let ts: number;
    if (box) {
      tx = ((box.x + box.width / 2) / size.width - 0.5) * viewport.width;
      ty = (0.5 - (box.y + box.height / 2) / size.height) * viewport.height;
      ts = ((box.height / size.height) * viewport.height) / PHONE_H;
      if (stage === "hero") tz = -0.6;
    } else {
      // Off to the side, turning slowly, until it is needed again.
      tx = viewport.width * 0.95;
      ty = viewport.height * 0.2;
      tz = -2.4;
      ts = (viewport.height * 0.5) / PHONE_H;
    }

    // When the section changes, the phone turns a full circle on its way to the new slot.
    if (stage !== lastStage.current) {
      const order: StageId[] = ["hero", "manifesto", "work", "services", "approach", "founder", "contact"];
      const direction = order.indexOf(stage) > order.indexOf(lastStage.current) ? 1 : -1;
      lastStage.current = stage;
      gsap.to(flip.current, {
        value: Math.round(flip.current.value / (Math.PI * 2)) * Math.PI * 2 + Math.PI * 2 * direction,
        duration: 1.6,
        ease: "expo.out",
        overwrite: true,
      });
    }

    if (!placed.current) {
      // First frame: start in place, small, and grow into the slot.
      placed.current = true;
      group.position.set(tx, ty, tz);
      group.scale.setScalar(ts * 0.2);
    }
    const lambda = 3.4;
    group.position.x = MathUtils.damp(group.position.x, tx, lambda, dt);
    group.position.y = MathUtils.damp(group.position.y, ty + Math.sin(t * 0.9) * 0.04 * ts, lambda, dt);
    group.position.z = MathUtils.damp(group.position.z, tz, lambda, dt);
    const scale = MathUtils.damp(group.scale.x, ts, lambda, dt);
    group.scale.setScalar(scale);

    // Scrolling makes it rock.
    const velocity = MathUtils.clamp(story.velocity / 3000, -1, 1);
    const [px, py, pz] = PHONE_POSE[stage];
    const ptr = story.pointer;
    group.rotation.x = MathUtils.damp(group.rotation.x, px + velocity * 0.5 + ptr.y * 0.2, 4, dt);
    group.rotation.y = MathUtils.damp(group.rotation.y, py + Math.sin(t * 0.5) * 0.08 + ptr.x * 0.35, 4, dt);
    group.rotation.z = MathUtils.damp(group.rotation.z, pz + velocity * 0.12, 4, dt);
    spin.rotation.y = flip.current.value;

    shared.current.x = group.position.x;
    shared.current.y = group.position.y;
    shared.current.z = group.position.z;
    shared.current.scale = scale;

    // Screen and counter
    drawScreen();
    if (counterRef.current) counterRef.current.visible = screenKey.current === "founder";
    // The reel keeps playing: its bar fills over six and a half seconds, then starts again.
    if (barFillRef.current) barFillRef.current.scale.x = Math.max(0.001, (t / 6.5) % 1);
    const views = Math.round(story.views);
    if (views !== counterValue.current) {
      counterValue.current = views;
      const ctx = parts.counterCanvas.getContext("2d");
      if (ctx) {
        drawCounter(ctx, views);
        parts.counterTexture.needsUpdate = true;
      }
    }
  });

  const front = DEPTH / 2 + BEVEL;
  const side = PHONE_W / 2 + BEVEL * 0.9 + 0.004;
  return (
    <group ref={outer} position={[0, -6, -2]}>
      <group ref={spinner}>
        <mesh geometry={parts.body} material={parts.frameMaterial} />
        {/* Side buttons: power on the right, action and volume on the left */}
        {(
          [
            [side, 0.28, 0.2],
            [-side, 0.5, 0.06],
            [-side, 0.35, 0.11],
            [-side, 0.2, 0.11],
          ] as const
        ).map(([x, y, height]) => (
          <RoundedBox
            key={`${x}${y}`}
            args={[0.016, height, 0.03]}
            radius={0.006}
            smoothness={3}
            position={[x, y, 0]}
            material={parts.frameMaterial}
          />
        ))}
        <mesh geometry={parts.screen} material={parts.screenMaterial} position={[0, 0, front + 0.0008]} />
        <mesh geometry={parts.screen} material={parts.glassMaterial} position={[0, 0, front + 0.0016]} />
        <mesh
          ref={counterRef}
          geometry={parts.counter}
          material={parts.counterMaterial}
          position={[-0.08, -PHONE_H / 2 + 0.38, front + 0.0024]}
        />
        <mesh geometry={parts.bar} material={parts.barMaterial} position={[0, -PHONE_H / 2 + 0.07, front + 0.0026]} />
        <mesh
          ref={barFillRef}
          geometry={parts.barFill}
          material={parts.barFillMaterial}
          position={[(-(PHONE_W - SCREEN_INSET * 2) * 0.86) / 2, -PHONE_H / 2 + 0.07, front + 0.003]}
        />
        <mesh
          geometry={parts.back}
          material={parts.backMaterial}
          position={[0, 0, -front - 0.0008]}
          rotation={[0, Math.PI, 0]}
        />
        <group position={[0.16, PHONE_H / 2 - 0.27, -front - 0.012]} rotation={[0, Math.PI, 0]}>
          <mesh geometry={parts.bump} material={parts.backMaterial} />
          {[
            [-0.065, 0.065],
            [-0.065, -0.065],
            [0.07, 0],
          ].map(([x, y]) => (
            <mesh
              key={`${x}${y}`}
              geometry={parts.lens}
              material={parts.lensMaterial}
              position={[x, y, 0.02]}
              rotation={[Math.PI / 2, 0, 0]}
            />
          ))}
        </group>
      </group>
    </group>
  );
}
