import { useState, useRef, useCallback } from "react";

export const useImageSizeTracker = () => {
  const [sizes, setSizes] = useState<number[]>([]);
  const prevSizeRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  const addSize = useCallback((size: number) => {
    const now = performance.now();

    // Rate limiting과 중복 방지
    if (prevSizeRef.current === size || now - lastUpdateRef.current < 50) {
      return;
    }

    setSizes((prev) => [...prev.slice(-99), size]); // 최근 100개만 유지
    prevSizeRef.current = size;
    lastUpdateRef.current = now;
  }, []);

  return { sizes, addSize };
};

export default useImageSizeTracker;
