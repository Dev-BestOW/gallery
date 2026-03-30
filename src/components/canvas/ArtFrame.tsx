import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { Text, SpotLight, useTexture } from '@react-three/drei';
import { COLORS, ARTWORK } from '../../constants/gallery';
import type { Artwork } from '../../data/portfolio';

import woodColor from '../../assets/textures/wood/color.jpg';
import woodNormal from '../../assets/textures/wood/normal.jpg';
import woodRoughness from '../../assets/textures/wood/roughness.jpg';

interface ArtFrameProps {
  artwork: Artwork;
  position: [number, number, number];
  rotation?: [number, number, number];
  size?: [number, number]; // width, height
  onPointerEnter?: () => void;
  onPointerLeave?: () => void;
  onClick?: () => void;
}

export default function ArtFrame({
  artwork,
  position,
  rotation = [0, 0, 0],
  size = [ARTWORK.defaultSize.x, ARTWORK.defaultSize.y],
  onPointerEnter,
  onPointerLeave,
  onClick,
}: ArtFrameProps) {
  const groupRef = useRef<THREE.Group>(null);
  const woodTex = useTexture({
    map: woodColor,
    normalMap: woodNormal,
    roughnessMap: woodRoughness,
  });
  useMemo(() => {
    Object.values(woodTex).forEach((t) => {
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(1, 1);
    });
  }, [woodTex]);

  const [w, h] = size;
  const outerPad = ARTWORK.framePadding; // 0.08
  const innerPad = 0.04; // inner frame step
  const matWidth = 0.04; // white mat border
  const depth = ARTWORK.frameDepth; // 0.05
  const innerDepth = depth * 0.6;

  // SpotLight target position (center of artwork in local space, projected forward)
  const spotTarget = useMemo(() => {
    const target = new THREE.Object3D();
    target.position.set(0, 0, depth / 2 + 0.01);
    return target;
  }, [depth]);

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* === SpotLight illuminating the artwork === */}
      <primitive object={spotTarget} />
      <SpotLight
        position={[0, 1.8, 0.8]}
        target={spotTarget}
        angle={0.5}
        penumbra={0.6}
        intensity={1.5}
        distance={5}
        decay={2}
        color="#fff8f0"
      />

      {/* === Outer Frame (4 sides) === */}
      {/* Top */}
      <mesh position={[0, h / 2 + outerPad / 2, depth / 2]} castShadow>
        <boxGeometry args={[w + outerPad * 2, outerPad, depth]} />
        <meshStandardMaterial {...woodTex} color={COLORS.frame} roughness={0.5} />
      </mesh>
      {/* Bottom */}
      <mesh position={[0, -h / 2 - outerPad / 2, depth / 2]} castShadow>
        <boxGeometry args={[w + outerPad * 2, outerPad, depth]} />
        <meshStandardMaterial {...woodTex} color={COLORS.frame} roughness={0.5} />
      </mesh>
      {/* Left */}
      <mesh position={[-w / 2 - outerPad / 2, 0, depth / 2]} castShadow>
        <boxGeometry args={[outerPad, h + outerPad * 2, depth]} />
        <meshStandardMaterial {...woodTex} color={COLORS.frame} roughness={0.5} />
      </mesh>
      {/* Right */}
      <mesh position={[w / 2 + outerPad / 2, 0, depth / 2]} castShadow>
        <boxGeometry args={[outerPad, h + outerPad * 2, depth]} />
        <meshStandardMaterial {...woodTex} color={COLORS.frame} roughness={0.5} />
      </mesh>

      {/* === Inner Frame Step (recessed, slightly lighter) === */}
      {/* Top */}
      <mesh position={[0, h / 2 - innerPad / 2, depth / 2 - innerDepth / 2]}>
        <boxGeometry args={[w, innerPad, innerDepth]} />
        <meshStandardMaterial color="#4a3828" roughness={0.5} />
      </mesh>
      {/* Bottom */}
      <mesh position={[0, -h / 2 + innerPad / 2, depth / 2 - innerDepth / 2]}>
        <boxGeometry args={[w, innerPad, innerDepth]} />
        <meshStandardMaterial color="#4a3828" roughness={0.5} />
      </mesh>
      {/* Left */}
      <mesh position={[-w / 2 + innerPad / 2, 0, depth / 2 - innerDepth / 2]}>
        <boxGeometry args={[innerPad, h, innerDepth]} />
        <meshStandardMaterial color="#4a3828" roughness={0.5} />
      </mesh>
      {/* Right */}
      <mesh position={[w / 2 - innerPad / 2, 0, depth / 2 - innerDepth / 2]}>
        <boxGeometry args={[innerPad, h, innerDepth]} />
        <meshStandardMaterial color="#4a3828" roughness={0.5} />
      </mesh>

      {/* === Mat (white border around artwork) === */}
      {/* Top */}
      <mesh position={[0, h / 2 - innerPad - matWidth / 2, depth / 2 + 0.0005]}>
        <planeGeometry args={[w - innerPad * 2, matWidth]} />
        <meshStandardMaterial color="#fafafa" roughness={0.9} />
      </mesh>
      {/* Bottom */}
      <mesh position={[0, -h / 2 + innerPad + matWidth / 2, depth / 2 + 0.0005]}>
        <planeGeometry args={[w - innerPad * 2, matWidth]} />
        <meshStandardMaterial color="#fafafa" roughness={0.9} />
      </mesh>
      {/* Left */}
      <mesh position={[-w / 2 + innerPad + matWidth / 2, 0, depth / 2 + 0.0005]}>
        <planeGeometry args={[matWidth, h - innerPad * 2]} />
        <meshStandardMaterial color="#fafafa" roughness={0.9} />
      </mesh>
      {/* Right */}
      <mesh position={[w / 2 - innerPad - matWidth / 2, 0, depth / 2 + 0.0005]}>
        <planeGeometry args={[matWidth, h - innerPad * 2]} />
        <meshStandardMaterial color="#fafafa" roughness={0.9} />
      </mesh>

      {/* === Canvas (artwork surface) === */}
      <mesh
        position={[0, 0, depth / 2 + 0.001]}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onClick={onClick}
      >
        <planeGeometry args={[w - innerPad * 2 - matWidth * 2, h - innerPad * 2 - matWidth * 2]} />
        <meshStandardMaterial
          color={artwork.image ? undefined : '#e8e0d4'}
          roughness={0.9}
        />
      </mesh>

      {/* === Glass layer (subtle reflection) === */}
      <mesh position={[0, 0, depth / 2 + 0.003]}>
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial
          transparent
          opacity={0.08}
          roughness={0.05}
          metalness={0.1}
          color="#ffffff"
        />
      </mesh>

      {/* === Info plate below frame === */}
      <group position={[0, -h / 2 - outerPad - 0.25, 0.01]}>
        {/* Plate background with subtle depth */}
        <mesh position={[0, 0, 0.003]}>
          <boxGeometry args={[w * 0.8, 0.18, 0.006]} />
          <meshStandardMaterial
            color="#f0ebe3"
            roughness={0.8}
            emissive="#f0ebe3"
            emissiveIntensity={0.05}
          />
        </mesh>
        {/* Title */}
        <Text
          position={[0, 0.02, 0.007]}
          fontSize={0.06}
          color="#2a2a2a"
          anchorX="center"
          anchorY="middle"
          maxWidth={w * 0.7}
        >
          {artwork.title}
        </Text>
        {/* Period */}
        {artwork.period && (
          <Text
            position={[0, -0.04, 0.007]}
            fontSize={0.04}
            color="#777"
            anchorX="center"
            anchorY="middle"
            maxWidth={w * 0.7}
          >
            {artwork.period}
          </Text>
        )}
      </group>
    </group>
  );
}
