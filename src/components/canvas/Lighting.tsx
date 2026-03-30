export default function Lighting() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      {/* 천장 포인트 라이트 */}
      <pointLight position={[0, 4.5, 0]} intensity={0.4} distance={20} />
      <pointLight position={[0, 4.5, -12]} intensity={0.4} distance={20} />
      <pointLight position={[0, 4.5, 12]} intensity={0.4} distance={20} />
    </>
  );
}
