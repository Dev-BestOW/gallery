import { useState, useEffect } from 'react';
import { useProgress } from '@react-three/drei';

export default function LoadingScreen() {
  const { progress, active } = useProgress();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!active && progress === 100) {
      const timer = setTimeout(() => setVisible(false), 600);
      return () => clearTimeout(timer);
    }
  }, [active, progress]);

  if (!visible) return null;

  const done = !active && progress === 100;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0a0a0a',
        zIndex: 1000,
        color: '#fff',
        opacity: done ? 0 : 1,
        transition: 'opacity 0.5s ease-out',
        pointerEvents: done ? 'none' : 'auto',
      }}
    >
      <p
        style={{
          fontSize: '0.75rem',
          letterSpacing: '0.4em',
          textTransform: 'uppercase',
          opacity: 0.4,
          marginBottom: 24,
        }}
      >
        Loading Gallery
      </p>
      <div
        style={{
          width: 200,
          height: 2,
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderRadius: 1,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: '100%',
            backgroundColor: 'rgba(255,255,255,0.6)',
            transition: 'width 0.3s ease-out',
          }}
        />
      </div>
      <p
        style={{
          fontSize: '0.7rem',
          opacity: 0.3,
          marginTop: 12,
        }}
      >
        {Math.round(progress)}%
      </p>
    </div>
  );
}
