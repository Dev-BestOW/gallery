import { useEffect, useRef } from 'react';
import { useGalleryStore } from '../stores/useGalleryStore';
import { getSharedAudioContext } from '../utils/audioContext';

export function useAmbientSound() {
  const hasEntered = useGalleryStore((s) => s.hasEntered);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  useEffect(() => {
    if (!hasEntered) return;

    try {
      const ctx = getSharedAudioContext();
      if (ctx.state === 'suspended') ctx.resume();

      const gain = ctx.createGain();
      gain.gain.value = 0;
      gain.connect(ctx.destination);
      gainRef.current = gain;

      // Generate soft ambient drone (constant amplitude, no envelope)
      const duration = 8;
      const sampleRate = ctx.sampleRate;
      const buffer = ctx.createBuffer(2, sampleRate * duration, sampleRate);

      for (let ch = 0; ch < 2; ch++) {
        const data = buffer.getChannelData(ch);
        for (let i = 0; i < data.length; i++) {
          const t = i / sampleRate;
          data[i] =
            Math.sin(2 * Math.PI * 55 * t) * 0.02 +
            Math.sin(2 * Math.PI * 82.5 * t) * 0.015 +
            Math.sin(2 * Math.PI * 110 * t) * 0.01 +
            (Math.random() - 0.5) * 0.005;
        }
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      source.connect(gain);
      source.start();
      sourceRef.current = source;

      // Fade in via GainNode only
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 3);
    } catch {
      // Audio not available
    }

    return () => {
      if (sourceRef.current) {
        try { sourceRef.current.stop(); } catch { /* */ }
      }
      if (gainRef.current) {
        gainRef.current.disconnect();
      }
    };
  }, [hasEntered]);
}
