import * as THREE from 'three';
import type { Artwork } from '../data/portfolio';

export interface ArtworkPosition {
  artwork: Artwork;
  position: THREE.Vector3;
}

// 등록된 작품 목록 — useProximity에서 거리 기반 감지에 사용
export const registeredArtworks: ArtworkPosition[] = [];

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
