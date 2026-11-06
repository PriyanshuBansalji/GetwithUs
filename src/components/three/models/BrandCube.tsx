"use client";

import { RoundedBox } from "@react-three/drei";
import { useRef } from "react";
import type { Group } from "three";
import { useModelFrame, useModelPalette } from "@/components/three/models/context";

const RING = 2.1;
const SATELLITES = [0, 2.1, 4.2];

/**
 * The brand cube inside a tilted ring with three satellites: the brand's own
 * model, used by the design kit and later by the 404 page. It sways and bobs;
 * the satellites circle the ring.
 */
export default function BrandCube() {
  const palette = useModelPalette();
  const cube = useRef<Group>(null);
  const satellites = useRef<Group>(null);

  useModelFrame((_, time) => {
    if (cube.current) {
      cube.current.rotation.y = -0.55 + Math.sin(time * 0.5) * 0.5;
      cube.current.position.y = Math.sin(time * 1.1) * 0.06;
    }
    if (satellites.current) satellites.current.rotation.z = -time * 0.5;
  });

  return (
    <group rotation={[0.22, 0, 0]}>
      <group ref={cube} rotation={[0, -0.55, 0]}>
        <RoundedBox args={[1.6, 1.6, 1.6]} radius={0.16} smoothness={4}>
          <meshStandardMaterial color={palette.card} roughness={0.5} metalness={0.05} />
        </RoundedBox>
        <RoundedBox args={[0.8, 0.8, 0.14]} radius={0.12} smoothness={4} position={[0, 0, 0.8]}>
          <meshStandardMaterial color={palette.accent} roughness={0.35} />
        </RoundedBox>
        <RoundedBox
          args={[0.8, 0.8, 0.14]}
          radius={0.12}
          smoothness={4}
          position={[0.8, 0, 0]}
          rotation={[0, Math.PI / 2, 0]}
        >
          <meshStandardMaterial color={palette.accent} roughness={0.35} />
        </RoundedBox>
      </group>
      <group rotation={[1.12, 0, -0.17]}>
        <mesh>
          <torusGeometry args={[RING, 0.014, 8, 160]} />
          <meshBasicMaterial color={palette.accent} transparent opacity={0.55} />
        </mesh>
        <group ref={satellites}>
          {SATELLITES.map((angle) => (
            <mesh key={angle} position={[Math.cos(angle) * RING, Math.sin(angle) * RING, 0]}>
              <sphereGeometry args={[0.1, 20, 20]} />
              <meshStandardMaterial color={palette.amber} roughness={0.4} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
}
