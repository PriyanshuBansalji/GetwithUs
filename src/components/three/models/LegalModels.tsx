"use client";

import { RoundedBox } from "@react-three/drei";
import { useMemo } from "react";
import { ExtrudeGeometry, Shape } from "three";
import { useModelPalette } from "@/components/three/models/context";

function shieldShape(): Shape {
  const shape = new Shape();
  shape.moveTo(0, 1.2);
  shape.bezierCurveTo(0.5, 1.0, 0.9, 1.0, 1.1, 1.0);
  shape.bezierCurveTo(1.1, 0.0, 0.8, -0.8, 0, -1.3);
  shape.bezierCurveTo(-0.8, -0.8, -1.1, 0.0, -1.1, 1.0);
  shape.bezierCurveTo(-0.9, 1.0, -0.5, 1.0, 0, 1.2);
  return shape;
}

/** /privacy: a still shield with a check. No motion on legal pages. */
export function Shield() {
  const palette = useModelPalette();
  const geometry = useMemo(
    () =>
      new ExtrudeGeometry(shieldShape(), {
        depth: 0.3,
        bevelEnabled: true,
        bevelSize: 0.06,
        bevelThickness: 0.06,
        bevelSegments: 4,
      }),
    [],
  );
  return (
    <group rotation={[0.15, -0.45, 0]}>
      <mesh geometry={geometry} position={[0, 0, -0.15]}>
        <meshStandardMaterial color={palette.accent} roughness={0.35} />
      </mesh>
      <group position={[0, 0, 0.24]} rotation={[0, 0, -0.75]}>
        <mesh position={[-0.12, -0.2, 0]}>
          <boxGeometry args={[0.16, 0.5, 0.08]} />
          <meshStandardMaterial color={palette.card} />
        </mesh>
        <mesh position={[0.17, 0.08, 0]}>
          <boxGeometry args={[0.75, 0.16, 0.08]} />
          <meshStandardMaterial color={palette.card} />
        </mesh>
      </group>
    </group>
  );
}

/** /terms: a still document with ruled lines. No motion on legal pages. */
export function LegalDocument() {
  const palette = useModelPalette();
  return (
    <group rotation={[0.2, -0.5, 0.06]}>
      <RoundedBox
        args={[2.1, 2.8, 0.08]}
        radius={0.06}
        smoothness={3}
        position={[0.25, -0.15, -0.25]}
      >
        <meshStandardMaterial color={palette.line} roughness={0.7} />
      </RoundedBox>
      <RoundedBox args={[2.1, 2.8, 0.08]} radius={0.06} smoothness={3}>
        <meshStandardMaterial color={palette.card} roughness={0.6} />
      </RoundedBox>
      <mesh position={[-0.35, 1.0, 0.05]}>
        <boxGeometry args={[1.0, 0.14, 0.02]} />
        <meshStandardMaterial color={palette.ink} />
      </mesh>
      {[0.6, 0.35, 0.1, -0.15, -0.4, -0.65].map((y, index) => (
        <mesh key={y} position={[index % 3 === 2 ? -0.25 : 0, y, 0.05]}>
          <boxGeometry args={[index % 3 === 2 ? 1.1 : 1.6, 0.07, 0.02]} />
          <meshStandardMaterial color={palette.line} />
        </mesh>
      ))}
      <mesh position={[0.55, -1.0, 0.06]}>
        <circleGeometry args={[0.22, 32]} />
        <meshStandardMaterial color={palette.accent} />
      </mesh>
    </group>
  );
}
