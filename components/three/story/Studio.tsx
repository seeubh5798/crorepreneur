"use client";

import { Environment, Lightformer } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { DirectionalLight, PointLight } from "three";
import type { PhoneState } from "./Phone";

/**
 * Studio lighting for matte surfaces, set up the way a product shot would be:
 * large soft boxes in a dark room, which matte and satin finishes turn into
 * broad, gentle gradients rather than sharp reflections. A key light and two
 * muted rim lights keep moving, so the light travels over every surface as
 * you scroll.
 */
export function Studio({ phone }: { phone: { current: PhoneState } }) {
  const key = useRef<DirectionalLight>(null);
  const violet = useRef<PointLight>(null);
  const blue = useRef<PointLight>(null);
  const warm = useRef<PointLight>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const { x, y, scale } = phone.current;
    const r = 1.6 * Math.max(0.6, scale);
    if (key.current) key.current.position.set(Math.cos(t * 0.15) * 6, 6, 5 + Math.sin(t * 0.15) * 2);
    if (violet.current) {
      violet.current.position.set(x + Math.cos(t * 0.6) * r, y + Math.sin(t * 0.45) * r, 1.6);
      violet.current.intensity = 4.5 + Math.sin(t * 1.3) * 1.2;
    }
    if (blue.current) {
      blue.current.position.set(x + Math.cos(t * 0.6 + Math.PI) * r, y + Math.sin(t * 0.45 + Math.PI) * r, 1.4);
    }
    if (warm.current) warm.current.position.set(Math.sin(t * 0.2) * 4, -2.5, 3);
  });

  return (
    <>
      {/* Reflection environment: a dark room with five soft boxes, rendered once. */}
      <Environment resolution={256} frames={1}>
        <color attach="background" args={["#0a0a0d"]} />
        <Lightformer form="rect" intensity={2.8} scale={[10, 4]} position={[0, 9, 3]} target={[0, 0, 0]} />
        <Lightformer
          form="rect"
          intensity={1.6}
          color="#e4e1f2"
          scale={[3, 9]}
          position={[-9, 1, 2]}
          target={[0, 0, 0]}
        />
        <Lightformer form="rect" intensity={1.4} color="#e0e6f2" scale={[3, 9]} position={[9, 0, 1]} target={[0, 0, 0]} />
        <Lightformer
          form="rect"
          intensity={1.5}
          color="#f6ebe2"
          scale={[8, 1.2]}
          position={[0, -2, 9]}
          target={[0, 0, 0]}
        />
        <Lightformer form="rect" intensity={0.8} scale={[6, 6]} position={[0, 2, -10]} target={[0, 0, 0]} />
      </Environment>

      <ambientLight intensity={0.3} />
      <directionalLight ref={key} intensity={1.6} color="#fffaf4" />
      <pointLight ref={violet} color="#c2bce8" intensity={4.5} distance={9} decay={2} />
      <pointLight ref={blue} color="#bfcbe8" intensity={4} distance={9} decay={2} />
      <pointLight ref={warm} color="#f3e0d4" intensity={6} distance={10} decay={2} />
    </>
  );
}
