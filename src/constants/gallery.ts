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
  ceiling: '#faf8f5',
  frame: '#3d2b1f',
  // Wainscoting (lower wall panel)
  wainscot: '#e8e2d8',
  wainscotTrim: '#d8d0c4',
  // Architectural accents
  column: '#f0ece6',
  columnBase: '#e0d8cc',
  floorBorder: '#a09080',
  // Per-wing wall accent colors (upper wall above wainscoting)
  wingColors: {
    grand: '#8b1a1a',   // deep crimson (Louvre style)
    warm: '#6b4c3b',    // warm brown
    cool: '#3a4a5c',    // deep navy blue
    dark: '#4a3a5c',    // royal purple
    cozy: '#5c4a3a',    // warm espresso
  },
} as const;
