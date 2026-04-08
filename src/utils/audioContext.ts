// 공유 AudioContext — useFootsteps, useAmbientSound에서 사용
let audioCtx: AudioContext | null = null;

export function getSharedAudioContext() {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
}
