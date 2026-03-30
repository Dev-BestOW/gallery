interface RoomLightingProps {
  position: [number, number, number];
  theme: 'grand' | 'warm' | 'cool' | 'dark' | 'cozy';
}

const themeConfig = {
  grand: { color: '#ffffff', intensity: 0.6 },
  warm: { color: '#ffe4c4', intensity: 0.5 },
  cool: { color: '#cce0ff', intensity: 0.5 },
  dark: { color: '#e0d0ff', intensity: 0.4 },
  cozy: { color: '#ffd9a0', intensity: 0.5 },
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
