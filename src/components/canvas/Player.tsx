import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RigidBody, CapsuleCollider } from '@react-three/rapier';
import type { RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { PointerLockControls } from '@react-three/drei';
import { usePlayerControls } from '../../hooks/usePlayerControls';
import { PLAYER } from '../../constants/gallery';
import { useGalleryStore } from '../../stores/useGalleryStore';

export default function Player() {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();
  const keys = usePlayerControls();
  const isLocked = useGalleryStore((s) => s.isLocked);
  const setIsPointerLocked = useGalleryStore((s) => s.setIsPointerLocked);

  const direction = useRef(new THREE.Vector3());
  const frontVector = useRef(new THREE.Vector3());
  const sideVector = useRef(new THREE.Vector3());

  useFrame(() => {
    if (!rigidBodyRef.current || isLocked) return;

    const speed = keys.sprint ? PLAYER.sprintSpeed : PLAYER.speed;

    // 이동 방향 계산
    frontVector.current.set(0, 0, (keys.backward ? 1 : 0) - (keys.forward ? 1 : 0));
    sideVector.current.set((keys.left ? 1 : 0) - (keys.right ? 1 : 0), 0, 0);

    direction.current
      .subVectors(frontVector.current, sideVector.current)
      .normalize()
      .multiplyScalar(speed)
      .applyEuler(camera.rotation);

    // Y축 속도는 중력 유지
    const currentVel = rigidBodyRef.current.linvel();
    rigidBodyRef.current.setLinvel(
      { x: direction.current.x, y: currentVel.y, z: direction.current.z },
      true,
    );

    // 카메라를 rigid body 위치로 동기화
    const pos = rigidBodyRef.current.translation();
    camera.position.set(pos.x, pos.y + PLAYER.height / 2, pos.z);
  });

  return (
    <>
      <RigidBody
        ref={rigidBodyRef}
        type="dynamic"
        position={[0, PLAYER.height, 0]}
        enabledRotations={[false, false, false]}
        linearDamping={5}
        mass={70}
        lockRotations
      >
        <CapsuleCollider args={[PLAYER.height / 2 - PLAYER.radius, PLAYER.radius]} />
      </RigidBody>
      <PointerLockControls
        ref={controlsRef}
        onLock={() => setIsPointerLocked(true)}
        onUnlock={() => setIsPointerLocked(false)}
      />
    </>
  );
}
