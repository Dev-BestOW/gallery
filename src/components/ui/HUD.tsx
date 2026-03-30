import { useCallback } from 'react';
import { useGalleryStore } from '../../stores/useGalleryStore';

export default function HUD() {
  const isPointerLocked = useGalleryStore((s) => s.isPointerLocked);
  const hasEntered = useGalleryStore((s) => s.hasEntered);
  const nearbyArtwork = useGalleryStore((s) => s.nearbyArtwork);
  const viewingArtwork = useGalleryStore((s) => s.viewingArtwork);

  const handleResume = useCallback(() => {
    const canvas = document.querySelector('canvas');
    if (canvas) canvas.requestPointerLock();
  }, []);

  // 입장 전이면 아무것도 표시하지 않음 (WelcomeScreen이 담당)
  if (!hasEntered) return null;

  // 데스크탑: ESC로 포인터 락 해제 시 재입장 안내
  const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (!isMobile && !isPointerLocked && !viewingArtwork) {
    return (
      <div
        onClick={handleResume}
        style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 50,
          cursor: 'pointer',
        }}
      >
        <div style={{ textAlign: 'center', color: '#fff' }}>
          <p style={{ fontSize: '1.1rem', opacity: 0.8 }}>
            클릭하여 계속하기
          </p>
          <p style={{ fontSize: '0.75rem', opacity: 0.4, marginTop: 8 }}>
            WASD 이동 · 마우스 둘러보기
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Crosshair (desktop only) */}
      {!isMobile && isPointerLocked && (
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
      {nearbyArtwork && !viewingArtwork && (
        <div
          style={{
            position: 'fixed',
            bottom: isMobile ? '25%' : '15%',
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
            {isMobile ? '터치하여 감상하기' : '클릭하여 감상하기'}
          </p>
        </div>
      )}
    </>
  );
}
