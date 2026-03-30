import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { ARTWORK } from '../constants/gallery';
import { useGalleryStore } from '../stores/useGalleryStore';
import type { Artwork } from '../data/portfolio';

interface ArtworkPosition {
  artwork: Artwork;
  position: THREE.Vector3;
}

const registeredArtworks: ArtworkPosition[] = [];

export function registerArtwork(artwork: Artwork, position: THREE.Vector3) {
  const existing = registeredArtworks.find((a) => a.artwork.id === artwork.id);
  if (existing) {
    existing.position.copy(position);
  } else {
    registeredArtworks.push({ artwork, position: position.clone() });
  }
}

export function unregisterArtwork(id: string) {
  const idx = registeredArtworks.findIndex((a) => a.artwork.id === id);
  if (idx !== -1) registeredArtworks.splice(idx, 1);
}

export function useProximityDetector() {
  const { camera } = useThree();
  const setNearbyArtwork = useGalleryStore((s) => s.setNearbyArtwork);
  const viewingArtwork = useGalleryStore((s) => s.viewingArtwork);
  const lastNearbyId = useRef<string | null>(null);

  useFrame(() => {
    if (viewingArtwork) return;

    let closest: ArtworkPosition | null = null;
    let closestDist = ARTWORK.proximity;

    for (const ap of registeredArtworks) {
      const dist = camera.position.distanceTo(ap.position);
      if (dist < closestDist) {
        closestDist = dist;
        closest = ap;
      }
    }

    const newId = closest?.artwork.id ?? null;
    if (newId !== lastNearbyId.current) {
      lastNearbyId.current = newId;
      setNearbyArtwork(closest?.artwork ?? null);
    }
  });
}

export function useRegisterArtwork(artwork: Artwork, worldPosition: THREE.Vector3) {
  useEffect(() => {
    registerArtwork(artwork, worldPosition);
    return () => unregisterArtwork(artwork.id);
  }, [artwork, worldPosition]);
}
