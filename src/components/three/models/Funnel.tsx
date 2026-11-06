"use client";

import { useMemo, useRef } from "react";
import { DoubleSide, Object3D, type Group, type InstancedMesh } from "three";
import { useModelFrame, useModelPalette } from "@/components/three/models/context";

/** Impressions, clicks, enquiries, bookings: each layer narrower than the one above. */
const LAYERS = [
  { y: 1.15, top: 1.75, bottom: 1.35 },
  { y: 0.4, top: 1.3, bottom: 0.95 },
  { y: -0.35, top: 0.9, bottom: 0.62 },
  { y: -1.1, top: 0.58, bottom: 0.38 },
];
const PARTICLES = 40;
const TOP = 1.7;
const BOTTOM = -1.6;

/** Digital marketing: a 3D funnel of four layers with particles flowing down through it. */
export default function Funnel() {
  const palette = useModelPalette();
  const root = useRef<Group>(null);
  const particles = useRef<InstancedMesh>(null);
  const colors = [palette.mkt, palette.web, palette.accent, palette.ok];
  const dummy = useMemo(() => new Object3D(), []);
  const seeds = useMemo(
    () =>
      Array.from({ length: PARTICLES }, (_, index) => ({
        angle: (index * 2.39996) % (Math.PI * 2),
        offset: index / PARTICLES,
        spread: 0.35 + ((index * 37) % 10) / 16,
      })),
    [],
  );

  useModelFrame((_, time) => {
    if (root.current) root.current.rotation.y = time * 0.25;
    const mesh = particles.current;
    if (!mesh) return;
    seeds.forEach((seed, index) => {
      const u = (time * 0.18 + seed.offset) % 1;
      const y = TOP - u * (TOP - BOTTOM);
      const width = 0.25 + ((y - BOTTOM) / (TOP - BOTTOM)) * 1.25;
      const r = width * seed.spread * 0.8;
      dummy.position.set(Math.cos(seed.angle) * r, y, Math.sin(seed.angle) * r);
      dummy.scale.setScalar(1 - u * 0.4);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <group rotation={[0.32, 0, 0]}>
      <group ref={root}>
        {LAYERS.map((layer, index) => (
          <mesh key={layer.y} position={[0, layer.y, 0]}>
            <cylinderGeometry args={[layer.top, layer.bottom, 0.55, 64, 1, true]} />
            <meshStandardMaterial
              color={colors[index]}
              transparent
              opacity={0.42}
              side={DoubleSide}
              roughness={0.3}
            />
          </mesh>
        ))}
        <instancedMesh ref={particles} args={[undefined, undefined, PARTICLES]}>
          <sphereGeometry args={[0.05, 10, 10]} />
          <meshStandardMaterial
            color={palette.amber}
            emissive={palette.amber}
            emissiveIntensity={0.35}
          />
        </instancedMesh>
      </group>
    </group>
  );
}
