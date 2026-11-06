"use client";

import { RoundedBox } from "@react-three/drei";
import { useMemo, useRef } from "react";
import { Quaternion, Vector3, type Group, type Mesh } from "three";
import { useModelFrame, useModelPalette } from "@/components/three/models/context";

const RADIUS = 2.1;
const COUNT = 5;
const UP = new Vector3(0, 1, 0);

/**
 * Agentic automation: an agent node at the centre with five tool nodes
 * (WhatsApp, phone, CRM, calendar, sheets) on a tilted ring, linked to it,
 * with packets travelling out and back along every link.
 */
export default function NodeGraph() {
  const palette = useModelPalette();
  const root = useRef<Group>(null);
  const packets = useRef<(Mesh | null)[]>([]);
  const colors = [palette.wa, palette.ai, palette.web, palette.mob, palette.data];

  const nodes = useMemo(
    () =>
      Array.from({ length: COUNT }, (_, index) => {
        const angle = (index / COUNT) * Math.PI * 2;
        const end = new Vector3(Math.cos(angle) * RADIUS, 0, Math.sin(angle) * RADIUS);
        const quaternion = new Quaternion().setFromUnitVectors(UP, end.clone().normalize());
        return { end, quaternion, mid: end.clone().multiplyScalar(0.5) };
      }),
    [],
  );

  useModelFrame((_, time) => {
    if (root.current) root.current.rotation.y = time * 0.18;
    packets.current.forEach((packet, index) => {
      if (!packet) return;
      const phase = (time * 0.45 + index / COUNT) % 2;
      const u = phase < 1 ? phase : 2 - phase;
      packet.position.copy(nodes[index].end).multiplyScalar(0.25 + u * 0.6);
    });
  });

  return (
    <group rotation={[0.42, 0, 0]}>
      <group ref={root}>
        <mesh>
          <sphereGeometry args={[0.55, 40, 40]} />
          <meshStandardMaterial
            color={palette.accent}
            emissive={palette.accent}
            emissiveIntensity={0.25}
            roughness={0.3}
          />
        </mesh>
        {nodes.map((node, index) => (
          <group key={index}>
            <mesh position={node.mid} quaternion={node.quaternion}>
              <cylinderGeometry args={[0.018, 0.018, RADIUS - 0.2, 8]} />
              <meshStandardMaterial color={palette.line} />
            </mesh>
            <RoundedBox args={[0.6, 0.6, 0.6]} radius={0.12} smoothness={3} position={node.end}>
              <meshStandardMaterial color={colors[index]} roughness={0.4} />
            </RoundedBox>
            <mesh ref={(mesh) => void (packets.current[index] = mesh)}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshStandardMaterial
                color={palette.amber}
                emissive={palette.amber}
                emissiveIntensity={0.4}
              />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}
