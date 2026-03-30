import { RigidBody } from '@react-three/rapier';
import { COLORS } from '../../constants/gallery';

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

function WallSegment({ position, size }: WallSegmentProps) {
  return (
    <RigidBody type="fixed" colliders="cuboid">
      <mesh position={position} >
        <boxGeometry args={size} />
        <meshStandardMaterial color={COLORS.wall} />
      </mesh>
    </RigidBody>
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
        <mesh position={[0, -0.15, 0]} receiveShadow>
          <boxGeometry args={[w, 0.3, d]} />
          <meshStandardMaterial color={COLORS.floor} roughness={0.2} metalness={0.1} />
        </mesh>
      </RigidBody>

      {/* Ceiling */}
      <mesh position={[0, h, 0]}>
        <boxGeometry args={[w, 0.1, d]} />
        <meshStandardMaterial color={COLORS.ceiling} />
      </mesh>

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
        <RigidBody type="fixed" colliders="cuboid">
          <mesh position={[w / 2, h / 2, 0]} >
            <boxGeometry args={[t, h, d]} />
            <meshStandardMaterial color={COLORS.wall} />
          </mesh>
        </RigidBody>
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
        <RigidBody type="fixed" colliders="cuboid">
          <mesh position={[-w / 2, h / 2, 0]} >
            <boxGeometry args={[t, h, d]} />
            <meshStandardMaterial color={COLORS.wall} />
          </mesh>
        </RigidBody>
      )}
    </group>
  );
}
