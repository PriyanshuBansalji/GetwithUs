"use client";

import { RoundedBox } from "@react-three/drei";
import { useRef } from "react";
import type { Mesh, MeshStandardMaterial } from "three";
import { useModelFrame, useModelPalette } from "@/components/three/models/context";

/** Scope, build, launch, run: four platforms climbing to the right. */
const STEPS = [
  [-2.1, -0.9, 0.4],
  [-0.7, -0.4, 0],
  [0.7, 0.1, -0.4],
  [2.1, 0.6, -0.8],
] as const;
const SECONDS_PER_STEP = 1.3;

/** /process: a path of four platforms that light up one by one, with a marker hopping along them. */
export default function ProcessPath() {
  const palette = useModelPalette();
  const tops = useRef<(MeshStandardMaterial | null)[]>([]);
  const marker = useRef<Mesh>(null);

  useModelFrame((_, time) => {
    const cycle = time / SECONDS_PER_STEP;
    const lit = Math.floor(cycle) % (STEPS.length + 1);
    tops.current.forEach((material, index) => {
      if (!material) return;
      const on = index < lit || time === 0;
      material.color.copy(on ? palette.accent : palette.card);
      material.emissive.copy(palette.accent);
      material.emissiveIntensity = on ? 0.25 : 0;
    });
    if (marker.current) {
      const index = Math.min(Math.max(lit - 1, 0), STEPS.length - 1);
      const from = STEPS[Math.max(index - 1, 0)];
      const to = STEPS[index];
      const u = lit === 0 ? 0 : Math.min(1, (cycle % 1) * 2.5);
      const [x, y, z] = time === 0 ? STEPS[STEPS.length - 1] : to;
      marker.current.position.set(
        from[0] + (x - from[0]) * u,
        from[1] + (y - from[1]) * u + 0.45 + Math.sin(u * Math.PI) * 0.6,
        from[2] + (z - from[2]) * u,
      );
    }
  });

  return (
    <group rotation={[0.35, -0.35, 0]}>
      {STEPS.map((position, index) => (
        <group key={index} position={[...position]}>
          <RoundedBox args={[1.15, 0.28, 1.15]} radius={0.08} smoothness={3}>
            <meshStandardMaterial
              ref={(material) => void (tops.current[index] = material)}
              color={palette.card}
              roughness={0.45}
            />
          </RoundedBox>
          <mesh position={[0, -0.32, 0]}>
            <boxGeometry args={[1.0, 0.36, 1.0]} />
            <meshStandardMaterial color={palette.line} roughness={0.7} />
          </mesh>
        </group>
      ))}
      <mesh ref={marker}>
        <sphereGeometry args={[0.16, 24, 24]} />
        <meshStandardMaterial
          color={palette.amber}
          emissive={palette.amber}
          emissiveIntensity={0.4}
        />
      </mesh>
    </group>
  );
}
