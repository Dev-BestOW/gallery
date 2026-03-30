import { useState, useEffect, useCallback } from 'react';
import { useGalleryStore } from '../../stores/useGalleryStore';

const isMobileDevice = () =>
  'ontouchstart' in window || navigator.maxTouchPoints > 0;

export default function WelcomeScreen() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const setHasEntered = useGalleryStore((s) => s.setHasEntered);

  const handleEnter = useCallback(() => {
    if (isMobileDevice()) {
      // 모바일: 포인터 락 없이 바로 입장
      setHasEntered(true);
    } else {
      // 데스크탑: 포인터 락 요청
      const canvas = document.querySelector('canvas');
      if (canvas) canvas.requestPointerLock();
    }
    setFadeOut(true);
  }, [setHasEntered]);

  // 데스크탑: 포인터 락 성공 시 입장 처리
  useEffect(() => {
    const handleLockChange = () => {
      if (document.pointerLockElement) {
        setHasEntered(true);
      }
    };
    document.addEventListener('pointerlockchange', handleLockChange);
    return () => document.removeEventListener('pointerlockchange', handleLockChange);
  }, [setHasEntered]);

  useEffect(() => {
    if (fadeOut) {
      const timer = setTimeout(() => setVisible(false), 800);
      return () => clearTimeout(timer);
    }
  }, [fadeOut]);

  if (!visible) return null;

  return (
    <div
      onClick={handleEnter}
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0a0a0a',
        zIndex: 100,
        cursor: 'pointer',
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 0.8s ease-out',
      }}
    >
      <div style={{ textAlign: 'center', color: '#fff' }}>
        <div
          style={{
            fontSize: '0.75rem',
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            opacity: 0.4,
            marginBottom: 16,
          }}
        >
          Interactive 3D
        </div>
        <h1
          style={{
            fontSize: '3.5rem',
            fontWeight: 200,
            letterSpacing: '-0.02em',
            marginBottom: 8,
          }}
        >
          Gallery Portfolio
        </h1>
        <div
          style={{
            width: 40,
            height: 1,
            backgroundColor: 'rgba(255,255,255,0.3)',
            margin: '24px auto',
          }}
        />
        <p
          style={{
            fontSize: '1rem',
            opacity: 0.6,
            marginBottom: 48,
            fontWeight: 300,
          }}
        >
          {isMobileDevice() ? '터치하여 갤러리에 입장하세요' : '클릭하여 갤러리에 입장하세요'}
        </p>

        <div
          style={{
            display: 'inline-grid',
            gridTemplateColumns: 'auto auto',
            gap: '8px 24px',
            fontSize: '0.8rem',
            opacity: 0.35,
            textAlign: 'left',
          }}
        >
          {isMobileDevice() ? (
            <>
              <span style={{ opacity: 0.7 }}>좌측</span><span>조이스틱 이동</span>
              <span style={{ opacity: 0.7 }}>우측</span><span>터치 둘러보기</span>
              <span style={{ opacity: 0.7 }}>Tap</span><span>작품 감상</span>
            </>
          ) : (
            <>
              <span style={{ opacity: 0.7 }}>WASD</span><span>이동</span>
              <span style={{ opacity: 0.7 }}>Mouse</span><span>둘러보기</span>
              <span style={{ opacity: 0.7 }}>Shift</span><span>달리기</span>
              <span style={{ opacity: 0.7 }}>Click</span><span>작품 감상</span>
              <span style={{ opacity: 0.7 }}>ESC</span><span>메뉴</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
