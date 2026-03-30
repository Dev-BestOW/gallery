import * as THREE from 'three';

// 1 unit = 1 meter
export const ROOM = {
  width: 20,
  height: 5,
  depth: 15,
  wallThickness: 0.3,
} as const;

export const DOORWAY = {
  width: 3,
  height: 3.5,
} as const;

export const PLAYER = {
  height: 1.7,
  radius: 0.4,
  speed: 4,
  sprintSpeed: 7,
} as const;

export const ARTWORK = {
  proximity: 3,       // 작품 감지 거리 (m)
  focusDistance: 2,    // 감상 시 카메라 거리 (m)
  frameDepth: 0.05,
  framePadding: 0.08,
  defaultSize: new THREE.Vector2(2, 1.5),  // 기본 액자 크기
  plateHeight: 0.2,
} as const;

export const COLORS = {
  wall: '#f5f0eb',
  floor: '#2a2a2a',
  ceiling: '#ffffff',
  frame: '#3d2b1f',
} as const;
