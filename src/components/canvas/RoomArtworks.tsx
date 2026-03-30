import { useMemo } from 'react';
import * as THREE from 'three';
import ArtFrame from './ArtFrame';
import { useRegisterArtwork } from '../../hooks/useProximity';
import { useGalleryStore } from '../../stores/useGalleryStore';
import { ARTWORK } from '../../constants/gallery';
import type { Artwork } from '../../data/portfolio';

interface ArtworkPlacement {
  artwork: Artwork;
  position: [number, number, number];
  rotation?: [number, number, number];
  size?: [number, number];
}

function PlacedArtwork({ artwork, position, rotation = [0, 0, 0], size }: ArtworkPlacement) {
  const worldPos = useMemo(() => new THREE.Vector3(...position), [position]);
  const setViewingArtwork = useGalleryStore((s) => s.setViewingArtwork);
  const setIsLocked = useGalleryStore((s) => s.setIsLocked);
  const setCameraTarget = useGalleryStore((s) => s.setCameraTarget);
  const setIsFocusing = useGalleryStore((s) => s.setIsFocusing);

  useRegisterArtwork(artwork, worldPos);

  const handleClick = () => {
    // 작품의 법선 방향 계산 (rotation에서 추출)
    const normal = new THREE.Vector3(0, 0, 1);
    const euler = new THREE.Euler(...rotation);
    normal.applyEuler(euler);

    // 카메라 목표 위치: 작품 앞 focusDistance 만큼 떨어진 지점
    const cameraPos: [number, number, number] = [
      position[0] + normal.x * ARTWORK.focusDistance,
      position[1],
      position[2] + normal.z * ARTWORK.focusDistance,
    ];

    // 카메라가 바라볼 지점: 작품 위치
    const lookAt: [number, number, number] = [position[0], position[1], position[2]];

    setIsLocked(true);
    setViewingArtwork(artwork);
    setCameraTarget({ position: cameraPos, lookAt });
    setIsFocusing(true);
  };

  return (
    <ArtFrame
      artwork={artwork}
      position={position}
      rotation={rotation}
      size={size}
      onClick={handleClick}
    />
  );
}

interface RoomArtworksProps {
  placements: ArtworkPlacement[];
}

export default function RoomArtworks({ placements }: RoomArtworksProps) {
  return (
    <group>
      {placements.map((p) => (
        <PlacedArtwork key={p.artwork.id} {...p} />
      ))}
    </group>
  );
}

// 벽면에 작품을 균등 배치하는 유틸리티
export function distributeOnWall(
  artworks: Artwork[],
  wallStart: [number, number, number],
  wallEnd: [number, number, number],
  wallNormalRotation: [number, number, number],
  artworkY: number = 2.2,
  artworkSize: [number, number] = [2, 1.5],
): ArtworkPlacement[] {
  const count = artworks.length;
  if (count === 0) return [];

  const placements: ArtworkPlacement[] = [];

  for (let i = 0; i < count; i++) {
    const t = count === 1 ? 0.5 : i / (count - 1);
    const x = wallStart[0] + (wallEnd[0] - wallStart[0]) * t;
    const z = wallStart[2] + (wallEnd[2] - wallStart[2]) * t;

    placements.push({
      artwork: artworks[i],
      position: [x, artworkY, z],
      rotation: wallNormalRotation,
      size: artworkSize,
    });
  }

  return placements;
}
