"use client";

import { useRef } from "react";
import type { Group, Mesh, MeshStandardMaterial } from "three";
import { useModelFrame, useModelPalette } from "@/components/three/models/context";

const RINGS = 3;

/** Calling agent: a handset inside sound rings that expand outward and fade. */
export default function HandsetRings() {
  const palette = useModelPalette();
  const handset = useRef<Group>(null);
  const rings = useRef<(Mesh | null)[]>([]);

  useModelFrame((_, time) => {
    if (handset.current) handset.current.rotation.z = -0.65 + Math.sin(time * 3) * 0.04;
    rings.current.forEach((ring, index) => {
      if (!ring) return;
      const life = (time * 0.42 + index / RINGS) % 1;
      ring.scale.setScalar(0.9 + life * 1.5);
      (ring.material as MeshStandardMaterial).opacity = 0.55 * (1 - life);
    });
  });

  return (
    <group rotation={[0.15, -0.3, 0]}>
      {Array.from({ length: RINGS }, (_, index) => (
        <mesh
          key={index}
          ref={(mesh) => void (rings.current[index] = mesh)}
          scale={1.2 + index * 0.5}
        >
          <torusGeometry args={[1, 0.022, 12, 96]} />
          <meshStandardMaterial
            color={palette.ai}
            transparent
            opacity={0.45 - index * 0.12}
            emissive={palette.ai}
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}
      <group ref={handset} rotation={[0, 0, -0.65]}>
        <mesh>
          <capsuleGeometry args={[0.16, 1.5, 8, 24]} />
          <meshStandardMaterial color={palette.accent} roughness={0.35} />
        </mesh>
        {[0.9, -0.9].map((y) => (
          <mesh key={y} position={[0.2, y, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.3, 0.3, 0.3, 32]} />
            <meshStandardMaterial color={palette.accent} roughness={0.35} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
