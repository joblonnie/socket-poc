import { useState } from "react";

export function useLatency() {
  const [latency, setLatency] = useState<number | null>(null);

  const calculateLatency = (timestamp: number, renderTimeSec: number) => {
    const nowEpoch = Date.now();
    const renderStartEpoch = nowEpoch - renderTimeSec * 1000;

    const timestampMs = timestamp < 1e12 ? timestamp * 1000 : timestamp;
    const latencyMs = renderTimeSec * 1000 - (timestampMs - renderStartEpoch);
    setLatency(latencyMs / 1000);
  };

  return { latency, calculateLatency };
}
