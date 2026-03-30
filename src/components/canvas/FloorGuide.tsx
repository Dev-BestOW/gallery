import { useMemo } from 'react';
import * as THREE from 'three';

interface FloorGuideProps {
  from: [number, number, number];
  to: [number, number, number];
  color?: string;
  dashed?: boolean;
}

export default function FloorGuide({
  from,
  to,
  color = '#555555',
  dashed = true,
}: FloorGuideProps) {
  const points = useMemo(() => {
    return [new THREE.Vector3(...from), new THREE.Vector3(...to)];
  }, [from, to]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    if (dashed) geo.computeBoundingSphere();
    return geo;
  }, [points, dashed]);

  return (
    <line>
      <primitive object={geometry} attach="geometry" />
      {dashed ? (
        <lineDashedMaterial
          color={color}
          dashSize={0.3}
          gapSize={0.2}
          opacity={0.4}
          transparent
        />
      ) : (
        <lineBasicMaterial color={color} opacity={0.4} transparent />
      )}
    </line>
  );
}

// 화살표 마커
interface FloorArrowProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
  label?: string;
}

export function FloorArrow({
  position,
  rotation = [0, 0, 0],
  color = '#666666',
}: FloorArrowProps) {
  return (
    <group position={position} rotation={rotation}>
      {/* Arrow shape on floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.3, 0.6, 3]} />
        <meshStandardMaterial
          color={color}
          opacity={0.5}
          transparent
          emissive={color}
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  );
}
