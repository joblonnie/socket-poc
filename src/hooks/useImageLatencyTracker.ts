import { useRef, useState } from "react";

export const useImageLatencyTracker = () => {
  const startRef = useRef<number>(0);
  const [latencies, setLatencies] = useState<number[]>([]);

  const start = () => {
    startRef.current = performance.now();
  };

  const end = () => {
    const latency = performance.now() - startRef.current;
    setLatencies((prev) => [...prev.slice(-99), latency]); // 최근 100개만 유지
  };

  return { latencies, start, end };
};
export default useImageLatencyTracker;
