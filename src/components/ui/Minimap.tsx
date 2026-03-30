import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

const SCALE = 3;
const MAP_W = 150;
const MAP_H = 200;
const OFFSET_X = 30;

const rooms = [
  { x: 0, z: 0, w: 20, d: 15, label: 'Entrance' },
  { x: 0, z: 18.5, w: 20, d: 7, label: '' },
  { x: -20, z: 22.5, w: 16, d: 12, label: 'About' },
  { x: 0, z: 37, w: 20, d: 15, label: 'Projects' },
  { x: 20, z: 22.5, w: 16, d: 12, label: 'Career' },
  { x: 0, z: 55, w: 16, d: 12, label: 'Contact' },
];

const dirVec = new THREE.Vector3();

export default function Minimap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { camera } = useThree();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = MAP_W;
    canvas.height = MAP_H;
  }, []);

  useFrame(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, MAP_W, MAP_H);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, MAP_W, MAP_H);

    rooms.forEach((room) => {
      const rx = (room.x - room.w / 2 + OFFSET_X) * SCALE;
      const ry = (room.z - room.d / 2) * SCALE;
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

    // Player dot
    const px = (camera.position.x + OFFSET_X) * SCALE;
    const py = camera.position.z * SCALE;

    ctx.fillStyle = '#ff4444';
    ctx.beginPath();
    ctx.arc(px, py, 3, 0, Math.PI * 2);
    ctx.fill();

    // Direction line
    camera.getWorldDirection(dirVec);
    ctx.strokeStyle = '#ff4444';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(px + dirVec.x * 8, py + dirVec.z * 8);
    ctx.stroke();
  });

  return (
    <Html
      fullscreen
      zIndexRange={[15, 15]}
      style={{ pointerEvents: 'none' }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 16,
          right: 16,
          width: MAP_W,
          height: MAP_H,
          borderRadius: 8,
          border: '1px solid rgba(255,255,255,0.15)',
        }}
      />
    </Html>
  );
}
