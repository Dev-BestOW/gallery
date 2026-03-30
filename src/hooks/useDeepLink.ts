import { useEffect } from 'react';
import { useGalleryStore } from '../stores/useGalleryStore';

const sectionPositions: Record<string, [number, number, number]> = {
  entrance: [0, 1.7, 0],
  about: [-18, 1.7, 11],
  projects: [0, 1.7, 22],
  career: [18, 1.7, 11],
  contact: [0, 1.7, 35.5],
};

export function useDeepLink() {
  const setCurrentWing = useGalleryStore((s) => s.setCurrentWing);
  const setSpawnPosition = useGalleryStore((s) => s.setSpawnPosition);

  // 초기 해시로부터 스폰 위치 결정
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && sectionPositions[hash]) {
      setCurrentWing(hash);
      setSpawnPosition(sectionPositions[hash]);
    }
  }, [setCurrentWing, setSpawnPosition]);

  // 섹션 변경 시 URL 해시 업데이트
  useEffect(() => {
    const unsub = useGalleryStore.subscribe((state) => {
      if (state.currentWing) {
        window.history.replaceState(null, '', `#${state.currentWing}`);
      }
    });
    return unsub;
  }, []);
}

export { sectionPositions };
