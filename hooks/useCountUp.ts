import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'react-native-reanimated';

/**
 * Counts an integer up from zero to `target` over `duration` ms with an
 * ease-out curve, driven by requestAnimationFrame (no extra dependencies).
 * Respects the system reduce-motion setting by jumping straight to the target.
 */
export function useCountUp(target: number, duration = 1000): number {
  const reducedMotion = useReducedMotion();
  const [value, setValue] = useState(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (reducedMotion || target === 0) {
      frameRef.current = requestAnimationFrame(() => setValue(target));
      return () => {
        if (frameRef.current !== null) {
          cancelAnimationFrame(frameRef.current);
        }
      };
    }

    let startTime: number | null = null;

    const tick = (now: number) => {
      if (startTime === null) {
        startTime = now;
      }
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      }
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [target, duration, reducedMotion]);

  return value;
}
