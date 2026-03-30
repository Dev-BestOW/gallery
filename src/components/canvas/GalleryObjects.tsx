import * as THREE from 'three';
import { useMemo } from 'react';
import { RigidBody } from '@react-three/rapier';

/* ── Pedestal with abstract sculpture ── */
function Pedestal({
  position,
  sculptureType = 'sphere',
  sculptureColor = '#c8b8a8',
}: {
  position: [number, number, number];
  sculptureType?: 'sphere' | 'torus' | 'knot' | 'ring' | 'diamond';
  sculptureColor?: string;
}) {
  const baseH = 1.0;
  const baseW = 0.5;

  return (
    <RigidBody type="fixed" colliders="cuboid">
      <group position={position}>
        {/* Base pedestal */}
        <mesh position={[0, baseH / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[baseW, baseH, baseW]} />
          <meshStandardMaterial color="#f0ece6" roughness={0.4} metalness={0.05} />
        </mesh>
        {/* Top plate */}
        <mesh position={[0, baseH + 0.015, 0]}>
          <boxGeometry args={[baseW + 0.06, 0.03, baseW + 0.06]} />
          <meshStandardMaterial color="#e8e2da" roughness={0.3} />
        </mesh>
        {/* Sculpture */}
        <group position={[0, baseH + 0.15, 0]}>
          <Sculpture type={sculptureType} color={sculptureColor} />
        </group>
      </group>
    </RigidBody>
  );
}

function Sculpture({ type, color }: { type: string; color: string }) {
  switch (type) {
    case 'torus':
      return (
        <mesh rotation={[Math.PI / 4, 0, 0]} castShadow>
          <torusGeometry args={[0.15, 0.06, 16, 32]} />
          <meshStandardMaterial color={color} roughness={0.25} metalness={0.6} />
        </mesh>
      );
    case 'knot':
      return (
        <mesh castShadow>
          <torusKnotGeometry args={[0.12, 0.04, 64, 16]} />
          <meshStandardMaterial color={color} roughness={0.2} metalness={0.7} />
        </mesh>
      );
    case 'ring':
      return (
        <group>
          <mesh rotation={[Math.PI / 6, Math.PI / 4, 0]} castShadow>
            <torusGeometry args={[0.14, 0.025, 16, 32]} />
            <meshStandardMaterial color={color} roughness={0.15} metalness={0.8} />
          </mesh>
          <mesh rotation={[Math.PI / 3, -Math.PI / 6, Math.PI / 4]} castShadow>
            <torusGeometry args={[0.14, 0.025, 16, 32]} />
            <meshStandardMaterial color="#b8a898" roughness={0.15} metalness={0.8} />
          </mesh>
        </group>
      );
    case 'diamond':
      return (
        <group>
          {/* Top cone */}
          <mesh position={[0, 0.08, 0]} castShadow>
            <coneGeometry args={[0.12, 0.16, 6]} />
            <meshStandardMaterial color={color} roughness={0.1} metalness={0.9} />
          </mesh>
          {/* Bottom inverted cone */}
          <mesh position={[0, -0.04, 0]} rotation={[Math.PI, 0, 0]} castShadow>
            <coneGeometry args={[0.12, 0.08, 6]} />
            <meshStandardMaterial color={color} roughness={0.1} metalness={0.9} />
          </mesh>
        </group>
      );
    case 'sphere':
    default:
      return (
        <mesh castShadow>
          <sphereGeometry args={[0.15, 32, 32]} />
          <meshStandardMaterial color={color} roughness={0.3} metalness={0.5} />
        </mesh>
      );
  }
}

/* ── Gallery Bench ── */
function GalleryBench({
  position,
  rotation = [0, 0, 0],
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  const seatW = 1.4;
  const seatD = 0.45;
  const seatH = 0.06;
  const legH = 0.4;
  const legW = 0.06;

  return (
    <RigidBody type="fixed" colliders="cuboid">
      <group position={position} rotation={rotation}>
        {/* Seat */}
        <mesh position={[0, legH + seatH / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[seatW, seatH, seatD]} />
          <meshStandardMaterial color="#3a3530" roughness={0.6} metalness={0.1} />
        </mesh>
        {/* Legs */}
        {[
          [-seatW / 2 + legW, legH / 2, -seatD / 2 + legW],
          [seatW / 2 - legW, legH / 2, -seatD / 2 + legW],
          [-seatW / 2 + legW, legH / 2, seatD / 2 - legW],
          [seatW / 2 - legW, legH / 2, seatD / 2 - legW],
        ].map((pos, i) => (
          <mesh key={i} position={pos as [number, number, number]}>
            <boxGeometry args={[legW, legH, legW]} />
            <meshStandardMaterial color="#2a2520" roughness={0.5} metalness={0.2} />
          </mesh>
        ))}
      </group>
    </RigidBody>
  );
}

/* ── Decorative Plant (potted) ── */
function PottedPlant({ position }: { position: [number, number, number] }) {
  const potH = 0.35;
  const potR = 0.15;

  return (
    <group position={position}>
      {/* Pot */}
      <mesh position={[0, potH / 2, 0]} castShadow>
        <cylinderGeometry args={[potR, potR * 0.8, potH, 12]} />
        <meshStandardMaterial color="#8b7355" roughness={0.7} />
      </mesh>
      {/* Foliage (stacked spheres) */}
      <mesh position={[0, potH + 0.2, 0]} castShadow>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#4a6b3a" roughness={0.8} />
      </mesh>
      <mesh position={[0.08, potH + 0.35, 0.05]} castShadow>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#567d44" roughness={0.8} />
      </mesh>
      <mesh position={[-0.06, potH + 0.38, -0.04]} castShadow>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshStandardMaterial color="#3f5e30" roughness={0.8} />
      </mesh>
    </group>
  );
}

/* ── Main export: all gallery objects ── */
export default function GalleryObjects() {
  return (
    <group>
      {/* ===== Entrance Hall [0, 0, 0] 20×5×15 ===== */}
      {/* Center sculpture */}
      <Pedestal position={[0, 0, -2]} sculptureType="knot" sculptureColor="#d4a574" />
      {/* Plants flanking the entrance */}
      <PottedPlant position={[-4, 0, -5]} />
      <PottedPlant position={[4, 0, -5]} />

      {/* ===== Corridor [0, 0, 11] 20×5×7 ===== */}
      {/* Benches for rest */}
      <GalleryBench position={[-3, 0, 11]} rotation={[0, Math.PI / 2, 0]} />
      <GalleryBench position={[3, 0, 11]} rotation={[0, -Math.PI / 2, 0]} />

      {/* ===== Wing A - About [-18, 0, 11] 16×5×12 ===== */}
      <Pedestal position={[-18, 0, 11]} sculptureType="sphere" sculptureColor="#a8b8c8" />

      {/* ===== Wing B - Projects [0, 0, 22] 20×5×15 ===== */}
      {/* Center bench for viewing */}
      <GalleryBench position={[0, 0, 22]} />
      {/* Sculptures between artwork walls */}
      <Pedestal position={[0, 0, 17.5]} sculptureType="ring" sculptureColor="#c8b090" />
      <Pedestal position={[0, 0, 26.5]} sculptureType="diamond" sculptureColor="#90a8c0" />

      {/* ===== Wing C - Career [18, 0, 11] 16×5×12 ===== */}
      <Pedestal position={[18, 0, 11]} sculptureType="torus" sculptureColor="#b0a0c8" />
      <GalleryBench position={[15, 0, 11]} />

      {/* ===== Wing D - Contact [0, 0, 35.5] 16×5×12 ===== */}
      <PottedPlant position={[-3, 0, 38]} />
      <PottedPlant position={[3, 0, 38]} />
      <GalleryBench position={[0, 0, 35.5]} />
    </group>
  );
}
