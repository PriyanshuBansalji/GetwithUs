"use client";

import { RoundedBox, useTexture } from "@react-three/drei";
import { Suspense, useRef } from "react";
import { SRGBColorSpace, type Group } from "three";
import { useModelFrame, useModelPalette } from "@/components/three/models/context";

function Screen({ image, width, height }: { image: string; width: number; height: number }) {
  const texture = useTexture(image, (loaded) => {
    loaded.colorSpace = SRGBColorSpace;
  });
  return (
    <mesh position={[0, 0, 0.06]}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

/**
 * /work/[slug]: the project's own screenshot on a 3D device frame, a browser
 * or a phone by the project's service. Without an image the screen stays in
 * the card colour.
 */
export default function DeviceFrame({
  image,
  kind = "browser",
}: {
  image?: string;
  kind?: "browser" | "phone";
}) {
  const palette = useModelPalette();
  const root = useRef<Group>(null);
  const phone = kind === "phone";
  const [width, height] = phone ? [1.36, 2.88] : [3.3, 2.0];

  useModelFrame((_, time) => {
    if (root.current) root.current.rotation.y = -0.35 + Math.sin(time * 0.35) * 0.2;
  });

  return (
    <group ref={root} rotation={[0.1, -0.35, 0]}>
      <RoundedBox
        args={phone ? [1.55, 3.1, 0.12] : [3.5, 2.45, 0.1]}
        radius={phone ? 0.2 : 0.08}
        smoothness={4}
      >
        <meshStandardMaterial color={phone ? palette.ink : palette.card} roughness={0.4} />
      </RoundedBox>
      {phone ? null : (
        <mesh position={[0, 1.08, 0.055]}>
          <planeGeometry args={[3.5, 0.26]} />
          <meshStandardMaterial color={palette.line} />
        </mesh>
      )}
      <group position={[0, phone ? 0 : -0.12, 0]}>
        {image ? (
          <Suspense fallback={null}>
            <Screen image={image} width={width} height={height} />
          </Suspense>
        ) : (
          <mesh position={[0, 0, 0.06]}>
            <planeGeometry args={[width, height]} />
            <meshBasicMaterial color={palette.card} toneMapped={false} />
          </mesh>
        )}
      </group>
    </group>
  );
}
