import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RigidBody, CapsuleCollider } from '@react-three/rapier';
import type { RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { PointerLockControls } from '@react-three/drei';
import { usePlayerControls } from '../../hooks/usePlayerControls';
import { PLAYER } from '../../constants/gallery';
import { useGalleryStore } from '../../stores/useGalleryStore';
import { joystickState } from '../../utils/joystickRef';
import { checkIsMobile } from '../../hooks/useIsMobile';

export default function Player() {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const { camera } = useThree();
  const keys = usePlayerControls();
  const isLocked = useGalleryStore((s) => s.isLocked);
  const isFocusing = useGalleryStore((s) => s.isFocusing);
  const setIsPointerLocked = useGalleryStore((s) => s.setIsPointerLocked);
  const spawnPosition = useGalleryStore((s) => s.spawnPosition);

  const direction = useRef(new THREE.Vector3());
  const frontVector = useRef(new THREE.Vector3());
  const sideVector = useRef(new THREE.Vector3());
  const euler = useRef(new THREE.Euler(0, 0, 0, 'YXZ'));

  const isMobile = useRef(checkIsMobile());

  // Mobile look: listen for custom event from MobileControls
  useEffect(() => {
    if (!isMobile.current) return;

    const handleLook = (e: Event) => {
      if (useGalleryStore.getState().isLocked) return;
      const { dx, dy } = (e as CustomEvent).detail;
      euler.current.setFromQuaternion(camera.quaternion);
      euler.current.y -= dx * 0.003;
      euler.current.x -= dy * 0.003;
      euler.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, euler.current.x));
      camera.quaternion.setFromEuler(euler.current);
    };

    window.addEventListener('mobile-look', handleLook);
    return () => window.removeEventListener('mobile-look', handleLook);
  }, [camera]);

  useFrame(() => {
    if (!rigidBodyRef.current || isLocked || isFocusing) return;

    const speed = keys.sprint ? PLAYER.sprintSpeed : PLAYER.speed;

    // Keyboard input
    let fz = (keys.backward ? 1 : 0) - (keys.forward ? 1 : 0);
    let sx = (keys.left ? 1 : 0) - (keys.right ? 1 : 0);

    // Mobile joystick input (override if active)
    if (joystickState.active) {
      sx = -joystickState.x;
      fz = joystickState.y;
    }

    frontVector.current.set(0, 0, fz);
    sideVector.current.set(sx, 0, 0);

    direction.current
      .subVectors(frontVector.current, sideVector.current)
      .normalize()
      .multiplyScalar(speed)
      .applyQuaternion(camera.quaternion);

    const currentVel = rigidBodyRef.current.linvel();
    rigidBodyRef.current.setLinvel(
      { x: direction.current.x, y: currentVel.y, z: direction.current.z },
      true,
    );

    const pos = rigidBodyRef.current.translation();
    camera.position.set(pos.x, pos.y + PLAYER.height / 2, pos.z);
  });

  return (
    <>
      <RigidBody
        ref={rigidBodyRef}
        type="dynamic"
        position={spawnPosition || [0, PLAYER.height, 0]}
        enabledRotations={[false, false, false]}
        linearDamping={5}
        mass={70}
        lockRotations
      >
        <CapsuleCollider args={[PLAYER.height / 2 - PLAYER.radius, PLAYER.radius]} />
      </RigidBody>
      {!isMobile.current && (
        <PointerLockControls
          onLock={() => setIsPointerLocked(true)}
          onUnlock={() => setIsPointerLocked(false)}
        />
      )}
    </>
  );
}
