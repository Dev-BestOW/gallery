import { useGalleryStore } from '../../stores/useGalleryStore';
import { useEffect } from 'react';

export default function ArtworkDetail() {
  const viewingArtwork = useGalleryStore((s) => s.viewingArtwork);
  const setViewingArtwork = useGalleryStore((s) => s.setViewingArtwork);
  const setIsLocked = useGalleryStore((s) => s.setIsLocked);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && viewingArtwork) {
        setViewingArtwork(null);
        setIsLocked(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [viewingArtwork, setViewingArtwork, setIsLocked]);

  if (!viewingArtwork) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        zIndex: 200,
        cursor: 'pointer',
      }}
      onClick={() => {
        setViewingArtwork(null);
        setIsLocked(false);
      }}
    >
      <div
        style={{
          maxWidth: 600,
          width: '90%',
          backgroundColor: '#fff',
          borderRadius: 12,
          padding: 40,
          cursor: 'default',
          color: '#222',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image placeholder */}
        {viewingArtwork.image && (
          <div
            style={{
              width: '100%',
              height: 250,
              backgroundColor: '#f0ebe3',
              borderRadius: 8,
              marginBottom: 24,
              backgroundImage: `url(${viewingArtwork.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        )}

        <h2 style={{ fontSize: '1.5rem', marginBottom: 8, fontWeight: 600 }}>
          {viewingArtwork.title}
        </h2>

        {viewingArtwork.period && (
          <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: 16 }}>
            {viewingArtwork.period}
          </p>
        )}

        <p style={{ fontSize: '1rem', lineHeight: 1.6, marginBottom: 20, color: '#444' }}>
          {viewingArtwork.description}
        </p>

        {viewingArtwork.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
            {viewingArtwork.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  padding: '4px 12px',
                  backgroundColor: '#f4f0ec',
                  borderRadius: 20,
                  fontSize: '0.8rem',
                  color: '#666',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {viewingArtwork.link && (
          <a
            href={viewingArtwork.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              padding: '10px 24px',
              backgroundColor: '#222',
              color: '#fff',
              borderRadius: 8,
              textDecoration: 'none',
              fontSize: '0.9rem',
            }}
          >
            Visit Link →
          </a>
        )}

        <p style={{ marginTop: 24, fontSize: '0.75rem', color: '#aaa', textAlign: 'center' }}>
          ESC 또는 바깥 클릭으로 닫기
        </p>
      </div>
    </div>
  );
}
