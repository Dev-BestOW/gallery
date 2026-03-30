import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGalleryStore } from '../stores/useGalleryStore';

const LERP_SPEED = 3;

export function useCameraFocus() {
  const { camera } = useThree();
  const cameraTarget = useGalleryStore((s) => s.cameraTarget);
  const isFocusing = useGalleryStore((s) => s.isFocusing);
  const setIsFocusing = useGalleryStore((s) => s.setIsFocusing);
  const setViewingArtwork = useGalleryStore((s) => s.setViewingArtwork);

  const targetPos = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3());
  const pendingArtwork = useRef<any>(null);

  // Store에서 pending artwork를 가져오기 위한 ref
  const storeRef = useRef(useGalleryStore.getState());
  storeRef.current = useGalleryStore.getState();

  useFrame((_, delta) => {
    if (!isFocusing || !cameraTarget) return;

    targetPos.current.set(...cameraTarget.position);
    targetLookAt.current.set(...cameraTarget.lookAt);

    // 카메라 위치 lerp
    camera.position.lerp(targetPos.current, LERP_SPEED * delta);

    // 카메라가 작품을 바라보도록 lookAt lerp
    const currentLookAt = new THREE.Vector3(0, 0, -1)
      .applyQuaternion(camera.quaternion)
      .add(camera.position);
    currentLookAt.lerp(targetLookAt.current, LERP_SPEED * delta);
    camera.lookAt(currentLookAt);

    // 도착 판정
    const dist = camera.position.distanceTo(targetPos.current);
    if (dist < 0.05) {
      camera.position.copy(targetPos.current);
      camera.lookAt(targetLookAt.current);
      setIsFocusing(false);

      // 포커스 완료 후 상세 패널 표시
      const { viewingArtwork } = storeRef.current;
      if (viewingArtwork) {
        document.exitPointerLock();
      }
    }
  });
}
