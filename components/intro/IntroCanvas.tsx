"use client";

import { Html, Line } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  DoubleSide,
  MathUtils,
  NeutralToneMapping,
  Quaternion,
  ShaderMaterial,
  ShapeUtils,
  SRGBColorSpace,
  Vector2,
  Vector3,
  type DirectionalLight,
  type Group,
  type Mesh,
  type MeshBasicMaterial,
  type MeshStandardMaterial,
  type PerspectiveCamera,
  type Points,
} from "three";
import type { Line2 } from "three-stdlib";
import { cssColor } from "@/components/three/shared";
import { glide } from "./journey";

export type IntroGeo = {
  /** [lat x 10, lon x 10, 1 if in India] per land dot */
  dots: number[];
  /** India's outline (official boundaries), one ring per landmass, [lon, lat] */
  india: [number, number][][];
  jharkhand: [number, number][];
  ranchi: [number, number];
};

/*
 * The flight, laid out along a track that the visitor's scrolling moves
 * through: [position, latitude, longitude, height above the ground in globe
 * radii, tilt from straight down in degrees]. The camera eases between these,
 * slowing at each place, so every place gets a moment.
 */
type Key = [number, number, number, number, number];
const PATH: Key[] = [
  [0, 10, 20, 5.4, 0],
  [1.2, 15, 50, 4.3, 0],
  [2.6, 21.6, 80.4, 1.35, 6],
  [4.0, 23.55, 85.55, 0.15, 36],
  [5.3, 23.34, 85.31, 0.07, 44],
  [6.8, 23.34, 85.31, 0.02, 54],
];
/** Where along the track each place's name appears: the world, India, Jharkhand, Ranchi. */
export const STAGE_AT = [0, 1.9, 3.4, 4.75];
/** Where the page starts to open out of Ranchi. */
export const REVEAL_AT = 5.7;
/** The end of the track, where the page is fully open. */
export const TRACK_END = 6.8;

const DEG = Math.PI / 180;
const SLAB = 0.0045; // how far Jharkhand rises, in globe radii

/** Unit vector for a latitude and longitude (east to the right, north up). */
function direction(lat: number, lon: number, out = new Vector3()) {
  const phi = lat * DEG;
  const lambda = lon * DEG;
  return out.set(Math.cos(phi) * Math.sin(lambda), Math.sin(phi), Math.cos(phi) * Math.cos(lambda));
}

/** Unit vector pointing north along the ground at a latitude and longitude. */
function northward(lat: number, lon: number, out = new Vector3()) {
  const phi = lat * DEG;
  const lambda = lon * DEG;
  return out.set(-Math.sin(phi) * Math.sin(lambda), Math.cos(phi), -Math.sin(phi) * Math.cos(lambda));
}

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const window01 = (t: number, from: number, length: number) => clamp01((t - from) / length);

function sample(t: number) {
  let k = PATH.length - 2;
  for (let i = 0; i < PATH.length - 1; i++) {
    if (t < PATH[i + 1][0]) {
      k = i;
      break;
    }
  }
  const [t0, lat0, lon0, alt0, tilt0] = PATH[k];
  const [t1, lat1, lon1, alt1, tilt1] = PATH[k + 1];
  const e = ease(clamp01((t - t0) / (t1 - t0)));
  return {
    lat: MathUtils.lerp(lat0, lat1, e),
    lon: MathUtils.lerp(lon0, lon1, e),
    // Height eases in log space, so each zoom feels like the same speed.
    alt: Math.exp(MathUtils.lerp(Math.log(alt0), Math.log(alt1), e)),
    tilt: MathUtils.lerp(tilt0, tilt1, e),
  };
}

type Palette = { globe: Color; land: Color; accent: Color; slab: Color; rim: Color; light: boolean };

function readPalette(): Palette {
  const bg = cssColor("--bg", "#0a0a0c");
  const light = bg.getHSL({ h: 0, s: 0, l: 0 }).l > 0.5;
  return {
    light,
    globe: new Color(light ? "#e3e0d9" : "#141418"),
    land: cssColor(light ? "--fg-3" : "--fg-2", light ? "#87867f" : "#a4a39d"),
    accent: cssColor("--accent-2", "#a59ce6"),
    slab: cssColor(light ? "--matte-graphite" : "--matte-bone", light ? "#2e2e33" : "#d9d4ca"),
    rim: cssColor("--accent", "#8279d6"),
  };
}

const wallNormal = new Vector3();
const wallUp = new Vector3();

/**
 * Shapes the Jharkhand slab at height `h`: the top face, lifted onto the
 * globe, and its walls. The top's normals point straight out from the globe,
 * so it shades as one smooth curved surface; each wall faces outward.
 */
function shapeSlab(geometry: BufferGeometry, triangles: number[][], dirs: Vector3[], h: number) {
  const position = geometry.attributes.position.array as Float32Array;
  const normal = geometry.attributes.normal.array as Float32Array;
  let o = 0;
  const put = (d: Vector3, r: number, n: Vector3) => {
    position[o] = d.x * r;
    position[o + 1] = d.y * r;
    position[o + 2] = d.z * r;
    normal[o] = n.x;
    normal[o + 1] = n.y;
    normal[o + 2] = n.z;
    o += 3;
  };
  const top = 1.0006 + h;
  for (const [a, b, c] of triangles) {
    put(dirs[a], top, dirs[a]);
    put(dirs[b], top, dirs[b]);
    put(dirs[c], top, dirs[c]);
  }
  for (let i = 0; i < dirs.length; i++) {
    const a = dirs[i];
    const b = dirs[(i + 1) % dirs.length];
    // The outline runs counter-clockwise seen from above, so outward is to the right of each edge.
    wallUp.copy(a).add(b).normalize();
    wallNormal.copy(b).sub(a).cross(wallUp).normalize();
    put(a, 1.0005, wallNormal);
    put(b, 1.0005, wallNormal);
    put(b, top, wallNormal);
    put(a, 1.0005, wallNormal);
    put(b, top, wallNormal);
    put(a, top, wallNormal);
  }
  geometry.attributes.position.needsUpdate = true;
  geometry.attributes.normal.needsUpdate = true;
  geometry.computeBoundingSphere();
}

const DOT_VERTEX = /* glsl */ `
  attribute float aIndia;
  uniform float uSize;
  uniform float uPixelRatio;
  varying float vIndia;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = clamp(uSize * uPixelRatio / -mv.z, 1.0, 9.0 * uPixelRatio);
    vIndia = aIndia;
  }
`;

const DOT_FRAGMENT = /* glsl */ `
  uniform vec3 uLand;
  uniform vec3 uAccent;
  uniform float uIndia;
  uniform float uOpacity;
  varying float vIndia;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float lit = vIndia * uIndia;
    gl_FragColor = vec4(mix(uLand, uAccent, lit), smoothstep(0.5, 0.36, d) * uOpacity * mix(0.7, 1.0, lit));
    #include <colorspace_fragment>
  }
`;

const RIM_VERTEX = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vNormal = normalize(mat3(modelMatrix) * normal);
    vView = normalize(cameraPosition - world.xyz);
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const RIM_FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  uniform float uStrength;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    float f = pow(1.0 - max(dot(vNormal, vView), 0.0), 3.0);
    gl_FragColor = vec4(uColor, f * uStrength);
    #include <colorspace_fragment>
  }
`;

type FlightProps = {
  geo: IntroGeo;
  /** Which place is showing (index into STAGE_AT), for the pin's label. */
  stage: number;
  pinLabel: string;
  onStage: (i: number) => void;
  /** How far the page has opened out of Ranchi: 0 covered, 1 fully open. */
  onOpen: (amount: number) => void;
};

function Flight({ geo, stage: shown, pinLabel, onStage, onOpen }: FlightProps) {
  const { camera, gl } = useThree();
  const palette = useMemo(() => readPalette(), []);
  const key = useRef<DirectionalLight>(null);
  const globe = useRef<Group>(null);
  const rim = useRef<Mesh>(null);
  const dots = useRef<Points>(null);
  const indiaLines = useRef<Array<Line2 | null>>([]);
  const slab = useRef<Mesh>(null);
  const slabEdge = useRef<Group>(null);
  const shapedAt = useRef(0);
  const pin = useRef<Group>(null);
  const pinHead = useRef<Mesh>(null);
  const pulse = useRef<Mesh>(null);
  const start = useRef<number | null>(null);
  const stage = useRef(-1);
  const opened = useRef(-1);
  const temp = useRef<{ n: Vector3; north: Vector3; target: Vector3 } | null>(null);

  // ---- Geometry, built once from the data
  const parts = useMemo(() => {
    const count = geo.dots.length / 3;
    const positions = new Float32Array(count * 3);
    const india = new Float32Array(count);
    const v = new Vector3();
    for (let i = 0; i < count; i++) {
      direction(geo.dots[i * 3] / 10, geo.dots[i * 3 + 1] / 10, v).multiplyScalar(1.004);
      positions.set([v.x, v.y, v.z], i * 3);
      india[i] = geo.dots[i * 3 + 2];
    }
    const dotGeometry = new BufferGeometry();
    dotGeometry.setAttribute("position", new BufferAttribute(positions, 3));
    dotGeometry.setAttribute("aIndia", new BufferAttribute(india, 1));

    const indiaRings = geo.india.map((ring) => {
      const points = ring.map(([lon, lat]) => direction(lat, lon).multiplyScalar(1.0045));
      const length = points.reduce((sum, p, i) => (i ? sum + p.distanceTo(points[i - 1]) : 0), 0);
      return { points, length };
    });

    // Jharkhand as a slab that follows the curve of the globe: the top face is
    // triangulated in longitude and latitude, then lifted onto the sphere.
    let outline = geo.jharkhand.slice(0, -1).map(([lon, lat]) => new Vector2(lon, lat));
    if (ShapeUtils.isClockWise(outline)) outline = outline.reverse();
    const triangles = ShapeUtils.triangulateShape(outline, []);
    const dirs = outline.map((p) => direction(p.y, p.x));
    const slabGeometry = new BufferGeometry();
    const slabVertices = (triangles.length + outline.length * 2) * 9;
    slabGeometry.setAttribute("position", new BufferAttribute(new Float32Array(slabVertices), 3));
    slabGeometry.setAttribute("normal", new BufferAttribute(new Float32Array(slabVertices), 3));
    shapeSlab(slabGeometry, triangles, dirs, 0);

    const edge = dirs.concat(dirs[0]).map((d) => d.clone().multiplyScalar(1.0008));

    const ranchi = direction(geo.ranchi[1], geo.ranchi[0]);
    return { dotGeometry, indiaRings, triangles, dirs, slabGeometry, edge, ranchi };
  }, [geo]);

  const dotMaterial = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: DOT_VERTEX,
        fragmentShader: DOT_FRAGMENT,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uSize: { value: 15 },
          uPixelRatio: { value: gl.getPixelRatio() },
          uLand: { value: palette.land },
          uAccent: { value: palette.accent },
          uIndia: { value: 0 },
          uOpacity: { value: 1 },
        },
      }),
    [gl, palette],
  );

  const rimMaterial = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: RIM_VERTEX,
        fragmentShader: RIM_FRAGMENT,
        transparent: true,
        depthWrite: false,
        uniforms: { uColor: { value: palette.rim }, uStrength: { value: palette.light ? 0.35 : 0.55 } },
      }),
    [palette],
  );

  useEffect(
    () => () => {
      parts.dotGeometry.dispose();
      parts.slabGeometry.dispose();
      dotMaterial.dispose();
      rimMaterial.dispose();
    },
    [parts, dotMaterial, rimMaterial],
  );

  useFrame((state, delta) => {
    if (start.current === null) start.current = state.clock.elapsedTime;
    // Seconds since the globe appeared (for its own small motions), and how
    // far along the track the visitor's scrolling has carried the flight.
    const now = state.clock.elapsedTime - start.current;
    const t = glide(delta) * TRACK_END;

    // ---- Camera: above the place, pulled back to the south and tilted to look north at it.
    // On narrow (portrait) screens it stands further back, so each place still fits across.
    const { lat, lon: path, alt, tilt } = sample(t);
    // Until the visitor scrolls, the globe sways gently, waiting.
    const lon = path + 16 * Math.sin(now * 0.3) * (1 - ease(window01(t, 0, PATH[1][0])));
    const height = alt * Math.max(1, 1.5 / (state.size.width / state.size.height));
    if (!temp.current) temp.current = { n: new Vector3(), north: new Vector3(), target: new Vector3() };
    const n = direction(lat, lon, temp.current.n);
    const north = northward(lat, lon, temp.current.north);
    const target = temp.current.target.copy(n);
    camera.position.copy(target).addScaledVector(n, height).addScaledVector(north, -height * Math.tan(tilt * DEG));
    camera.up.copy(north);
    camera.lookAt(target);
    // Near and far follow the height, keeping depth precise from orbit down to city level.
    const lens = state.camera as PerspectiveCamera;
    lens.near = height * 0.2;
    lens.far = height + 2.5;
    lens.updateProjectionMatrix();
    // Key light from the upper left of the view, wherever the camera is.
    if (key.current) {
      key.current.position.copy(camera.position).addScaledVector(north, 2).addScaledVector(n, 1.5);
      key.current.position.x -= 1.5;
    }

    // ---- The globe settles in; its rim glow fades as the camera comes down through it.
    const intro = ease(window01(now, 0, 1.1));
    if (globe.current) globe.current.scale.setScalar(0.94 + 0.06 * intro);
    if (rim.current) {
      (rim.current.material as ShaderMaterial).uniforms.uStrength.value =
        (palette.light ? 0.35 : 0.55) * MathUtils.smoothstep(alt, 0.08, 0.5);
    }

    // ---- Dots: India lights up, then the dots give way to the close-up shapes.
    if (dots.current) {
      const { uniforms } = dots.current.material as ShaderMaterial;
      uniforms.uIndia.value = ease(window01(t, STAGE_AT[1] - 0.2, 0.8));
      uniforms.uOpacity.value = intro * (1 - ease(window01(t, STAGE_AT[2] - 0.4, 0.8)));
    }

    // ---- India's outline draws itself.
    const drawn = ease(window01(t, STAGE_AT[1] - 0.1, 1.3));
    indiaLines.current.forEach((line) => {
      if (!line) return;
      const material = line.material as unknown as { dashOffset: number; dashSize: number; opacity: number };
      material.dashOffset = material.dashSize * (1 - drawn);
      material.opacity = 1 - 0.65 * ease(window01(t, STAGE_AT[3], 0.8));
    });

    // ---- Jharkhand rises, with a little overshoot.
    const rise = window01(t, STAGE_AT[2] - 0.15, 0.9);
    const lift = rise === 0 ? 0 : SLAB * (1 + 0.12 * Math.sin(rise * Math.PI)) * ease(rise);
    if (slab.current) {
      slab.current.visible = rise > 0;
      // Reshaped only while it is still rising.
      if (lift !== shapedAt.current) {
        shapeSlab(slab.current.geometry, parts.triangles, parts.dirs, lift);
        shapedAt.current = lift;
      }
      (slab.current.material as MeshStandardMaterial).opacity = ease(rise);
    }
    if (slabEdge.current) {
      slabEdge.current.visible = rise > 0;
      slabEdge.current.scale.setScalar(1 + lift);
    }

    // ---- Ranchi: the pin drops in and a ring pulses out from it.
    const drop = window01(t, STAGE_AT[3] - 0.1, 0.7);
    if (pin.current) {
      pin.current.visible = drop > 0;
      pin.current.position.copy(parts.ranchi).multiplyScalar(1.0006 + lift);
    }
    if (pinHead.current) pinHead.current.position.y = 0.0045 + 0.012 * Math.pow(1 - ease(drop), 2);
    if (pulse.current) {
      const p = (now % 1.6) / 1.6;
      pulse.current.scale.setScalar(1 + p * 6);
      (pulse.current.material as MeshBasicMaterial).opacity = drop * (1 - p) * 0.9;
    }

    // ---- Names, and the page opening out of Ranchi.
    const next = STAGE_AT.filter((at) => t >= at).length - 1;
    if (next !== stage.current) {
      stage.current = next;
      onStage(next);
    }
    const open = ease(window01(t, REVEAL_AT, TRACK_END - REVEAL_AT));
    if (open !== opened.current) {
      opened.current = open;
      onOpen(open);
    }
  });

  const pinRotation = useMemo(
    () => new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), parts.ranchi),
    [parts.ranchi],
  );

  return (
    <>
      <ambientLight intensity={palette.light ? 2.1 : 0.55} />
      <directionalLight ref={key} intensity={palette.light ? 1.7 : 1.4} color="#fffaf4" />

      <group ref={globe}>
        <mesh>
          <sphereGeometry args={[1, 160, 120]} />
          <meshStandardMaterial color={palette.globe} roughness={0.95} metalness={0} />
        </mesh>
        <mesh ref={rim} scale={1.035} material={rimMaterial}>
          <sphereGeometry args={[1, 96, 64]} />
        </mesh>
        <points ref={dots} geometry={parts.dotGeometry} material={dotMaterial} />

        {/* Drawn on by sliding a single dash, as long as the ring, into place. */}
        {parts.indiaRings.map((ring, i) => (
          <Line
            key={i}
            ref={(node) => {
              indiaLines.current[i] = node as unknown as Line2 | null;
            }}
            points={ring.points}
            color={palette.accent}
            lineWidth={1.4}
            transparent
            dashed
            dashSize={ring.length}
            gapSize={ring.length}
            dashOffset={ring.length}
          />
        ))}

        <mesh ref={slab} geometry={parts.slabGeometry} visible={false}>
          <meshStandardMaterial color={palette.slab} roughness={0.7} metalness={0} side={DoubleSide} transparent />
        </mesh>
        {/* Shown and lifted through the group: <Line> passes its props on to its material too. */}
        <group ref={slabEdge} visible={false}>
          <Line points={parts.edge} color={palette.accent} lineWidth={1.6} />
        </group>

        <group ref={pin} quaternion={pinRotation} scale={1.4} visible={false}>
          <mesh position={[0, 0.00225, 0]}>
            <cylinderGeometry args={[0.00011, 0.00011, 0.0045, 12]} />
            <meshStandardMaterial color={palette.light ? "#2e2e33" : "#eeede8"} roughness={0.5} />
          </mesh>
          <mesh ref={pinHead} position={[0, 0.0045, 0]}>
            <sphereGeometry args={[0.0009, 24, 16]} />
            <meshStandardMaterial color={palette.accent} roughness={0.55} />
          </mesh>
          <mesh ref={pulse} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.0001, 0]}>
            <ringGeometry args={[0.0007, 0.00085, 48]} />
            <meshBasicMaterial color={palette.accent} transparent depthWrite={false} side={DoubleSide} />
          </mesh>
          {shown >= 3 && (
            <Html position={[0, 0.0068, 0]} center className="intro-pin" zIndexRange={[1, 0]}>
              {pinLabel}
            </Html>
          )}
        </group>
      </group>
    </>
  );
}

/** The opening sequence's own canvas. It is removed once the page has opened. */
export default function IntroCanvas({
  geo,
  stage,
  pinLabel,
  onStage,
  onOpen,
  onReady,
}: Omit<FlightProps, "geo"> & { geo: IntroGeo; onReady: () => void }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ fov: 30, position: [0, 0, 6], near: 1, far: 10 }}
      gl={{ alpha: true, antialias: true, toneMapping: NeutralToneMapping, outputColorSpace: SRGBColorSpace }}
      onCreated={() => requestAnimationFrame(onReady)}
      style={{ position: "absolute", inset: 0 }}
      aria-hidden="true"
    >
      <Flight geo={geo} stage={stage} pinLabel={pinLabel} onStage={onStage} onOpen={onOpen} />
    </Canvas>
  );
}
