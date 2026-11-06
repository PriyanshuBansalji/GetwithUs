"use client";

import { useRef, type ComponentType } from "react";
import type { Group } from "three";
import { useModelFrame, useModelPalette } from "@/components/three/models/context";
import Funnel from "@/components/three/models/Funnel";
import GlassBrowser from "@/components/three/models/GlassBrowser";
import NodeGraph from "@/components/three/models/NodeGraph";
import PhoneScreens from "@/components/three/models/PhoneScreens";
import ServerHub from "@/components/three/models/ServerHub";

const MODELS: ComponentType[] = [GlassBrowser, PhoneScreens, NodeGraph, Funnel, ServerHub];
const RADIUS = 2.2;

/** /services: the five service line models, small, on one slow turntable. */
export default function ServicesTurntable() {
  const palette = useModelPalette();
  const table = useRef<Group>(null);

  useModelFrame((_, time) => {
    if (table.current) table.current.rotation.y = time * 0.15;
  });

  return (
    <group rotation={[0.18, 0, 0]} position={[0, -0.2, 0]}>
      <mesh position={[0, -0.75, 0]}>
        <cylinderGeometry args={[3.1, 3.1, 0.12, 72]} />
        <meshStandardMaterial color={palette.card} roughness={0.7} />
      </mesh>
      <group ref={table}>
        {MODELS.map((Model, index) => {
          const angle = (index / MODELS.length) * Math.PI * 2;
          return (
            <group
              key={index}
              position={[Math.sin(angle) * RADIUS, 0, Math.cos(angle) * RADIUS]}
              rotation={[0, angle, 0]}
              scale={0.5}
            >
              <Model />
            </group>
          );
        })}
      </group>
    </group>
  );
}
