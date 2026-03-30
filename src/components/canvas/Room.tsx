import { useMemo } from 'react';
import * as THREE from 'three';
import { RigidBody } from '@react-three/rapier';
import { useTexture } from '@react-three/drei';
import { COLORS } from '../../constants/gallery';

import marbleColor from '../../assets/textures/marble/color.jpg';
import marbleNormal from '../../assets/textures/marble/normal.jpg';
import marbleRoughness from '../../assets/textures/marble/roughness.jpg';
import plasterNormal from '../../assets/textures/plaster/normal.jpg';
import plasterRoughness from '../../assets/textures/plaster/roughness.jpg';

type Direction = 'north' | 'south' | 'east' | 'west';

interface RoomProps {
  position?: [number, number, number];
  size?: [number, number, number]; // width, height, depth
  doorways?: Direction[];
}

interface WallSegmentProps {
  position: [number, number, number];
  size: [number, number, number];
}

function useWallTextures() {
  const textures = useTexture({
    normalMap: plasterNormal,
    roughnessMap: plasterRoughness,
  });
  useMemo(() => {
    Object.values(textures).forEach((t) => {
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(3, 2);
    });
  }, [textures]);
  return textures;
}

function useFloorTextures() {
  const textures = useTexture({
    map: marbleColor,
    normalMap: marbleNormal,
    roughnessMap: marbleRoughness,
  });
  useMemo(() => {
    Object.values(textures).forEach((t) => {
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(4, 3);
    });
  }, [textures]);
  return textures;
}

function TexturedFloor({ w, d }: { w: number; d: number }) {
  const floorTex = useFloorTextures();
  return (
    <mesh position={[0, -0.15, 0]} receiveShadow>
      <boxGeometry args={[w, 0.3, d]} />
      <meshStandardMaterial
        {...floorTex}
        color="#c8c0b8"
        roughness={0.3}
        metalness={0.1}
      />
    </mesh>
  );
}

function WallSegment({ position, size }: WallSegmentProps) {
  const wallTex = useWallTextures();
  return (
    <RigidBody type="fixed" colliders="cuboid">
      <mesh position={position} receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial
          color={COLORS.wall}
          {...wallTex}
          roughness={0.85}
        />
      </mesh>
    </RigidBody>
  );
}

/* ── Door Frame ── */
function DoorFrame({
  doorwayWidth,
  doorwayHeight,
  thickness,
  wallHeight,
}: {
  doorwayWidth: number;
  doorwayHeight: number;
  thickness: number;
  wallHeight: number;
}) {
  const frameW = 0.08;
  const frameD = thickness + 0.04; // slightly deeper than wall
  // WallWithDoorway group is at Y = wallHeight/2, so floor is at -wallHeight/2
  const jambCenterY = -wallHeight / 2 + doorwayHeight / 2;
  const headerY = -wallHeight / 2 + doorwayHeight;

  return (
    <group>
      {/* Left jamb */}
      <mesh position={[-doorwayWidth / 2 - frameW / 2, jambCenterY, 0]}>
        <boxGeometry args={[frameW, doorwayHeight, frameD]} />
        <meshStandardMaterial color="#d4cdc4" roughness={0.6} />
      </mesh>
      {/* Right jamb */}
      <mesh position={[doorwayWidth / 2 + frameW / 2, jambCenterY, 0]}>
        <boxGeometry args={[frameW, doorwayHeight, frameD]} />
        <meshStandardMaterial color="#d4cdc4" roughness={0.6} />
      </mesh>
      {/* Header */}
      <mesh position={[0, headerY, 0]}>
        <boxGeometry args={[doorwayWidth + frameW * 2, frameW, frameD]} />
        <meshStandardMaterial color="#d4cdc4" roughness={0.6} />
      </mesh>
    </group>
  );
}

/* ── Baseboard (걸레받이) ── */
function Baseboard({ w, d, h, wallT }: { w: number; d: number; h: number; wallT: number }) {
  const bh = 0.15; // baseboard height (15cm - visible)
  const bd = 0.04; // baseboard depth (4cm protrusion)
  const color = '#d5cec4'; // slightly darker than wall for contrast
  const inset = wallT / 2; // wall inner face offset

  return (
    <group>
      {/* North */}
      <mesh position={[0, bh / 2, -d / 2 + inset + bd / 2]}>
        <boxGeometry args={[w - wallT * 2, bh, bd]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {/* South */}
      <mesh position={[0, bh / 2, d / 2 - inset - bd / 2]}>
        <boxGeometry args={[w - wallT * 2, bh, bd]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {/* East */}
      <mesh position={[w / 2 - inset - bd / 2, bh / 2, 0]}>
        <boxGeometry args={[bd, bh, d - wallT * 2]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {/* West */}
      <mesh position={[-w / 2 + inset + bd / 2, bh / 2, 0]}>
        <boxGeometry args={[bd, bh, d - wallT * 2]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
    </group>
  );
}

/* ── Crown Molding (크라운 몰딩) ── */
function CrownMolding({ w, d, h, wallT }: { w: number; d: number; h: number; wallT: number }) {
  const mh = 0.1; // molding height (10cm - visible from below)
  const md = 0.05; // molding depth (5cm)
  const color = '#eae5de';
  const inset = wallT / 2;

  return (
    <group>
      {/* North — position below ceiling (h - 0.05 is ceiling bottom) */}
      <mesh position={[0, h - 0.05 - mh / 2, -d / 2 + inset + md / 2]}>
        <boxGeometry args={[w - wallT * 2, mh, md]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      {/* South */}
      <mesh position={[0, h - 0.05 - mh / 2, d / 2 - inset - md / 2]}>
        <boxGeometry args={[w - wallT * 2, mh, md]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      {/* East */}
      <mesh position={[w / 2 - inset - md / 2, h - 0.05 - mh / 2, 0]}>
        <boxGeometry args={[md, mh, d - wallT * 2]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      {/* West */}
      <mesh position={[-w / 2 + inset + md / 2, h - 0.05 - mh / 2, 0]}>
        <boxGeometry args={[md, mh, d - wallT * 2]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
    </group>
  );
}

/* ── Ceiling Light Rail (천장 조명 레일) ── */
function CeilingLightRail({ w, d, h }: { w: number; d: number; h: number }) {
  const railH = 0.05; // rail thickness (5cm)
  const railW = 0.06; // rail width (6cm)
  const fixtureR = 0.06; // light fixture radius (6cm)
  const fixtureH = 0.1; // light fixture height (10cm)
  const railY = h - 0.12; // below ceiling and crown molding
  const railColor = '#b0aba3';
  const fixtureColor = '#2a2a2a';

  // Place fixtures evenly along the rail
  const count = Math.max(2, Math.floor(d / 4));
  const spacing = (d - 2) / (count - 1);
  const startZ = -d / 2 + 1;

  return (
    <group>
      {/* Rail bar running along Z axis */}
      <mesh position={[0, railY, 0]}>
        <boxGeometry args={[railW, railH, d * 0.7]} />
        <meshStandardMaterial color={railColor} metalness={0.4} roughness={0.3} />
      </mesh>

      {/* Light fixtures along the rail */}
      {Array.from({ length: count }).map((_, i) => {
        const z = startZ + i * spacing;
        return (
          <group key={i} position={[0, railY - fixtureH / 2, z]}>
            {/* Fixture housing */}
            <mesh>
              <cylinderGeometry args={[fixtureR, fixtureR, fixtureH, 8]} />
              <meshStandardMaterial color={fixtureColor} metalness={0.3} roughness={0.4} />
            </mesh>
            {/* Light cap (emissive bottom) */}
            <mesh position={[0, -fixtureH / 2 - 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[fixtureR * 0.8, 8]} />
              <meshStandardMaterial
                color="#ffffff"
                emissive="#ffffff"
                emissiveIntensity={0.5}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function WallWithDoorway({
  wallPosition,
  wallWidth,
  height,
  thickness,
  doorwayWidth,
  doorwayHeight,
  rotation,
}: {
  wallPosition: [number, number, number];
  wallWidth: number;
  height: number;
  thickness: number;
  doorwayWidth: number;
  doorwayHeight: number;
  rotation?: [number, number, number];
}) {
  const sideWidth = (wallWidth - doorwayWidth) / 2;
  const topHeight = height - doorwayHeight;

  // 로컬 좌표계에서의 위치 계산
  const leftOffset = -(wallWidth / 2) + sideWidth / 2;
  const rightOffset = (wallWidth / 2) - sideWidth / 2;
  const topY = doorwayHeight + topHeight / 2 - height / 2;

  const segments: { pos: [number, number, number]; size: [number, number, number] }[] = [
    // 왼쪽 벽
    { pos: [leftOffset, 0, 0], size: [sideWidth, height, thickness] },
    // 오른쪽 벽
    { pos: [rightOffset, 0, 0], size: [sideWidth, height, thickness] },
    // 문 위 벽
    { pos: [0, topY, 0], size: [doorwayWidth, topHeight, thickness] },
  ];

  return (
    <group position={wallPosition} rotation={rotation}>
      {segments.map((seg, i) => (
        <WallSegment key={i} position={seg.pos} size={seg.size} />
      ))}
      {/* Door frame around doorway */}
      <DoorFrame
        doorwayWidth={doorwayWidth}
        doorwayHeight={doorwayHeight}
        thickness={thickness}
        wallHeight={height}
      />
    </group>
  );
}

export default function Room({
  position = [0, 0, 0],
  size = [20, 5, 15],
  doorways = [],
}: RoomProps) {
  const [w, h, d] = size;
  const t = 0.3; // wall thickness
  const doorW = 3;
  const doorH = 3.5;

  const hasDoor = (dir: Direction) => doorways.includes(dir);

  return (
    <group position={position}>
      {/* Floor */}
      <RigidBody type="fixed" colliders="cuboid">
        <TexturedFloor w={w} d={d} />
      </RigidBody>

      {/* Ceiling */}
      <mesh position={[0, h, 0]}>
        <boxGeometry args={[w, 0.1, d]} />
        <meshStandardMaterial color={COLORS.ceiling} />
      </mesh>

      {/* Architectural trim */}
      <Baseboard w={w} d={d} h={h} wallT={t} />
      <CrownMolding w={w} d={d} h={h} wallT={t} />
      <CeilingLightRail w={w} d={d} h={h} />

      {/* North wall (z = -d/2) */}
      {hasDoor('north') ? (
        <WallWithDoorway
          wallPosition={[0, h / 2, -d / 2]}
          wallWidth={w}
          height={h}
          thickness={t}
          doorwayWidth={doorW}
          doorwayHeight={doorH}
        />
      ) : (
        <WallSegment position={[0, h / 2, -d / 2]} size={[w, h, t]} />
      )}

      {/* South wall (z = +d/2) */}
      {hasDoor('south') ? (
        <WallWithDoorway
          wallPosition={[0, h / 2, d / 2]}
          wallWidth={w}
          height={h}
          thickness={t}
          doorwayWidth={doorW}
          doorwayHeight={doorH}
        />
      ) : (
        <WallSegment position={[0, h / 2, d / 2]} size={[w, h, t]} />
      )}

      {/* East wall (x = +w/2) */}
      {hasDoor('east') ? (
        <WallWithDoorway
          wallPosition={[w / 2, h / 2, 0]}
          wallWidth={d}
          height={h}
          thickness={t}
          doorwayWidth={doorW}
          doorwayHeight={doorH}
          rotation={[0, Math.PI / 2, 0]}
        />
      ) : (
        <WallSegment position={[w / 2, h / 2, 0]} size={[t, h, d]} />
      )}

      {/* West wall (x = -w/2) */}
      {hasDoor('west') ? (
        <WallWithDoorway
          wallPosition={[-w / 2, h / 2, 0]}
          wallWidth={d}
          height={h}
          thickness={t}
          doorwayWidth={doorW}
          doorwayHeight={doorH}
          rotation={[0, Math.PI / 2, 0]}
        />
      ) : (
        <WallSegment position={[-w / 2, h / 2, 0]} size={[t, h, d]} />
      )}
    </group>
  );
}
