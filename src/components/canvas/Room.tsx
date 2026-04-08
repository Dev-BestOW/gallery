import { useMemo } from 'react';
import * as THREE from 'three';
import { RigidBody } from '@react-three/rapier';
import { useTexture } from '@react-three/drei';
import { COLORS } from '../../constants/gallery';

import marbleNormal from '../../assets/textures/marble/normal.jpg';
import marbleRoughness from '../../assets/textures/marble/roughness.jpg';
import plasterNormal from '../../assets/textures/plaster/normal.jpg';
import plasterRoughness from '../../assets/textures/plaster/roughness.jpg';

type Direction = 'north' | 'south' | 'east' | 'west';
type Theme = 'grand' | 'warm' | 'cool' | 'dark' | 'cozy';

interface RoomProps {
  position?: [number, number, number];
  size?: [number, number, number];
  doorways?: Direction[];
  theme?: Theme;
}

type WallTextures = { normalMap: THREE.Texture; roughnessMap: THREE.Texture };

interface WallSegmentProps {
  position: [number, number, number];
  size: [number, number, number];
  wallTex: WallTextures;
}

/* ── Shared texture hooks ── */
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

/* ── Floor with marble texture ── */
function TexturedFloor({ w, d }: { w: number; d: number }) {
  const floorTex = useFloorTextures();
  return (
    <mesh position={[0, -0.15, 0]} receiveShadow>
      <boxGeometry args={[w, 0.3, d]} />
      <meshStandardMaterial
        {...floorTex}
        color="#e8e0d4"
        roughness={0.25}
        metalness={0.05}
      />
    </mesh>
  );
}

/* ── Floor Border (대리석 테두리) ── */
function FloorBorder({ w, d, wallT, doorways }: { w: number; d: number; wallT: number; doorways: Direction[] }) {
  const bw = 0.3;
  const inset = wallT / 2;
  const color = COLORS.floorBorder;

  return (
    <group>
      {!doorways.includes('north') && (
        <mesh position={[0, 0.002, -d / 2 + inset + bw / 2]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[w, bw]} />
          <meshStandardMaterial color={color} roughness={0.4} metalness={0.15} />
        </mesh>
      )}
      {!doorways.includes('south') && (
        <mesh position={[0, 0.002, d / 2 - inset - bw / 2]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[w, bw]} />
          <meshStandardMaterial color={color} roughness={0.4} metalness={0.15} />
        </mesh>
      )}
      {!doorways.includes('east') && (
        <mesh position={[w / 2 - inset - bw / 2, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[bw, d - wallT * 2]} />
          <meshStandardMaterial color={color} roughness={0.4} metalness={0.15} />
        </mesh>
      )}
      {!doorways.includes('west') && (
        <mesh position={[-w / 2 + inset + bw / 2, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[bw, d - wallT * 2]} />
          <meshStandardMaterial color={color} roughness={0.4} metalness={0.15} />
        </mesh>
      )}
    </group>
  );
}

/* ── Wall Segment (collision + visual) ── */
function WallSegment({ position, size, wallTex }: WallSegmentProps) {
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

/* ── Upper Wall Accent Panels (웨인스코팅 위 악센트 컬러 패널) ── */
function UpperWallPanels({ w, d, h, wallT, doorways, accentColor }: {
  w: number; d: number; h: number; wallT: number; doorways: Direction[]; accentColor: string;
}) {
  const wainscotTop = 1.26; // just above wainscoting trim
  const panelH = h - 0.15 - wainscotTop; // up to crown molding
  const panelY = wainscotTop + panelH / 2;
  const inset = wallT / 2;
  const panelDepth = 0.005;

  const sides: { dir: Direction; pos: [number, number, number]; size: [number, number]; rot: number }[] = [
    { dir: 'north', pos: [0, panelY, -d / 2 + inset + panelDepth / 2], size: [w, panelH], rot: 0 },
    { dir: 'south', pos: [0, panelY, d / 2 - inset - panelDepth / 2], size: [w, panelH], rot: 0 },
    { dir: 'east', pos: [w / 2 - inset - panelDepth / 2, panelY, 0], size: [panelDepth, panelH], rot: 0 },
    { dir: 'west', pos: [-w / 2 + inset + panelDepth / 2, panelY, 0], size: [panelDepth, panelH], rot: 0 },
  ];

  return (
    <group>
      {sides.filter((s) => !doorways.includes(s.dir)).map((side, i) => (
        <mesh key={i} position={side.pos}>
          <boxGeometry args={
            side.dir === 'north' || side.dir === 'south'
              ? [side.size[0], side.size[1], panelDepth]
              : [panelDepth, side.size[1], d - wallT * 2]
          } />
          <meshStandardMaterial color={accentColor} roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

/* ── Wainscoting (하단 벽 패널 — 클래식 미술관 스타일) ── */
function Wainscoting({ w, d, wallT, doorways }: { w: number; d: number; wallT: number; doorways: Direction[] }) {
  const wh = 1.2;
  const panelDepth = 0.015;
  const trimH = 0.06;
  const trimDepth = 0.025;
  const inset = wallT / 2;
  const panelColor = COLORS.wainscot;
  const trimColor = COLORS.wainscotTrim;

  const allSides: { dir: Direction; pos: [number, number, number]; panelSize: [number, number]; trimSize: [number, number]; rot: number }[] = [
    { dir: 'north', pos: [0, 0, -d / 2 + inset], panelSize: [w, wh], trimSize: [w, trimH], rot: 0 },
    { dir: 'south', pos: [0, 0, d / 2 - inset], panelSize: [w, wh], trimSize: [w, trimH], rot: Math.PI },
    { dir: 'east', pos: [w / 2 - inset, 0, 0], panelSize: [d - wallT * 2, wh], trimSize: [d - wallT * 2, trimH], rot: -Math.PI / 2 },
    { dir: 'west', pos: [-w / 2 + inset, 0, 0], panelSize: [d - wallT * 2, wh], trimSize: [d - wallT * 2, trimH], rot: Math.PI / 2 },
  ];

  const sides = allSides.filter((s) => !doorways.includes(s.dir));

  return (
    <group>
      {sides.map((side, i) => (
        <group key={i} position={side.pos} rotation={[0, side.rot, 0]}>
          <mesh position={[0, wh / 2, panelDepth / 2]}>
            <boxGeometry args={[side.panelSize[0], side.panelSize[1], panelDepth]} />
            <meshStandardMaterial color={panelColor} roughness={0.6} />
          </mesh>
          <mesh position={[0, wh, trimDepth / 2]}>
            <boxGeometry args={[side.trimSize[0], trimH, trimDepth]} />
            <meshStandardMaterial color={trimColor} roughness={0.5} />
          </mesh>
          <mesh position={[0, wh * 0.55, trimDepth / 2]}>
            <boxGeometry args={[side.trimSize[0], trimH * 0.6, trimDepth]} />
            <meshStandardMaterial color={trimColor} roughness={0.5} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ── Decorative Column (장식 기둥) ── */
function Column({ position }: { position: [number, number, number] }) {
  const colR = 0.12;
  const colH = 3.2;
  const baseH = 0.2;
  const baseW = 0.35;
  const capitalH = 0.15;

  return (
    <RigidBody type="fixed" colliders="cuboid">
      <group position={position}>
        {/* Base */}
        <mesh position={[0, baseH / 2, 0]}>
          <boxGeometry args={[baseW, baseH, baseW]} />
          <meshStandardMaterial color={COLORS.columnBase} roughness={0.4} />
        </mesh>
        {/* Shaft */}
        <mesh position={[0, baseH + colH / 2, 0]}>
          <cylinderGeometry args={[colR, colR * 1.05, colH, 16]} />
          <meshStandardMaterial color={COLORS.column} roughness={0.35} metalness={0.05} />
        </mesh>
        {/* Capital */}
        <mesh position={[0, baseH + colH + capitalH / 2, 0]}>
          <boxGeometry args={[baseW, capitalH, baseW]} />
          <meshStandardMaterial color={COLORS.columnBase} roughness={0.4} />
        </mesh>
      </group>
    </RigidBody>
  );
}

/* ── Door Frame (문틀) ── */
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
  const frameW = 0.1;
  const frameD = thickness + 0.06;
  const jambCenterY = -wallHeight / 2 + doorwayHeight / 2;
  const headerY = -wallHeight / 2 + doorwayHeight;

  return (
    <group>
      {/* Left jamb */}
      <mesh position={[-doorwayWidth / 2 - frameW / 2, jambCenterY, 0]}>
        <boxGeometry args={[frameW, doorwayHeight, frameD]} />
        <meshStandardMaterial color={COLORS.columnBase} roughness={0.4} />
      </mesh>
      {/* Right jamb */}
      <mesh position={[doorwayWidth / 2 + frameW / 2, jambCenterY, 0]}>
        <boxGeometry args={[frameW, doorwayHeight, frameD]} />
        <meshStandardMaterial color={COLORS.columnBase} roughness={0.4} />
      </mesh>
      {/* Header — ornamental keystone shape */}
      <mesh position={[0, headerY, 0]}>
        <boxGeometry args={[doorwayWidth + frameW * 2, frameW * 1.5, frameD]} />
        <meshStandardMaterial color={COLORS.columnBase} roughness={0.4} />
      </mesh>
      {/* Decorative columns flanking the door */}
      <Column position={[-doorwayWidth / 2 - frameW - 0.15, -wallHeight / 2, 0]} />
      <Column position={[doorwayWidth / 2 + frameW + 0.15, -wallHeight / 2, 0]} />
    </group>
  );
}

/* ── Baseboard (걸레받이) ── */
function Baseboard({ w, d, wallT, doorways }: { w: number; d: number; wallT: number; doorways: Direction[] }) {
  const bh = 0.15;
  const bd = 0.04;
  const color = '#d5cec4';
  const inset = wallT / 2;

  return (
    <group>
      {!doorways.includes('north') && (
        <mesh position={[0, bh / 2, -d / 2 + inset + bd / 2]}>
          <boxGeometry args={[w, bh, bd]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
      )}
      {!doorways.includes('south') && (
        <mesh position={[0, bh / 2, d / 2 - inset - bd / 2]}>
          <boxGeometry args={[w, bh, bd]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
      )}
      {!doorways.includes('east') && (
        <mesh position={[w / 2 - inset - bd / 2, bh / 2, 0]}>
          <boxGeometry args={[bd, bh, d - wallT * 2]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
      )}
      {!doorways.includes('west') && (
        <mesh position={[-w / 2 + inset + bd / 2, bh / 2, 0]}>
          <boxGeometry args={[bd, bh, d - wallT * 2]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
      )}
    </group>
  );
}

/* ── Crown Molding (크라운 몰딩) ── */
function CrownMolding({ w, d, h, wallT, doorways }: { w: number; d: number; h: number; wallT: number; doorways: Direction[] }) {
  const mh = 0.1;
  const md = 0.05;
  const color = '#eae5de';
  const inset = wallT / 2;
  const y = h - 0.05 - mh / 2;

  return (
    <group>
      {!doorways.includes('north') && (
        <mesh position={[0, y, -d / 2 + inset + md / 2]}>
          <boxGeometry args={[w, mh, md]} />
          <meshStandardMaterial color={color} roughness={0.6} />
        </mesh>
      )}
      {!doorways.includes('south') && (
        <mesh position={[0, y, d / 2 - inset - md / 2]}>
          <boxGeometry args={[w, mh, md]} />
          <meshStandardMaterial color={color} roughness={0.6} />
        </mesh>
      )}
      {!doorways.includes('east') && (
        <mesh position={[w / 2 - inset - md / 2, y, 0]}>
          <boxGeometry args={[md, mh, d - wallT * 2]} />
          <meshStandardMaterial color={color} roughness={0.6} />
        </mesh>
      )}
      {!doorways.includes('west') && (
        <mesh position={[-w / 2 + inset + md / 2, y, 0]}>
          <boxGeometry args={[md, mh, d - wallT * 2]} />
          <meshStandardMaterial color={color} roughness={0.6} />
        </mesh>
      )}
    </group>
  );
}

/* ── Ceiling Light Rail (천장 조명 레일) ── */
function CeilingLightRail({ d, h }: { w: number; d: number; h: number }) {
  const railH = 0.05;
  const railW = 0.06;
  const fixtureR = 0.06;
  const fixtureH = 0.1;
  const railY = h - 0.12;
  const railColor = '#b0aba3';
  const fixtureColor = '#2a2a2a';

  const count = Math.max(2, Math.floor(d / 4));
  const spacing = (d - 2) / (count - 1);
  const startZ = -d / 2 + 1;

  return (
    <group>
      <mesh position={[0, railY, 0]}>
        <boxGeometry args={[railW, railH, d * 0.7]} />
        <meshStandardMaterial color={railColor} metalness={0.4} roughness={0.3} />
      </mesh>
      {Array.from({ length: count }).map((_, i) => {
        const z = startZ + i * spacing;
        return (
          <group key={i} position={[0, railY - fixtureH / 2, z]}>
            <mesh>
              <cylinderGeometry args={[fixtureR, fixtureR, fixtureH, 8]} />
              <meshStandardMaterial color={fixtureColor} metalness={0.3} roughness={0.4} />
            </mesh>
            <mesh position={[0, -fixtureH / 2 - 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[fixtureR * 0.8, 8]} />
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

/* ── Wall with Doorway ── */
function WallWithDoorway({
  wallPosition,
  wallWidth,
  height,
  thickness,
  doorwayWidth,
  doorwayHeight,
  rotation,
  wallTex,
}: {
  wallPosition: [number, number, number];
  wallWidth: number;
  height: number;
  thickness: number;
  doorwayWidth: number;
  doorwayHeight: number;
  rotation?: [number, number, number];
  wallTex: WallTextures;
}) {
  const sideWidth = (wallWidth - doorwayWidth) / 2;
  const topHeight = height - doorwayHeight;
  const leftOffset = -(wallWidth / 2) + sideWidth / 2;
  const rightOffset = (wallWidth / 2) - sideWidth / 2;
  const topY = doorwayHeight + topHeight / 2 - height / 2;

  const segments: { pos: [number, number, number]; size: [number, number, number] }[] = [
    { pos: [leftOffset, 0, 0], size: [sideWidth, height, thickness] },
    { pos: [rightOffset, 0, 0], size: [sideWidth, height, thickness] },
    { pos: [0, topY, 0], size: [doorwayWidth, topHeight, thickness] },
  ];

  return (
    <group position={wallPosition} rotation={rotation}>
      {segments.map((seg, i) => (
        <WallSegment key={i} position={seg.pos} size={seg.size} wallTex={wallTex} />
      ))}
      <DoorFrame
        doorwayWidth={doorwayWidth}
        doorwayHeight={doorwayHeight}
        thickness={thickness}
        wallHeight={height}
      />
    </group>
  );
}

/* ── Room (main export) ── */
export default function Room({
  position = [0, 0, 0],
  size = [20, 5, 15],
  doorways = [],
  theme,
}: RoomProps) {
  const [w, h, d] = size;
  const t = 0.3;
  const doorW = 3;
  const doorH = 3.5;
  const hasDoor = (dir: Direction) => doorways.includes(dir);

  const accentColor = theme ? COLORS.wingColors[theme] : COLORS.wall;

  // 텍스처를 Room 레벨에서 한 번만 로드
  const wallTex = useWallTextures();

  return (
    <group position={position}>
      {/* Floor */}
      <RigidBody type="fixed" colliders="cuboid">
        <TexturedFloor w={w} d={d} />
      </RigidBody>

      {/* Floor border */}
      <FloorBorder w={w} d={d} wallT={t} doorways={doorways} />

      {/* Ceiling */}
      <mesh position={[0, h, 0]}>
        <boxGeometry args={[w, 0.1, d]} />
        <meshStandardMaterial color={COLORS.ceiling} />
      </mesh>

      {/* Architectural trim */}
      <Baseboard w={w} d={d} wallT={t} doorways={doorways} />
      <Wainscoting w={w} d={d} wallT={t} doorways={doorways} />
      {theme && <UpperWallPanels w={w} d={d} h={h} wallT={t} doorways={doorways} accentColor={accentColor} />}
      <CrownMolding w={w} d={d} h={h} wallT={t} doorways={doorways} />
      <CeilingLightRail w={w} d={d} h={h} />

      {/* North wall */}
      {hasDoor('north') ? (
        <WallWithDoorway
          wallPosition={[0, h / 2, -d / 2]}
          wallWidth={w} height={h} thickness={t}
          doorwayWidth={doorW} doorwayHeight={doorH}
          wallTex={wallTex}
        />
      ) : (
        <WallSegment position={[0, h / 2, -d / 2]} size={[w, h, t]} wallTex={wallTex} />
      )}

      {/* South wall */}
      {hasDoor('south') ? (
        <WallWithDoorway
          wallPosition={[0, h / 2, d / 2]}
          wallWidth={w} height={h} thickness={t}
          doorwayWidth={doorW} doorwayHeight={doorH}
          wallTex={wallTex}
        />
      ) : (
        <WallSegment position={[0, h / 2, d / 2]} size={[w, h, t]} wallTex={wallTex} />
      )}

      {/* East wall */}
      {hasDoor('east') ? (
        <WallWithDoorway
          wallPosition={[w / 2, h / 2, 0]}
          wallWidth={d} height={h} thickness={t}
          doorwayWidth={doorW} doorwayHeight={doorH}
          rotation={[0, Math.PI / 2, 0]}
          wallTex={wallTex}
        />
      ) : (
        <WallSegment position={[w / 2, h / 2, 0]} size={[t, h, d]} wallTex={wallTex} />
      )}

      {/* West wall */}
      {hasDoor('west') ? (
        <WallWithDoorway
          wallPosition={[-w / 2, h / 2, 0]}
          wallWidth={d} height={h} thickness={t}
          doorwayWidth={doorW} doorwayHeight={doorH}
          rotation={[0, Math.PI / 2, 0]}
          wallTex={wallTex}
        />
      ) : (
        <WallSegment position={[-w / 2, h / 2, 0]} size={[t, h, d]} wallTex={wallTex} />
      )}
    </group>
  );
}
