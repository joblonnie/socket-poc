import { useState, useRef } from "react";

export const useImageSizeTracker = () => {
  const [sizes, setSizes] = useState<number[]>([]);
  const prevSizeRef = useRef<number | null>(null);

  const addSize = (size: number) => {
    if (prevSizeRef.current !== size) {
      setSizes((prev) => [...prev.slice(-99), size]); // 최근 100개만 유지
      prevSizeRef.current = size;
    }
  };

  return { sizes, addSize };
};

export default useImageSizeTracker;
