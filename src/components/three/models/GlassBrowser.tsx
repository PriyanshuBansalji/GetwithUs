"use client";

import { RoundedBox } from "@react-three/drei";
import { useRef } from "react";
import type { Group } from "three";
import { useModelFrame, useModelPalette } from "@/components/three/models/context";

const W = 3.4;
const H = 2.2;

/**
 * Web development: a browser window made of four stacked glass layers
 * (wireframe, layout, content, live) that drift apart and settle again.
 */
export default function GlassBrowser() {
  const palette = useModelPalette();
  const root = useRef<Group>(null);
  const layers = useRef<(Group | null)[]>([]);

  useModelFrame((_, time) => {
    const spread = (Math.sin(time * 0.9) + 1) / 2;
    const gap = 0.14 + spread * 0.42;
    layers.current.forEach((layer, index) => {
      if (layer) layer.position.z = (index - 1.5) * gap;
    });
    if (root.current) root.current.rotation.y = -0.55 + Math.sin(time * 0.3) * 0.12;
  });

  const panel = (color: typeof palette.card, opacity: number) => (
    <RoundedBox args={[W, H, 0.05]} radius={0.06} smoothness={3}>
      <meshStandardMaterial color={color} transparent opacity={opacity} roughness={0.25} />
    </RoundedBox>
  );

  return (
    <group ref={root} rotation={[0.18, -0.55, 0]}>
      <group ref={(group) => void (layers.current[0] = group)}>{panel(palette.line, 0.5)}</group>
      <group ref={(group) => void (layers.current[1] = group)}>
        {panel(palette.accent, 0.18)}
        {[-0.9, 0.2, 1.1].map((x) => (
          <mesh key={x} position={[x, -0.45, 0.04]}>
            <boxGeometry args={[0.8, 0.7, 0.02]} />
            <meshStandardMaterial color={palette.accent} transparent opacity={0.45} />
          </mesh>
        ))}
      </group>
      <group ref={(group) => void (layers.current[2] = group)}>
        {panel(palette.card, 0.82)}
        <mesh position={[-0.55, 0.35, 0.04]}>
          <boxGeometry args={[1.7, 0.2, 0.02]} />
          <meshStandardMaterial color={palette.ink} />
        </mesh>
        <mesh position={[-0.8, 0.05, 0.04]}>
          <boxGeometry args={[1.2, 0.1, 0.02]} />
          <meshStandardMaterial color={palette.line} />
        </mesh>
        <mesh position={[0.95, 0.2, 0.04]}>
          <boxGeometry args={[1, 0.7, 0.02]} />
          <meshStandardMaterial color={palette.accent} transparent opacity={0.35} />
        </mesh>
      </group>
      <group ref={(group) => void (layers.current[3] = group)}>
        {panel(palette.card, 0.3)}
        <mesh position={[0, H / 2 - 0.16, 0.04]}>
          <boxGeometry args={[W - 0.1, 0.22, 0.02]} />
          <meshStandardMaterial color={palette.line} transparent opacity={0.8} />
        </mesh>
        {["#f26b5b", "#f5b54a", "#3ec27a"].map((color, index) => (
          <mesh key={color} position={[-W / 2 + 0.22 + index * 0.17, H / 2 - 0.16, 0.07]}>
            <sphereGeometry args={[0.045, 12, 12]} />
            <meshStandardMaterial color={color} />
          </mesh>
        ))}
        <mesh position={[-0.75, -0.25, 0.04]}>
          <boxGeometry args={[0.7, 0.22, 0.02]} />
          <meshStandardMaterial color={palette.accent} />
        </mesh>
      </group>
    </group>
  );
}
