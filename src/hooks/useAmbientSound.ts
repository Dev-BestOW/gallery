import { useEffect, useRef } from 'react';
import { useGalleryStore } from '../stores/useGalleryStore';

export function useAmbientSound() {
  const hasEntered = useGalleryStore((s) => s.hasEntered);
  const ctxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  useEffect(() => {
    if (!hasEntered) return;

    try {
      const ctx = new AudioContext();
      ctxRef.current = ctx;

      const gain = ctx.createGain();
      gain.gain.value = 0;
      gain.connect(ctx.destination);
      gainRef.current = gain;

      // Generate soft ambient drone
      const duration = 8;
      const sampleRate = ctx.sampleRate;
      const buffer = ctx.createBuffer(2, sampleRate * duration, sampleRate);

      for (let ch = 0; ch < 2; ch++) {
        const data = buffer.getChannelData(ch);
        for (let i = 0; i < data.length; i++) {
          const t = i / sampleRate;
          // Soft pad sound with multiple sine waves
          data[i] =
            Math.sin(2 * Math.PI * 55 * t) * 0.02 +
            Math.sin(2 * Math.PI * 82.5 * t) * 0.015 +
            Math.sin(2 * Math.PI * 110 * t) * 0.01 +
            (Math.random() - 0.5) * 0.005; // slight noise
          // Smooth envelope
          const env = Math.sin((Math.PI * t) / duration);
          data[i] *= env;
        }
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      source.connect(gain);
      source.start();
      sourceRef.current = source;

      // Fade in
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 3);
    } catch {
      // Audio not available
    }

    return () => {
      if (sourceRef.current) {
        try { sourceRef.current.stop(); } catch { /* */ }
      }
      if (ctxRef.current) {
        ctxRef.current.close();
      }
    };
  }, [hasEntered]);
}
