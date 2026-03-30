import { Center, Text3D } from '@react-three/drei';

interface EntranceTitleProps {
  position?: [number, number, number];
  title?: string;
  subtitle?: string;
}

export default function EntranceTitle({
  position = [0, 2.8, -7],
  title = 'PORTFOLIO',
  subtitle = 'Welcome to my gallery',
}: EntranceTitleProps) {
  return (
    <group position={position}>
      {/* Main title using Text3D with built-in font */}
      <Center>
        <Text3D
          font="/fonts/helvetiker_bold.typeface.json"
          size={0.5}
          height={0.08}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.01}
          bevelSize={0.005}
          bevelSegments={3}
        >
          {title}
          <meshStandardMaterial color="#ffffff" metalness={0.3} roughness={0.4} />
        </Text3D>
      </Center>

      {/* Subtitle */}
      <Center position={[0, -0.7, 0]}>
        <Text3D
          font="/fonts/helvetiker_regular.typeface.json"
          size={0.15}
          height={0.02}
        >
          {subtitle}
          <meshStandardMaterial color="#cccccc" />
        </Text3D>
      </Center>

    </group>
  );
}
