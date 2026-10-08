"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { MathUtils, SphereGeometry, TorusGeometry, type Group, type MeshPhysicalMaterial } from "three";
import { story } from "@/lib/story";
import {
  applyMatteTheme,
  applySatinTheme,
  createMatteMaterial,
  createSatinMaterial,
  watchTheme,
  type MatteFinish,
} from "../shared";
import { ORBIT_ANCHOR, ORBIT_MODE, anchorBox } from "./anchors";
import { PHONE_H, type PhoneState } from "./Phone";

type Finish = MatteFinish | "satin";

/** The gyroscope: three thin rings, each turning on its own axis inside the next (rad/s). */
const RINGS: { radius: number; finish: Finish; spin: [number, number, number] }[] = [
  { radius: 1, finish: "satin", spin: [0, 0.17, 0] },
  { radius: 0.87, finish: "dusk", spin: [0.24, 0, 0] },
  { radius: 0.74, finish: "satin", spin: [0, 0.33, 0.1] },
];

/**
 * Spheres on tilted orbits around the rings, like an orrery. `orbit` is a share
 * of the ring's radius, `size` a share of it too; angles in radians, speed in rad/s.
 */
const PLANETS: {
  finish: Finish;
  size: number;
  orbit: number;
  tilt: number;
  node: number;
  speed: number;
  phase: number;
}[] = [
  { finish: "bone", size: 0.1, orbit: 1.32, tilt: 0.42, node: 0.25, speed: 0.19, phase: 0.4 },
  { finish: "graphite", size: 0.075, orbit: 1.55, tilt: -0.3, node: 1.3, speed: -0.13, phase: 2.2 },
  { finish: "dusk", size: 0.085, orbit: 1.18, tilt: 1.0, node: 2.5, speed: 0.24, phase: 4.1 },
  { finish: "satin", size: 0.055, orbit: 1.7, tilt: -0.75, node: 0.9, speed: 0.1, phase: 1.3 },
  { finish: "slate", size: 0.065, orbit: 1.42, tilt: 0.18, node: 3.7, speed: -0.17, phase: 5.3 },
  { finish: "bone", size: 0.045, orbit: 1.85, tilt: -0.12, node: 5.1, speed: 0.08, phase: 3.3 },
];

const MATTE: MatteFinish[] = ["bone", "dusk", "slate", "graphite"];

/** Converts a span on screen (CSS px) to world units at depth z, for the story camera. */
function pxToWorld(px: number, z: number, viewportWidth: number, sizeWidth: number) {
  // The viewport is measured at z = 0, ten units from the camera.
  return px * (viewportWidth / sizeWidth) * ((10 - z) / 10);
}

/**
 * An orrery in satin and matte: a gyroscope of three rings turning inside one
 * another, with spheres on tilted orbits around it. It circles the founder's
 * head on the cover and her portrait further down, wraps the phone wherever
 * the phone lands (passing in front of it and behind it), and drifts large
 * and far back behind the sections that are mostly text, where the fog fades
 * it into the page. It assembles with a slow spin when the page opens and
 * turns faster while the page scrolls. On phones it is smaller and set
 * further back, so it never crowds the text.
 */
export function Orrery({ phone, compact }: { phone: { current: PhoneState }; compact: boolean }) {
  const { size, viewport } = useThree();
  const rig = useRef<Group>(null);
  const gimbals = useRef<Array<Group | null>>([]);
  const planets = useRef<Array<Group | null>>([]);
  const placed = useRef(false);
  const born = useRef<number | null>(null);
  const frame = useRef({ x: 0, y: 0, z: -2, radius: 0.0001 });
  const angles = useRef(PLANETS.map((p) => p.phase));
  const shown = compact ? PLANETS.slice(0, 4) : PLANETS;

  const assets = useMemo(() => {
    const materials = {
      satin: createSatinMaterial(),
      ...Object.fromEntries(MATTE.map((finish) => [finish, createMatteMaterial(finish)])),
    } as Record<Finish, MeshPhysicalMaterial>;
    return {
      ring: new TorusGeometry(1, 0.019, 16, 128),
      sphere: new SphereGeometry(1, 32, 24),
      materials,
    };
  }, []);

  useEffect(() => {
    const restyle = () => {
      applySatinTheme(assets.materials.satin);
      MATTE.forEach((finish) => applyMatteTheme(assets.materials[finish], finish));
    };
    restyle();
    const stop = watchTheme(restyle);
    return () => {
      stop();
      assets.ring.dispose();
      assets.sphere.dispose();
      Object.values(assets.materials).forEach((m) => m.dispose());
    };
  }, [assets]);

  useFrame((state, delta) => {
    const group = rig.current;
    if (!group) return;
    const dt = Math.min(delta, 1 / 8);
    const t = state.clock.elapsedTime;
    if (born.current === null) born.current = t;
    const age = t - born.current;
    const stage = story.stage;
    const mode = ORBIT_MODE[stage];
    const anchorName = ORBIT_ANCHOR[stage];
    const box = anchorName ? anchorBox(anchorName) : null;
    const velocity = MathUtils.clamp(story.velocity / 2500, -1.5, 1.5);

    // Where the orrery sits and how big it is, in world units.
    let x: number;
    let y: number;
    let z: number;
    let radius: number;
    if (mode === "halo" && box) {
      z = stage === "hero" ? -1.4 : -1.8;
      x = ((box.x + box.width / 2) / size.width - 0.5) * viewport.width * ((10 - z) / 10);
      y = (0.5 - (box.y + box.height / 2) / size.height) * viewport.height * ((10 - z) / 10);
      // Wide enough to clear her hair on the cover; around the card, close to its edges.
      radius = pxToWorld((Math.max(box.width, box.height) / 2) * (stage === "hero" ? 1.45 : 0.98), z, viewport.width, size.width);
    } else if (mode === "field") {
      // Far back, where the fog fades it into the page behind the text.
      z = compact ? -10 : -8;
      x = viewport.width * (compact ? 0.3 : 0.46) * ((10 - z) / 10);
      y = viewport.height * 0.06;
      radius = viewport.height * (compact ? 0.24 : 0.3) * ((10 - z) / 10);
    } else {
      // Around the phone, set a little behind it, so the rings sweep around
      // the screen more often than across it. Tighter on phones.
      radius = PHONE_H * phone.current.scale * (compact ? 0.6 : 0.74);
      x = phone.current.x;
      y = phone.current.y;
      z = phone.current.z - radius * (compact ? 0.5 : 0.25);
    }

    // Glide between arrangements; assemble from nothing when the page opens.
    const f = frame.current;
    if (!placed.current) {
      placed.current = true;
      f.x = x;
      f.y = y;
      f.z = z;
    }
    const lambda = 2.2;
    f.x = MathUtils.damp(f.x, x, lambda, dt);
    f.y = MathUtils.damp(f.y, y, lambda, dt);
    f.z = MathUtils.damp(f.z, z, lambda, dt);
    f.radius = MathUtils.damp(f.radius, radius, age < 2.5 ? 1.6 : lambda, dt);

    group.position.set(f.x, f.y + Math.sin(t * 0.6) * f.radius * 0.025, f.z);
    group.scale.setScalar(f.radius);
    // A resting tilt, so the rings read as ellipses, eased toward the pointer.
    group.rotation.x = MathUtils.damp(group.rotation.x, 0.42 + story.pointer.y * 0.25, 2, dt);
    group.rotation.y = MathUtils.damp(group.rotation.y, -0.28 + story.pointer.x * 0.35, 2, dt);

    // Spin: a flourish at first, then a slow turn that quickens with the scroll.
    const boost = (1 + 5 * Math.exp(-age / 0.9)) * (1 + Math.abs(velocity) * 1.6);
    RINGS.forEach((ring, i) => {
      const gimbal = gimbals.current[i];
      if (!gimbal) return;
      gimbal.rotation.x += ring.spin[0] * boost * dt;
      gimbal.rotation.y += ring.spin[1] * boost * dt;
      gimbal.rotation.z += ring.spin[2] * boost * dt;
    });

    // Planets: unit orbits tilted in 3D, scaled with the rings. Around the
    // founder they stay behind her and close in, clear of the text beside her;
    // around the phone they pass in front too, a little closer in.
    const depth = mode === "orbit" ? 1 : 0.55;
    const spread = mode === "halo" ? 0.72 : mode === "orbit" ? 0.85 : 1;
    shown.forEach((planet, i) => {
      const node = planets.current[i];
      if (!node) return;
      angles.current[i] += planet.speed * dt * (1 + Math.abs(velocity) * 1.4) * (1 + 2 * Math.exp(-age / 0.9));
      const a = angles.current[i];
      const r = planet.orbit * spread;
      const ox = Math.cos(a) * r;
      const oy = Math.sin(a) * r * Math.sin(planet.tilt);
      const oz = Math.sin(a) * r * Math.cos(planet.tilt);
      const cn = Math.cos(planet.node);
      const sn = Math.sin(planet.node);
      node.position.set(
        f.x + (ox * cn - oy * sn) * f.radius,
        f.y + (ox * sn + oy * cn) * f.radius,
        f.z + oz * f.radius * depth - (mode === "orbit" ? 0 : 0.3),
      );
      node.scale.setScalar(planet.size * f.radius);
      node.rotation.y += dt * 0.3;
    });
  });

  return (
    <>
      <group ref={rig} scale={0.0001}>
        <group
          ref={(node) => {
            gimbals.current[0] = node;
          }}
        >
          <mesh geometry={assets.ring} material={assets.materials[RINGS[0].finish]} />
          <group
            ref={(node) => {
              gimbals.current[1] = node;
            }}
          >
            <mesh geometry={assets.ring} material={assets.materials[RINGS[1].finish]} scale={RINGS[1].radius} />
            <group
              ref={(node) => {
                gimbals.current[2] = node;
              }}
            >
              <mesh geometry={assets.ring} material={assets.materials[RINGS[2].finish]} scale={RINGS[2].radius} />
            </group>
          </group>
        </group>
      </group>

      {shown.map((planet, i) => (
        <group
          key={i}
          ref={(node) => {
            planets.current[i] = node;
          }}
          scale={0.0001}
        >
          <mesh geometry={assets.sphere} material={assets.materials[planet.finish]} />
        </group>
      ))}

    </>
  );
}
