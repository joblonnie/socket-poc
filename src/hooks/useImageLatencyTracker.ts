import { useRef, useState, useCallback } from "react";

export const useImageLatencyTracker = () => {
  const startRef = useRef<number>(0);
  const lastUpdateRef = useRef<number>(0);
  const [latencies, setLatencies] = useState<number[]>([]);

  const start = useCallback(() => {
    startRef.current = performance.now();
  }, []);

  const end = useCallback(() => {
    const now = performance.now();

    // Rate limiting: 50ms 간격으로만 latency 기록
    if (now - lastUpdateRef.current < 50) {
      return;
    }

    const latency = now - startRef.current;
    setLatencies((prev) => [...prev.slice(-99), latency]); // 최근 100개만 유지
    lastUpdateRef.current = now;
  }, []);

  return { latencies, start, end };
};
export default useImageLatencyTracker;
