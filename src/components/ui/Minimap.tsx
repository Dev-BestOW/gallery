import { useRef, useEffect, useCallback } from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';
import { cameraRef } from '../../utils/cameraRef';

const SCALE = 2.5;
const MAP_W = 140;
const MAP_H = 130;
const OFFSET_X = 28;
const OFFSET_Z = 8;

const rooms = [
  { x: 0, z: 0, w: 20, d: 15, label: 'Entrance' },
  { x: 0, z: 11, w: 20, d: 7, label: '' },
  { x: -18, z: 11, w: 16, d: 12, label: 'About' },
  { x: 0, z: 22, w: 20, d: 15, label: 'Projects' },
  { x: 18, z: 11, w: 16, d: 12, label: 'Career' },
  { x: 0, z: 35.5, w: 16, d: 12, label: 'Contact' },
];

// 정적 배경(방 레이아웃)을 오프스크린 캔버스에 한 번만 렌더
function createBackgroundCanvas(): HTMLCanvasElement {
  const offscreen = document.createElement('canvas');
  offscreen.width = MAP_W;
  offscreen.height = MAP_H;
  const ctx = offscreen.getContext('2d')!;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(0, 0, MAP_W, MAP_H);

  rooms.forEach((room) => {
    const rx = (room.x - room.w / 2 + OFFSET_X) * SCALE;
    const ry = (room.z - room.d / 2 + OFFSET_Z) * SCALE;
    const rw = room.w * SCALE;
    const rh = room.d * SCALE;

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(rx, ry, rw, rh);

    if (room.label) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.font = '8px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(room.label, rx + rw / 2, ry + rh / 2 + 3);
    }
  });

  return offscreen;
}

export default function Minimap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number>(0);
  const isMobile = useIsMobile();
  const displayScale = isMobile ? 1 : 1.5;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = MAP_W;
    canvas.height = MAP_H;
    bgRef.current = createBackgroundCanvas();
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !bgRef.current) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 캐싱된 배경 복사
    ctx.clearRect(0, 0, MAP_W, MAP_H);
    ctx.drawImage(bgRef.current, 0, 0);

    // Player dot
    const px = (cameraRef.pos.x + OFFSET_X) * SCALE;
    const py = (cameraRef.pos.z + OFFSET_Z) * SCALE;

    ctx.fillStyle = '#ff4444';
    ctx.beginPath();
    ctx.arc(px, py, 3, 0, Math.PI * 2);
    ctx.fill();

    // Direction line
    ctx.strokeStyle = '#ff4444';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(px + cameraRef.dir.x * 8, py + cameraRef.dir.z * 8);
    ctx.stroke();

    rafRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 16,
        right: 16,
        width: MAP_W * displayScale,
        height: MAP_H * displayScale,
        borderRadius: 8,
        border: '1px solid rgba(255,255,255,0.15)',
        pointerEvents: 'none',
        zIndex: 15,
      }}
    />
  );
}
