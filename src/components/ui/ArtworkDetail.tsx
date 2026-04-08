import { useGalleryStore } from '../../stores/useGalleryStore';
import { useEffect, useCallback, useRef, useState } from 'react';
import { checkIsMobile } from '../../hooks/useIsMobile';

export default function ArtworkDetail() {
  const viewingArtwork = useGalleryStore((s) => s.viewingArtwork);
  const setViewingArtwork = useGalleryStore((s) => s.setViewingArtwork);
  const setIsLocked = useGalleryStore((s) => s.setIsLocked);

  const [visible, setVisible] = useState(false);
  const [animIn, setAnimIn] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  const closePanel = useCallback(() => {
    setAnimIn(false);
    setTimeout(() => {
      setViewingArtwork(null);
      setIsLocked(false);
      setVisible(false);
      if (!checkIsMobile()) {
        setTimeout(() => {
          document.querySelector('canvas')?.requestPointerLock();
        }, 50);
      }
    }, 300);
  }, [setViewingArtwork, setIsLocked]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && viewingArtwork) {
        closePanel();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [viewingArtwork, closePanel]);

  // 모달 열릴 때 애니메이션
  useEffect(() => {
    if (viewingArtwork) {
      setVisible(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimIn(true));
      });
    }
  }, [viewingArtwork]);

  // 포커스 이동
  useEffect(() => {
    if (animIn && dialogRef.current) {
      dialogRef.current.focus();
    }
  }, [animIn]);

  if (!visible) return null;

  const artwork = viewingArtwork || { title: '', description: '', tags: [] as string[], image: '', period: '', link: '' };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="artwork-title"
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: animIn ? 'rgba(0, 0, 0, 0.85)' : 'rgba(0, 0, 0, 0)',
        zIndex: 200,
        cursor: 'pointer',
        transition: 'background-color 0.3s ease-out',
      }}
      onClick={closePanel}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        style={{
          maxWidth: 600,
          width: '90%',
          backgroundColor: '#fff',
          borderRadius: 16,
          padding: 40,
          cursor: 'default',
          color: '#222',
          outline: 'none',
          transform: animIn ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.97)',
          opacity: animIn ? 1 : 0,
          transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease-out',
          boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image placeholder */}
        {artwork.image && (
          <div
            style={{
              width: '100%',
              height: 250,
              backgroundColor: '#f0ebe3',
              borderRadius: 10,
              marginBottom: 24,
              backgroundImage: `url(${artwork.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        )}

        <h2
          id="artwork-title"
          style={{
            fontSize: '1.6rem',
            marginBottom: 8,
            fontWeight: 600,
            fontFamily: "'Cormorant Garamond', serif",
          }}
        >
          {artwork.title}
        </h2>

        {artwork.period && (
          <p style={{ fontSize: '0.85rem', color: '#999', marginBottom: 16, letterSpacing: '0.03em' }}>
            {artwork.period}
          </p>
        )}

        <p style={{ fontSize: '0.95rem', lineHeight: 1.7, marginBottom: 20, color: '#555' }}>
          {artwork.description}
        </p>

        {artwork.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
            {artwork.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  padding: '4px 14px',
                  backgroundColor: '#f4f0ec',
                  borderRadius: 20,
                  fontSize: '0.78rem',
                  color: '#777',
                  letterSpacing: '0.02em',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {artwork.link && (
          <a
            href={artwork.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              padding: '10px 28px',
              backgroundColor: '#222',
              color: '#fff',
              borderRadius: 8,
              textDecoration: 'none',
              fontSize: '0.85rem',
              letterSpacing: '0.03em',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#444')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#222')}
          >
            Visit Link →
          </a>
        )}

        <p style={{ marginTop: 28, fontSize: '0.7rem', color: '#bbb', textAlign: 'center', letterSpacing: '0.05em' }}>
          ESC 또는 바깥 클릭으로 닫기
        </p>
      </div>
    </div>
  );
}
