interface RoomLightingProps {
  position: [number, number, number];
  theme: 'grand' | 'warm' | 'cool' | 'dark' | 'cozy';
}

const themeConfig = {
  grand: { color: '#ffffff', intensity: 1.2 },
  warm: { color: '#ffe4c4', intensity: 1.0 },
  cool: { color: '#cce0ff', intensity: 1.0 },
  dark: { color: '#e0d0ff', intensity: 0.8 },
  cozy: { color: '#ffd9a0', intensity: 1.0 },
};

export default function RoomLighting({ position, theme }: RoomLightingProps) {
  const config = themeConfig[theme];
  const [x, y, z] = position;

  return (
    <pointLight
      position={[x, y + 4.5, z]}
      color={config.color}
      intensity={config.intensity}
      distance={30}
      decay={2}
    />
  );
}
