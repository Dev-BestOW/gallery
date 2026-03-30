import { useState, useEffect, useCallback } from 'react';
import { useGalleryStore } from '../../stores/useGalleryStore';

export default function WelcomeScreen() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const isPointerLocked = useGalleryStore((s) => s.isPointerLocked);

  useEffect(() => {
    if (isPointerLocked && visible) {
      setFadeOut(true);
      const timer = setTimeout(() => setVisible(false), 800);
      return () => clearTimeout(timer);
    }
  }, [isPointerLocked, visible]);

  const handleEnter = useCallback(() => {
    const canvas = document.querySelector('canvas');
    if (canvas) canvas.requestPointerLock();
  }, []);

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
        {/* Title */}
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
          클릭하여 갤러리에 입장하세요
        </p>

        {/* Controls guide */}
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
          <span style={{ opacity: 0.7 }}>WASD</span><span>이동</span>
          <span style={{ opacity: 0.7 }}>Mouse</span><span>둘러보기</span>
          <span style={{ opacity: 0.7 }}>Shift</span><span>달리기</span>
          <span style={{ opacity: 0.7 }}>Click</span><span>작품 감상</span>
          <span style={{ opacity: 0.7 }}>ESC</span><span>메뉴</span>
        </div>
      </div>
    </div>
  );
}
