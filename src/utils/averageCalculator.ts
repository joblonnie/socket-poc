export const calculateAverage = (values: number[]): number => {
  if (values.length === 0) return 0;
  const sum = values.reduce((acc, val) => acc + val, 0);
  return Math.round((sum / values.length) * 100) / 100; // 소수점 둘째 자리까지
};

export const formatLatency = (ms: number): string => {
  return `${ms.toFixed(2)}ms`;
};

export const formatSize = (kb: number): string => {
  return `${kb.toFixed(2)}KB`;
};
