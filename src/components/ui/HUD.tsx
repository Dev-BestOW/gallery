import { useGalleryStore } from '../../stores/useGalleryStore';

export default function HUD() {
  const isPointerLocked = useGalleryStore((s) => s.isPointerLocked);

  if (!isPointerLocked) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          zIndex: 100,
          cursor: 'pointer',
        }}
      >
        <div style={{ textAlign: 'center', color: '#fff' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem', fontWeight: 300 }}>
            Gallery Portfolio
          </h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.8, marginBottom: '2rem' }}>
            클릭하여 갤러리에 입장하세요
          </p>
          <div style={{ fontSize: '0.85rem', opacity: 0.5, lineHeight: 1.8 }}>
            <p>WASD / 방향키 — 이동</p>
            <p>마우스 — 둘러보기</p>
            <p>Shift — 달리기</p>
            <p>ESC — 메뉴</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Crosshair */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      />
    </>
  );
}
