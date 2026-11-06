"use client";

import { RoundedBox } from "@react-three/drei";
import { useRef } from "react";
import type { Group } from "three";
import { useModelFrame, useModelPalette } from "@/components/three/models/context";

/** 404: the brand cube drifting away from an empty orbit, tumbling slowly, and drifting back. */
export default function DriftingCube() {
  const palette = useModelPalette();
  const cube = useRef<Group>(null);

  useModelFrame((_, time) => {
    if (!cube.current) return;
    const drift = (Math.sin(time * 0.35) + 1) / 2;
    cube.current.position.set(1.0 + drift * 1.1, 0.5 + drift * 0.6, -drift * 1.5);
    cube.current.rotation.set(time * 0.25 + 0.3, time * 0.35 - 0.6, time * 0.15);
  });

  return (
    <group rotation={[0.3, 0, 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[-0.6, -0.3, 0]}>
        <torusGeometry args={[1.5, 0.014, 8, 160]} />
        <meshBasicMaterial color={palette.accent} transparent opacity={0.45} />
      </mesh>
      <group ref={cube} position={[1.0, 0.5, 0]} rotation={[0.3, -0.6, 0]}>
        <RoundedBox args={[1.0, 1.0, 1.0]} radius={0.12} smoothness={4}>
          <meshStandardMaterial color={palette.card} roughness={0.5} />
        </RoundedBox>
        <RoundedBox args={[0.5, 0.5, 0.1]} radius={0.08} smoothness={3} position={[0, 0, 0.5]}>
          <meshStandardMaterial color={palette.accent} roughness={0.35} />
        </RoundedBox>
      </group>
    </group>
  );
}
