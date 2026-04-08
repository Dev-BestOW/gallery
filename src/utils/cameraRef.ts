// 매 프레임 업데이트되는 카메라 상태 — Zustand 대신 직접 뮤테이션으로 GC/리렌더 회피
export const cameraRef = {
  pos: { x: 0, y: 1.7, z: 0 },
  dir: { x: 0, y: 0, z: -1 },
};
