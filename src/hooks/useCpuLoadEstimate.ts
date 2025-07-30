import { useEffect, useRef, useState } from "react";

export function useCpuLoadEstimate() {
  const [load, setLoad] = useState(0);
  const lastTimeRef = useRef(performance.now());
  const busyTimeRef = useRef(0);

  useEffect(() => {
    let frameId: number;

    function measure(timestamp: number) {
      const now = performance.now();
      const elapsed = now - lastTimeRef.current;

      // busyTime 측정 (실제 작업하는 데 걸린 시간 추정)
      busyTimeRef.current += elapsed;
      lastTimeRef.current = now;

      // CPU 부하 추정치 = busyTime / elapsed * 100 (단순 추정)
      const loadPercent = Math.min(100, (busyTimeRef.current / elapsed) * 100);

      setLoad(loadPercent);

      busyTimeRef.current = 0;
      frameId = requestAnimationFrame(measure);
    }

    frameId = requestAnimationFrame(measure);

    return () => cancelAnimationFrame(frameId);
  }, []);

  return load;
}
