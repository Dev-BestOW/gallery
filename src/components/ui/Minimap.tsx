import { useRef, useEffect, useCallback } from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useGalleryStore } from '../../stores/useGalleryStore';
import { cameraRef } from '../../utils/cameraRef';

const SCALE = 2.5;
const MAP_W = 140;
const MAP_H = 130;
const OFFSET_X = 28;
const OFFSET_Z = 8;

const rooms = [
  { id: 'entrance', x: 0, z: 0, w: 20, d: 15, label: 'Entrance' },
  { id: 'corridor', x: 0, z: 11, w: 20, d: 7, label: '' },
  { id: 'about', x: -18, z: 11, w: 16, d: 12, label: 'About' },
  { id: 'projects', x: 0, z: 22, w: 20, d: 15, label: 'Projects' },
  { id: 'career', x: 18, z: 11, w: 16, d: 12, label: 'Career' },
  { id: 'contact', x: 0, z: 35.5, w: 16, d: 12, label: 'Contact' },
];

export default function Minimap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const isMobile = useIsMobile();
  const displayScale = isMobile ? 1 : 1.5;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = MAP_W;
    canvas.height = MAP_H;
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const currentWing = useGalleryStore.getState().currentWing;

    // Background
    ctx.clearRect(0, 0, MAP_W, MAP_H);
    ctx.fillStyle = 'rgba(10, 10, 10, 0.65)';
    ctx.fillRect(0, 0, MAP_W, MAP_H);

    // Draw rooms
    rooms.forEach((room) => {
      const rx = (room.x - room.w / 2 + OFFSET_X) * SCALE;
      const ry = (room.z - room.d / 2 + OFFSET_Z) * SCALE;
      const rw = room.w * SCALE;
      const rh = room.d * SCALE;

      const isActive = room.id === currentWing;

      // Room fill (highlight current wing)
      if (isActive) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.fillRect(rx, ry, rw, rh);
      }

      // Room border
      ctx.strokeStyle = isActive ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.18)';
      ctx.lineWidth = isActive ? 1.5 : 0.8;
      ctx.strokeRect(rx, ry, rw, rh);

      // Room label
      if (room.label) {
        ctx.fillStyle = isActive ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.25)';
        ctx.font = isActive ? 'bold 9px sans-serif' : '8px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(room.label, rx + rw / 2, ry + rh / 2 + 3);
      }
    });

    // Player dot with glow
    const px = (cameraRef.pos.x + OFFSET_X) * SCALE;
    const py = (cameraRef.pos.z + OFFSET_Z) * SCALE;

    // Outer glow
    const gradient = ctx.createRadialGradient(px, py, 0, px, py, 8);
    gradient.addColorStop(0, 'rgba(255, 100, 100, 0.3)');
    gradient.addColorStop(1, 'rgba(255, 100, 100, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(px, py, 8, 0, Math.PI * 2);
    ctx.fill();

    // Player dot
    ctx.fillStyle = '#ff5555';
    ctx.beginPath();
    ctx.arc(px, py, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Direction line
    ctx.strokeStyle = 'rgba(255, 100, 100, 0.7)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(px + cameraRef.dir.x * 10, py + cameraRef.dir.z * 10);
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
        borderRadius: 10,
        border: '1px solid rgba(255,255,255,0.1)',
        pointerEvents: 'none',
        zIndex: 15,
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      }}
    />
  );
}
