"use client";

import { RoundedBox } from "@react-three/drei";
import { useRef } from "react";
import type { Group } from "three";
import { useModelFrame, useModelPalette } from "@/components/three/models/context";

const COUNT = 4;

/**
 * /work: stacked project folders that fan out and close again. With `closed`
 * (no published case studies yet) they stay stacked and only breathe.
 */
export default function Folders({ closed = false }: { closed?: boolean }) {
  const palette = useModelPalette();
  const folders = useRef<(Group | null)[]>([]);
  // The brand palette: ink folders behind a teal one in front (the category colours read as off-brand here).
  const colors = [palette.ink, palette.ink, palette.ink, palette.accent];

  useModelFrame((_, time) => {
    const open = closed ? 0 : (Math.sin(time * 0.8 - Math.PI / 2) + 1) / 2;
    folders.current.forEach((folder, index) => {
      if (!folder) return;
      const spread = index - (COUNT - 1) / 2;
      folder.rotation.z = spread * 0.32 * open;
      folder.position.x = spread * 0.55 * open;
      folder.position.y = index * 0.08 + Math.sin(time * 1.2 + index) * (closed ? 0.02 : 0);
      folder.position.z = index * 0.12;
    });
  });

  return (
    <group rotation={[0.2, -0.3, 0]} position={[0, -1.4, 0]}>
      {Array.from({ length: COUNT }, (_, index) => (
        <group
          key={index}
          ref={(folder) => void (folders.current[index] = folder)}
          position={[0, index * 0.08, index * 0.12]}
        >
          <group position={[0, 0.9, 0]}>
            <RoundedBox args={[2.6, 1.8, 0.07]} radius={0.06} smoothness={3}>
              <meshStandardMaterial color={colors[index]} roughness={0.5} />
            </RoundedBox>
            <RoundedBox
              args={[0.9, 0.3, 0.07]}
              radius={0.06}
              smoothness={3}
              position={[-0.75, 0.98, 0]}
            >
              <meshStandardMaterial color={colors[index]} roughness={0.5} />
            </RoundedBox>
            <mesh position={[0, 0.1, 0.05]}>
              <planeGeometry args={[2.2, 1.3]} />
              <meshStandardMaterial color={palette.card} roughness={0.7} />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  );
}
