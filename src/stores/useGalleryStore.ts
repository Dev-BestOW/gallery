import { create } from 'zustand';
import type { Artwork } from '../data/portfolio';

interface CameraTarget {
  position: [number, number, number];
  lookAt: [number, number, number];
}

interface GalleryState {
  currentWing: string | null;
  setCurrentWing: (wing: string | null) => void;

  nearbyArtwork: Artwork | null;
  setNearbyArtwork: (artwork: Artwork | null) => void;

  viewingArtwork: Artwork | null;
  setViewingArtwork: (artwork: Artwork | null) => void;

  // 카메라 포커스 애니메이션
  cameraTarget: CameraTarget | null;
  setCameraTarget: (target: CameraTarget | null) => void;
  isFocusing: boolean;
  setIsFocusing: (focusing: boolean) => void;

  isLocked: boolean;
  setIsLocked: (locked: boolean) => void;

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

  cameraTarget: null,
  setCameraTarget: (target) => set({ cameraTarget: target }),
  isFocusing: false,
  setIsFocusing: (focusing) => set({ isFocusing: focusing }),

  isLocked: false,
  setIsLocked: (locked) => set({ isLocked: locked }),

  isPointerLocked: false,
  setIsPointerLocked: (locked) => set({ isPointerLocked: locked }),
}));
