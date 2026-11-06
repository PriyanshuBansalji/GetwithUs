"use client";

import { RoundedBox } from "@react-three/drei";
import { useMemo, useRef } from "react";
import { CatmullRomCurve3, TubeGeometry, Vector3, type Group, type Mesh } from "three";
import { useModelFrame, useModelPalette } from "@/components/three/models/context";

const HUB = new Vector3(1.0, 0, 0);
const SERVERS = [-0.5, 0, 0.5].map((y) => new Vector3(-1.5, y, 0));
const NODES = [
  new Vector3(2.0, 1.1, 0.4),
  new Vector3(2.3, -0.2, -0.6),
  new Vector3(1.8, -1.2, 0.5),
];

/** Custom software: a stack of server blocks and an integration hub, joined by cables with packets moving along them. */
export default function ServerHub() {
  const palette = useModelPalette();
  const root = useRef<Group>(null);
  const packets = useRef<(Mesh | null)[]>([]);

  const cables = useMemo(() => {
    const ends = [...SERVERS.map((start) => [start, HUB]), ...NODES.map((end) => [HUB, end])];
    return ends.map(([from, to]) => {
      const mid = from
        .clone()
        .lerp(to, 0.5)
        .add(new Vector3(0, 0, 0.5));
      const curve = new CatmullRomCurve3([from.clone().add(new Vector3(0.7, 0, 0)), mid, to]);
      return { curve, geometry: new TubeGeometry(curve, 32, 0.022, 8, false) };
    });
  }, []);

  useModelFrame((_, time) => {
    if (root.current) root.current.rotation.y = -0.4 + Math.sin(time * 0.3) * 0.25;
    packets.current.forEach((packet, index) => {
      if (!packet) return;
      const u = (time * 0.35 + index * 0.17) % 1;
      packet.position.copy(cables[index].curve.getPoint(u));
    });
  });

  return (
    <group ref={root} rotation={[0.25, -0.4, 0]} position={[-0.2, 0, 0]}>
      {SERVERS.map((position, index) => (
        <group key={index} position={position}>
          <RoundedBox args={[1.4, 0.36, 0.95]} radius={0.06} smoothness={3}>
            <meshStandardMaterial color={palette.card} roughness={0.5} />
          </RoundedBox>
          {[0, 1, 2].map((led) => (
            <mesh key={led} position={[-0.5 + led * 0.14, 0, 0.48]}>
              <sphereGeometry args={[0.035, 10, 10]} />
              <meshStandardMaterial
                color={led === 0 ? palette.ok : palette.accent}
                emissive={led === 0 ? palette.ok : palette.accent}
                emissiveIntensity={0.6}
              />
            </mesh>
          ))}
        </group>
      ))}
      <RoundedBox args={[0.8, 0.8, 0.8]} radius={0.16} smoothness={4} position={HUB}>
        <meshStandardMaterial color={palette.accent} roughness={0.3} />
      </RoundedBox>
      {NODES.map((position, index) => (
        <mesh key={index} position={position}>
          <sphereGeometry args={[0.2, 24, 24]} />
          <meshStandardMaterial
            color={[palette.web, palette.mob, palette.mkt][index]}
            roughness={0.4}
          />
        </mesh>
      ))}
      {cables.map((cable, index) => (
        <group key={index}>
          <mesh geometry={cable.geometry}>
            <meshStandardMaterial color={palette.line} roughness={0.6} />
          </mesh>
          <mesh ref={(mesh) => void (packets.current[index] = mesh)}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial
              color={palette.amber}
              emissive={palette.amber}
              emissiveIntensity={0.5}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}
