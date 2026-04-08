import { useState, useEffect, useRef } from 'react';
import { useGalleryStore } from '../../stores/useGalleryStore';

const wingNames: Record<string, string> = {
  entrance: 'Entrance Hall',
  about: 'About Me',
  projects: 'Projects',
  career: 'Career',
  contact: 'Contact',
};

export default function WingIndicator() {
  const currentWing = useGalleryStore((s) => s.currentWing);
  const hasEntered = useGalleryStore((s) => s.hasEntered);
  const [displayWing, setDisplayWing] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (!hasEntered || !currentWing) return;

    setDisplayWing(currentWing);
    setVisible(true);

    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setVisible(false), 2000);

    return () => clearTimeout(timerRef.current);
  }, [currentWing, hasEntered]);

  if (!displayWing) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '12%',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        pointerEvents: 'none',
        zIndex: 12,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.8s ease-out',
      }}
      onTransitionEnd={() => {
        if (!visible) setDisplayWing(null);
      }}
    >
      <div
        style={{
          fontSize: '0.65rem',
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.35)',
          marginBottom: 6,
        }}
      >
        Now Viewing
      </div>
      <div
        style={{
          fontSize: '1.8rem',
          fontWeight: 300,
          fontFamily: "'Cormorant Garamond', serif",
          color: 'rgba(255,255,255,0.8)',
          letterSpacing: '0.05em',
        }}
      >
        {wingNames[displayWing] || displayWing}
      </div>
      <div
        style={{
          width: 30,
          height: 1,
          backgroundColor: 'rgba(255,255,255,0.2)',
          margin: '10px auto 0',
        }}
      />
    </div>
  );
}
