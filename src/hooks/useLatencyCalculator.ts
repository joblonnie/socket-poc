import { useState } from "react";

export const useLatencyCalculator = () => {
  const [latencySec, setLatencySec] = useState<number | null>(null);

  const calculateLatency = (receivedTime: number, renderTime: number) => {
    const latency = renderTime - receivedTime;
    setLatencySec(latency / 1000);
  };

  return { latencySec, calculateLatency };
};
