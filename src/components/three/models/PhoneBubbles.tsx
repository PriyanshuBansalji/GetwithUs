"use client";

import { RoundedBox } from "@react-three/drei";
import { useRef } from "react";
import type { Group } from "three";
import { useModelFrame, useModelPalette } from "@/components/three/models/context";

const BUBBLES = [
  { x: -0.3, y: 0.85, z: 0.45, w: 1.1, mine: false },
  { x: 0.35, y: 0.35, z: 0.8, w: 1.0, mine: true },
  { x: -0.25, y: -0.15, z: 1.15, w: 0.9, mine: false },
  { x: 0.4, y: -0.65, z: 1.5, w: 1.15, mine: true },
];

/** WhatsApp bot: a phone with chat bubbles floating out of its screen at different depths. */
export default function PhoneBubbles() {
  const palette = useModelPalette();
  const root = useRef<Group>(null);
  const bubbles = useRef<(Group | null)[]>([]);

  useModelFrame((_, time) => {
    if (root.current) root.current.rotation.y = -0.5 + Math.sin(time * 0.35) * 0.25;
    bubbles.current.forEach((bubble, index) => {
      if (bubble) bubble.position.y = BUBBLES[index].y + Math.sin(time * 1.2 + index) * 0.06;
    });
  });

  return (
    <group ref={root} rotation={[0.1, -0.5, 0]}>
      <RoundedBox args={[1.55, 3.1, 0.18]} radius={0.2} smoothness={4}>
        <meshStandardMaterial color={palette.ink} roughness={0.35} metalness={0.2} />
      </RoundedBox>
      <mesh position={[0, 0, 0.1]}>
        <planeGeometry args={[1.36, 2.88]} />
        <meshStandardMaterial color={palette.wa} transparent opacity={0.18} />
      </mesh>
      <mesh position={[0, 1.25, 0.11]}>
        <planeGeometry args={[1.36, 0.36]} />
        <meshStandardMaterial color={palette.wa} />
      </mesh>
      {BUBBLES.map((bubble, index) => (
        <group
          key={index}
          ref={(group) => void (bubbles.current[index] = group)}
          position={[bubble.x, bubble.y, bubble.z]}
        >
          <RoundedBox args={[bubble.w, 0.36, 0.08]} radius={0.12} smoothness={3}>
            <meshStandardMaterial color={bubble.mine ? palette.wa : palette.card} roughness={0.4} />
          </RoundedBox>
          <mesh position={[-bubble.w / 2 + 0.42, 0.04, 0.045]}>
            <boxGeometry args={[bubble.w * 0.6, 0.05, 0.01]} />
            <meshStandardMaterial color={bubble.mine ? palette.card : palette.line} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
