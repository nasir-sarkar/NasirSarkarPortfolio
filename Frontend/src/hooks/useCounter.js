import { useState, useEffect } from "react";

export function useCounter(target, isDecimal = false, started) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!started) return;

    const safeTarget = Number(target || 0);

    const duration = 1000; 
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const currentValue = safeTarget * progress;

      setValue(
        isDecimal
          ? Number(currentValue.toFixed(2))
          : Math.floor(currentValue)
      );

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [started, target, isDecimal]);

  return value;
}