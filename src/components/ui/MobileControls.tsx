import { useRef, useCallback, useEffect } from 'react';
import { useGalleryStore } from '../../stores/useGalleryStore';

interface JoystickState {
  x: number;
  y: number;
  active: boolean;
}

// 글로벌로 조이스틱 상태 공유 (useFrame에서 접근)
export const joystickState: JoystickState = { x: 0, y: 0, active: false };

export default function MobileControls() {
  const viewingArtwork = useGalleryStore((s) => s.viewingArtwork);
  const hasEntered = useGalleryStore((s) => s.hasEntered);
  const joystickRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const touchIdRef = useRef<number | null>(null);
  const centerRef = useRef({ x: 0, y: 0 });

  const RADIUS = 50;

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (touchIdRef.current !== null) return;
    const touch = e.changedTouches[0];
    touchIdRef.current = touch.identifier;

    const rect = joystickRef.current!.getBoundingClientRect();
    centerRef.current = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
    joystickState.active = true;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier !== touchIdRef.current) continue;

      const dx = touch.clientX - centerRef.current.x;
      const dy = touch.clientY - centerRef.current.y;
      const dist = Math.min(Math.sqrt(dx * dx + dy * dy), RADIUS);
      const angle = Math.atan2(dy, dx);

      const nx = (Math.cos(angle) * dist) / RADIUS;
      const ny = (Math.sin(angle) * dist) / RADIUS;

      joystickState.x = nx;
      joystickState.y = ny;

      if (knobRef.current) {
        knobRef.current.style.transform = `translate(${nx * RADIUS}px, ${ny * RADIUS}px)`;
      }
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    touchIdRef.current = null;
    joystickState.x = 0;
    joystickState.y = 0;
    joystickState.active = false;
    if (knobRef.current) {
      knobRef.current.style.transform = 'translate(0px, 0px)';
    }
  }, []);

  // 화면 우측 터치로 시점 회전
  useEffect(() => {
    let lastX = 0;
    let lastY = 0;
    let lookTouchId: number | null = null;

    const onStart = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        if (t.clientX > window.innerWidth / 2) {
          lookTouchId = t.identifier;
          lastX = t.clientX;
          lastY = t.clientY;
          break;
        }
      }
    };

    const onMove = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        if (t.identifier !== lookTouchId) continue;

        const dx = t.clientX - lastX;
        const dy = t.clientY - lastY;
        lastX = t.clientX;
        lastY = t.clientY;

        // Dispatch custom event for Player to consume
        window.dispatchEvent(
          new CustomEvent('mobile-look', { detail: { dx, dy } })
        );
      }
    };

    const onEnd = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === lookTouchId) {
          lookTouchId = null;
        }
      }
    };

    window.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', onStart);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
    };
  }, []);

  if (!hasEntered || viewingArtwork) return null;

  return (
    <>
      {/* Joystick - bottom left */}
      <div
        ref={joystickRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          position: 'fixed',
          bottom: 40,
          left: 40,
          width: 120,
          height: 120,
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 20,
          touchAction: 'none',
        }}
      >
        <div
          ref={knobRef}
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.4)',
            transition: 'transform 0.05s',
          }}
        />
      </div>

      {/* Look hint - bottom right */}
      <div
        style={{
          position: 'fixed',
          bottom: 80,
          right: 40,
          color: 'rgba(255, 255, 255, 0.3)',
          fontSize: '0.75rem',
          textAlign: 'center',
          zIndex: 20,
          pointerEvents: 'none',
        }}
      >
        <p>우측 터치로</p>
        <p>둘러보기</p>
      </div>
    </>
  );
}
