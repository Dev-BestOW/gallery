import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGalleryStore } from '../stores/useGalleryStore';

// 각 Wing의 바운딩 박스 (X min/max, Z min/max)
const wingBounds: { id: string; xMin: number; xMax: number; zMin: number; zMax: number }[] = [
  { id: 'entrance', xMin: -10, xMax: 10, zMin: -7.5, zMax: 7.5 },
  { id: 'about', xMin: -26, xMax: -10, zMin: 5, zMax: 17 },
  { id: 'projects', xMin: -10, xMax: 10, zMin: 14.5, zMax: 29.5 },
  { id: 'career', xMin: 10, xMax: 26, zMin: 5, zMax: 17 },
  { id: 'contact', xMin: -8, xMax: 8, zMin: 29.5, zMax: 41.5 },
];

export function useWingDetector() {
  const { camera } = useThree();
  const lastWing = useRef<string | null>(null);
  const setCurrentWing = useGalleryStore((s) => s.setCurrentWing);
  const frameCount = useRef(0);

  useFrame(() => {
    // 매 15프레임마다 체크 (약 4Hz)
    frameCount.current++;
    if (frameCount.current % 15 !== 0) return;

    const x = camera.position.x;
    const z = camera.position.z;

    let detected: string | null = null;
    for (const b of wingBounds) {
      if (x >= b.xMin && x <= b.xMax && z >= b.zMin && z <= b.zMax) {
        detected = b.id;
        break;
      }
    }

    if (detected && detected !== lastWing.current) {
      lastWing.current = detected;
      setCurrentWing(detected);
    }
  });
}
