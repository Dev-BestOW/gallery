import { useEffect, useState } from 'react';

interface Keys {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  sprint: boolean;
}

export function usePlayerControls() {
  const [keys, setKeys] = useState<Keys>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    sprint: false,
  });

  useEffect(() => {
    const keyMap: Record<string, keyof Keys> = {
      KeyW: 'forward',
      ArrowUp: 'forward',
      KeyS: 'backward',
      ArrowDown: 'backward',
      KeyA: 'left',
      ArrowLeft: 'left',
      KeyD: 'right',
      ArrowRight: 'right',
      ShiftLeft: 'sprint',
      ShiftRight: 'sprint',
    };

    const handleDown = (e: KeyboardEvent) => {
      const key = keyMap[e.code];
      if (key) setKeys((prev) => ({ ...prev, [key]: true }));
    };

    const handleUp = (e: KeyboardEvent) => {
      const key = keyMap[e.code];
      if (key) setKeys((prev) => ({ ...prev, [key]: false }));
    };

    window.addEventListener('keydown', handleDown);
    window.addEventListener('keyup', handleUp);
    return () => {
      window.removeEventListener('keydown', handleDown);
      window.removeEventListener('keyup', handleUp);
    };
  }, []);

  return keys;
}
