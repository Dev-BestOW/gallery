import { useRef } from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
import { COLORS, ARTWORK } from '../../constants/gallery';
import type { Artwork } from '../../data/portfolio';

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
  const [w, h] = size;
  const pad = ARTWORK.framePadding;
  const depth = ARTWORK.frameDepth;

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* Frame border - 4 sides */}
      {/* Top */}
      <mesh position={[0, h / 2 + pad / 2, depth / 2]} castShadow>
        <boxGeometry args={[w + pad * 2, pad, depth]} />
        <meshStandardMaterial color={COLORS.frame} roughness={0.4} />
      </mesh>
      {/* Bottom */}
      <mesh position={[0, -h / 2 - pad / 2, depth / 2]} castShadow>
        <boxGeometry args={[w + pad * 2, pad, depth]} />
        <meshStandardMaterial color={COLORS.frame} roughness={0.4} />
      </mesh>
      {/* Left */}
      <mesh position={[-w / 2 - pad / 2, 0, depth / 2]} castShadow>
        <boxGeometry args={[pad, h + pad * 2, depth]} />
        <meshStandardMaterial color={COLORS.frame} roughness={0.4} />
      </mesh>
      {/* Right */}
      <mesh position={[w / 2 + pad / 2, 0, depth / 2]} castShadow>
        <boxGeometry args={[pad, h + pad * 2, depth]} />
        <meshStandardMaterial color={COLORS.frame} roughness={0.4} />
      </mesh>

      {/* Canvas (artwork surface) */}
      <mesh
        position={[0, 0, depth / 2 + 0.001]}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onClick={onClick}
      >
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial
          color={artwork.image ? undefined : '#e8e0d4'}
          roughness={0.9}
        />
      </mesh>

      {/* Info plate below frame */}
      <group position={[0, -h / 2 - pad - 0.25, 0.01]}>
        {/* Plate background */}
        <mesh>
          <planeGeometry args={[w * 0.8, 0.18]} />
          <meshStandardMaterial color="#f0ebe3" roughness={0.8} />
        </mesh>
        {/* Title */}
        <Text
          position={[0, 0.02, 0.001]}
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
            position={[0, -0.04, 0.001]}
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
