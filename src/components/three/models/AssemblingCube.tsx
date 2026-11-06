"use client";

import { useMemo, useRef } from "react";
import { BoxGeometry, EdgesGeometry, type Group } from "three";
import { useModelFrame, useModelPalette } from "@/components/three/models/context";
import { useBriefStore } from "@/stores/brief.store";

const SIZE = 1.7;
/** Bottom, back, left, right, top, front: the order faces arrive in. */
const FACES: { position: [number, number, number]; rotation: [number, number, number] }[] = [
  { position: [0, -SIZE / 2, 0], rotation: [Math.PI / 2, 0, 0] },
  { position: [0, 0, -SIZE / 2], rotation: [0, 0, 0] },
  { position: [-SIZE / 2, 0, 0], rotation: [0, Math.PI / 2, 0] },
  { position: [SIZE / 2, 0, 0], rotation: [0, Math.PI / 2, 0] },
  { position: [0, SIZE / 2, 0], rotation: [Math.PI / 2, 0, 0] },
  { position: [0, 0, SIZE / 2], rotation: [0, 0, 0] },
];

/**
 * /start: a cube that assembles one face per completed brief step (five
 * steps, five faces) and gains the sixth when the brief is sent. Faces glide
 * in from outside; the cube turns slowly.
 */
export default function AssemblingCube() {
  const palette = useModelPalette();
  const step = useBriefStore((state) => state.step);
  const pending = useBriefStore((state) => state.pending);
  const done = useBriefStore((state) => state.done);
  // One face per completed step (at least the base), five once the brief is sent for verification, six when confirmed.
  const faces = done ? 6 : pending ? 5 : Math.max(1, step - 1);
  const root = useRef<Group>(null);
  /** The outline: the cube's twelve edges only (a wireframe also draws each face's diagonal). */
  const outline = useMemo(() => new EdgesGeometry(new BoxGeometry(SIZE, SIZE, SIZE)), []);
  const panels = useRef<(Group | null)[]>([]);
  /** How far out each face sits: 1 in place, 2.4 waiting outside. */
  const offsets = useRef(FACES.map(() => 2.4));

  useModelFrame((delta, time) => {
    if (root.current) root.current.rotation.y = -0.7 + time * 0.3;
    panels.current.forEach((panel, index) => {
      if (!panel) return;
      const target = index < faces ? 1 : 2.4;
      const ease = delta === 0 ? 1 : Math.min(1, delta * 4);
      const next = offsets.current[index] + (target - offsets.current[index]) * ease;
      offsets.current[index] = next;
      const face = FACES[index];
      panel.position.set(face.position[0] * next, face.position[1] * next, face.position[2] * next);
      panel.visible = next < 2.3;
    });
  });

  return (
    <group rotation={[0.45, 0, 0]}>
      <group ref={root} rotation={[0, -0.7, 0]}>
        <lineSegments geometry={outline}>
          <lineBasicMaterial color={palette.accent} transparent opacity={0.45} />
        </lineSegments>
        {FACES.map((face, index) => (
          <group
            key={index}
            ref={(panel) => void (panels.current[index] = panel)}
            position={face.position}
            rotation={face.rotation}
          >
            <mesh>
              <boxGeometry args={[SIZE * 0.96, SIZE * 0.96, 0.06]} />
              <meshStandardMaterial
                color={index === 5 ? palette.accent : palette.card}
                transparent
                opacity={index === 5 ? 1 : 0.9}
                roughness={0.45}
              />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}
