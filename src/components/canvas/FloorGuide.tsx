import { useMemo } from 'react';
import * as THREE from 'three';

interface FloorGuideProps {
  from: [number, number, number];
  to: [number, number, number];
  color?: string;
}

export default function FloorGuide({
  from,
  to,
  color = '#555555',
}: FloorGuideProps) {
  const { position, length, rotationY, stripWidth } = useMemo(() => {
    const dx = to[0] - from[0];
    const dz = to[2] - from[2];
    const len = Math.sqrt(dx * dx + dz * dz);
    const angle = Math.atan2(dx, dz);
    return {
      position: [
        (from[0] + to[0]) / 2,
        0.002, // flush with floor
        (from[2] + to[2]) / 2,
      ] as [number, number, number],
      length: len,
      rotationY: -angle,
      stripWidth: 0.015,
    };
  }, [from, to]);

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Main LED strip */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[stripWidth, length]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
          transparent
          opacity={0.7}
        />
      </mesh>
      {/* Outer glow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.0001, 0]}>
        <planeGeometry args={[stripWidth * 6, length]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.15}
          transparent
          opacity={0.25}
        />
      </mesh>
    </group>
  );
}

// 방향 표시 — 바닥 매립 삼각형 (은은한 발광)
interface FloorArrowProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
}

export function FloorArrow({
  position,
  rotation = [0, 0, 0],
  color = '#666666',
}: FloorArrowProps) {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    // Flat chevron arrow pointing +Z
    s.moveTo(0, 0.2);
    s.lineTo(0.15, 0);
    s.lineTo(0.05, 0);
    s.lineTo(0.05, -0.15);
    s.lineTo(-0.05, -0.15);
    s.lineTo(-0.05, 0);
    s.lineTo(-0.15, 0);
    s.closePath();
    return s;
  }, []);

  return (
    <group position={position} rotation={rotation}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <shapeGeometry args={[shape]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          transparent
          opacity={0.5}
        />
      </mesh>
    </group>
  );
}
