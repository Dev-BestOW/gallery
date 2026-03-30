import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

let audioCtx: AudioContext | null = null;

export function getSharedAudioContext() {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
}

function playFootstep() {
  try {
    const ctx = getSharedAudioContext();
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    filter.type = 'lowpass';
    filter.frequency.value = 150 + Math.random() * 100;

    osc.type = 'triangle';
    osc.frequency.value = 60 + Math.random() * 40;

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.15);
  } catch {
    // Audio not available
  }
}

export function useFootsteps() {
  const { camera } = useThree();
  const lastPos = useRef(new THREE.Vector3());
  const distAccum = useRef(0);
  const STEP_INTERVAL = 2.2; // meters per step

  useFrame(() => {
    const dist = camera.position.distanceTo(lastPos.current);

    // Only count horizontal movement
    const dx = camera.position.x - lastPos.current.x;
    const dz = camera.position.z - lastPos.current.z;
    const horizDist = Math.sqrt(dx * dx + dz * dz);

    lastPos.current.copy(camera.position);

    if (horizDist > 0.01 && horizDist < 1) {
      distAccum.current += horizDist;
      if (distAccum.current >= STEP_INTERVAL) {
        distAccum.current = 0;
        playFootstep();
      }
    }
  });
}
