"use client";

import { RoundedBox } from "@react-three/drei";
import { useMemo, useRef } from "react";
import { BufferGeometry, DoubleSide, Float32BufferAttribute, type Group } from "three";
import { useModelFrame, useModelPalette } from "@/components/three/models/context";

/** A folded paper plane: two wings meeting at the keel. */
function planeGeometry(): BufferGeometry {
  const geometry = new BufferGeometry();
  // Nose at +x; each wing is a triangle from the nose to the tail corners and the keel.
  const vertices = [
    0.6, 0, 0, -0.5, 0.02, 0.38, -0.5, -0.08, 0, 0.6, 0, 0, -0.5, -0.08, 0, -0.5, 0.02, -0.38,
  ];
  geometry.setAttribute("position", new Float32BufferAttribute(vertices, 3));
  geometry.computeVertexNormals();
  return geometry;
}

/** /contact: a paper plane looping around an envelope. */
export default function PaperPlane() {
  const palette = useModelPalette();
  const plane = useRef<Group>(null);
  const geometry = useMemo(() => planeGeometry(), []);

  useModelFrame((_, time) => {
    const angle = time * 0.7 + 0.6;
    if (!plane.current) return;
    plane.current.position.set(
      Math.cos(angle) * 2.3,
      0.4 + Math.sin(angle * 2) * 0.35,
      Math.sin(angle) * 1.6,
    );
    plane.current.rotation.set(0, -angle - Math.PI / 2, Math.sin(angle * 2) * 0.3);
  });

  return (
    <group rotation={[0.3, -0.2, 0]}>
      <group rotation={[0, -0.3, 0]}>
        <RoundedBox args={[2.2, 1.4, 0.1]} radius={0.06} smoothness={3}>
          <meshStandardMaterial color={palette.card} roughness={0.6} />
        </RoundedBox>
        <mesh position={[0, 0.3, 0.06]} rotation={[0, 0, Math.PI]} scale={[1.6, 1, 1]}>
          <circleGeometry args={[0.82, 3, Math.PI / 2]} />
          <meshStandardMaterial color={palette.line} side={DoubleSide} />
        </mesh>
        <mesh position={[0, -0.15, 0.07]}>
          <circleGeometry args={[0.16, 32]} />
          <meshStandardMaterial color={palette.accent} />
        </mesh>
      </group>
      <group ref={plane} scale={1.5}>
        <mesh geometry={geometry}>
          <meshStandardMaterial color={palette.accent} side={DoubleSide} roughness={0.4} />
        </mesh>
      </group>
    </group>
  );
}
