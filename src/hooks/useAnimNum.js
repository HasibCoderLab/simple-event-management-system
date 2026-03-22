import { useState, useEffect } from "react";

/**
 * Smoothly counts from 0 → target whenever `value` changes.
 *
 * @param {number} value    — target number
 * @param {number} duration — animation duration in ms (default 900)
 * @returns {number}        — current display value
 */
export function useAnimNum(value, duration = 900) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const end = Number(value) || 0;
    if (display === end) return;

    let frame       = 0;
    const totalFrames = Math.round((duration / 1000) * 60);

    const timer = setInterval(() => {
      frame++;
      // Ease-out cubic
      const progress = 1 - Math.pow(1 - frame / totalFrames, 3);
      setDisplay(Math.round(progress * end));

      if (frame >= totalFrames) {
        setDisplay(end);
        clearInterval(timer);
      }
    }, 1000 / 60);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration]);

  return display;
}
