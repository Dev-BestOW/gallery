import { useCallback, useState, useEffect } from 'react';
import { useGalleryStore } from '../../stores/useGalleryStore';
import { useIsMobile } from '../../hooks/useIsMobile';

export default function HUD() {
  const isPointerLocked = useGalleryStore((s) => s.isPointerLocked);
  const hasEntered = useGalleryStore((s) => s.hasEntered);
  const nearbyArtwork = useGalleryStore((s) => s.nearbyArtwork);
  const viewingArtwork = useGalleryStore((s) => s.viewingArtwork);

  const handleResume = useCallback(() => {
    const canvas = document.querySelector('canvas');
    if (canvas) canvas.requestPointerLock();
  }, []);

  const isMobile = useIsMobile();

  // 작품 힌트 fade 상태
  const [hintVisible, setHintVisible] = useState(false);
  const [hintArtwork, setHintArtwork] = useState(nearbyArtwork);

  useEffect(() => {
    if (nearbyArtwork && !viewingArtwork) {
      setHintArtwork(nearbyArtwork);
      setHintVisible(true);
    } else {
      setHintVisible(false);
    }
  }, [nearbyArtwork, viewingArtwork]);

  if (!hasEntered) return null;

  // 데스크탑: ESC로 포인터 락 해제 시 재입장 안내
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
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(8px)',
          zIndex: 50,
          cursor: 'pointer',
          animation: 'fadeIn 0.3s ease-out',
        }}
      >
        <div style={{ textAlign: 'center', color: '#fff' }}>
          <div
            style={{
              width: 48,
              height: 48,
              border: '1.5px solid rgba(255,255,255,0.3)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}
          >
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: '10px solid rgba(255,255,255,0.7)',
                borderTop: '6px solid transparent',
                borderBottom: '6px solid transparent',
                marginLeft: 3,
              }}
            />
          </div>
          <p style={{ fontSize: '1.1rem', opacity: 0.8, fontFamily: "'Cormorant Garamond', serif" }}>
            클릭하여 계속하기
          </p>
          <p style={{ fontSize: '0.75rem', opacity: 0.35, marginTop: 8 }}>
            WASD 이동 · 마우스 둘러보기
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Crosshair (desktop only) — thin cross, expands near artwork */}
      {!isMobile && isPointerLocked && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: nearbyArtwork
              ? 'translate(-50%, -50%) scale(1.6)'
              : 'translate(-50%, -50%) scale(1)',
            opacity: nearbyArtwork ? 1 : 0.5,
            pointerEvents: 'none',
            zIndex: 10,
            transition: 'transform 0.25s ease-out, opacity 0.25s',
          }}
        >
          {/* Horizontal line */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: nearbyArtwork ? 18 : 12,
              height: 1.5,
              backgroundColor: '#fff',
              borderRadius: 1,
              transition: 'width 0.25s ease-out',
            }}
          />
          {/* Vertical line */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 1.5,
              height: nearbyArtwork ? 18 : 12,
              backgroundColor: '#fff',
              borderRadius: 1,
              transition: 'height 0.25s ease-out',
            }}
          />
          {/* Corner dots when near artwork */}
          {nearbyArtwork && (
            <>
              {[[-6, -6], [6, -6], [-6, 6], [6, 6]].map(([x, y], i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                    width: 2,
                    height: 2,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255,255,255,0.6)',
                  }}
                />
              ))}
            </>
          )}
        </div>
      )}

      {/* Nearby artwork hint with fade animation */}
      {(hintVisible || hintArtwork) && (
        <div
          style={{
            position: 'fixed',
            bottom: isMobile ? '25%' : '15%',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '12px 28px',
            backgroundColor: 'rgba(0, 0, 0, 0.55)',
            borderRadius: 10,
            color: '#fff',
            fontSize: '0.9rem',
            pointerEvents: 'none',
            zIndex: 10,
            textAlign: 'center',
            backdropFilter: 'blur(6px)',
            border: '1px solid rgba(255,255,255,0.08)',
            opacity: hintVisible ? 1 : 0,
            transition: 'opacity 0.35s ease-out',
          }}
          onTransitionEnd={() => {
            if (!hintVisible) setHintArtwork(null);
          }}
        >
          <p style={{ fontWeight: 500, fontFamily: "'Cormorant Garamond', serif", fontSize: '1.05rem' }}>
            {hintArtwork?.title}
          </p>
          <p style={{ fontSize: '0.7rem', opacity: 0.6, marginTop: 4, letterSpacing: '0.05em' }}>
            {isMobile ? '터치하여 감상하기' : '클릭하여 감상하기'}
          </p>
        </div>
      )}
    </>
  );
}
