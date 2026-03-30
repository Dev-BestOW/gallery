import { useCallback } from 'react';
import { useGalleryStore } from '../../stores/useGalleryStore';

export default function HUD() {
  const isPointerLocked = useGalleryStore((s) => s.isPointerLocked);
  const nearbyArtwork = useGalleryStore((s) => s.nearbyArtwork);
  const viewingArtwork = useGalleryStore((s) => s.viewingArtwork);

  const handleEnter = useCallback(() => {
    const canvas = document.querySelector('canvas');
    if (canvas) canvas.requestPointerLock();
  }, []);

  if (!isPointerLocked && !viewingArtwork) {
    return (
      <div
        onClick={handleEnter}
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
      {isPointerLocked && (
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
      )}

      {/* Nearby artwork hint */}
      {nearbyArtwork && isPointerLocked && (
        <div
          style={{
            position: 'fixed',
            bottom: '15%',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '10px 24px',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            borderRadius: 8,
            color: '#fff',
            fontSize: '0.9rem',
            pointerEvents: 'none',
            zIndex: 10,
            textAlign: 'center',
            backdropFilter: 'blur(4px)',
          }}
        >
          <p style={{ fontWeight: 500 }}>{nearbyArtwork.title}</p>
          <p style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: 4 }}>
            클릭하여 감상하기
          </p>
        </div>
      )}
    </>
  );
}
