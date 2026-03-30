import { create } from 'zustand';
import type { Artwork } from '../data/portfolio';

// 딥링크: 스토어 생성 전에 URL 해시에서 초기 스폰 위치 결정
const sectionSpawns: Record<string, [number, number, number]> = {
  entrance: [0, 1.7, 0],
  about: [-18, 1.7, 11],
  projects: [0, 1.7, 22],
  career: [18, 1.7, 11],
  contact: [0, 1.7, 35.5],
};
const initialHash = typeof window !== 'undefined' ? window.location.hash.replace('#', '') : '';
const initialSpawn = sectionSpawns[initialHash] || null;
const initialWing = initialSpawn ? initialHash : null;

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

  // 딥링크 스폰 위치
  spawnPosition: [number, number, number] | null;
  setSpawnPosition: (pos: [number, number, number] | null) => void;

  // 갤러리 입장 여부
  hasEntered: boolean;
  setHasEntered: (entered: boolean) => void;

  isLocked: boolean;
  setIsLocked: (locked: boolean) => void;

  isPointerLocked: boolean;
  setIsPointerLocked: (locked: boolean) => void;

  // 카메라 트래킹 (미니맵용)
  cameraPos: [number, number, number];
  cameraDir: [number, number, number];
  setCameraPosDir: (pos: [number, number, number], dir: [number, number, number]) => void;
}

export const useGalleryStore = create<GalleryState>((set) => ({
  currentWing: initialWing,
  setCurrentWing: (wing) => set({ currentWing: wing }),

  nearbyArtwork: null,
  setNearbyArtwork: (artwork) => set({ nearbyArtwork: artwork }),

  viewingArtwork: null,
  setViewingArtwork: (artwork) => set({ viewingArtwork: artwork }),

  cameraTarget: null,
  setCameraTarget: (target) => set({ cameraTarget: target }),
  isFocusing: false,
  setIsFocusing: (focusing) => set({ isFocusing: focusing }),

  spawnPosition: initialSpawn,
  setSpawnPosition: (pos) => set({ spawnPosition: pos }),

  hasEntered: false,
  setHasEntered: (entered) => set({ hasEntered: entered }),

  isLocked: false,
  setIsLocked: (locked) => set({ isLocked: locked }),

  isPointerLocked: false,
  setIsPointerLocked: (locked) => set({ isPointerLocked: locked }),

  cameraPos: [0, 1.7, 0],
  cameraDir: [0, 0, -1],
  setCameraPosDir: (pos, dir) => set({ cameraPos: pos, cameraDir: dir }),
}));
