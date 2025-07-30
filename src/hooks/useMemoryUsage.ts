import { useEffect, useState } from "react";

export function useMemoryUsage() {
  const [memory, setMemory] = useState<{ used: number; total: number } | null>(
    null
  );

  useEffect(() => {
    const update = () => {
      if ((performance as any).memory) {
        const mem = (performance as any).memory;
        setMemory({
          used: mem.usedJSHeapSize / 1024 / 1024,
          total: mem.totalJSHeapSize / 1024 / 1024,
        });
      }
    };

    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return memory;
}
