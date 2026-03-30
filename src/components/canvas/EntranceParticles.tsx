import { Sparkles } from '@react-three/drei';

interface EntranceParticlesProps {
  position?: [number, number, number];
}

export default function EntranceParticles({
  position = [0, 2.5, 0],
}: EntranceParticlesProps) {
  return (
    <Sparkles
      position={position}
      count={40}
      scale={[18, 4, 13]}
      size={2}
      speed={0.3}
      opacity={0.4}
      color="#ffffff"
    />
  );
}
