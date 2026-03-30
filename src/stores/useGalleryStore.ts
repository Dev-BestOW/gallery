import { create } from 'zustand';
import type { Artwork } from '../data/portfolio';

interface GalleryState {
  // 현재 위치한 섹션
  currentWing: string | null;
  setCurrentWing: (wing: string | null) => void;

  // 근접한 작품
  nearbyArtwork: Artwork | null;
  setNearbyArtwork: (artwork: Artwork | null) => void;

  // 감상 중인 작품 (상세 패널)
  viewingArtwork: Artwork | null;
  setViewingArtwork: (artwork: Artwork | null) => void;

  // 플레이어 이동 잠금 (감상 모드)
  isLocked: boolean;
  setIsLocked: (locked: boolean) => void;

  // 포인터 락 상태
  isPointerLocked: boolean;
  setIsPointerLocked: (locked: boolean) => void;
}

export const useGalleryStore = create<GalleryState>((set) => ({
  currentWing: null,
  setCurrentWing: (wing) => set({ currentWing: wing }),

  nearbyArtwork: null,
  setNearbyArtwork: (artwork) => set({ nearbyArtwork: artwork }),

  viewingArtwork: null,
  setViewingArtwork: (artwork) => set({ viewingArtwork: artwork }),

  isLocked: false,
  setIsLocked: (locked) => set({ isLocked: locked }),

  isPointerLocked: false,
  setIsPointerLocked: (locked) => set({ isPointerLocked: locked }),
}));
