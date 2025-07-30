import { useState } from "react";

export function useRenderTime() {
  const [renderTime, setRenderTime] = useState<number | null>(null);

  const updateRenderTime = (performanceNow: number) => {
    // performanceNow는 performance.now() 기준 밀리초
    setRenderTime(performanceNow / 1000); // 초 단위 변환
  };

  return { renderTime, updateRenderTime };
}
