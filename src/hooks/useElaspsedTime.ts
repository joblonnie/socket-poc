import { useEffect, useRef, useState } from "react";

export const useElapsedTime = () => {
  const [elapsedSec, setElapsedSec] = useState(0);
  const [started, setStarted] = useState(false);
  const startTimeRef = useRef<number | null>(null);

  const start = () => {
    if (!started) {
      startTimeRef.current = Date.now();
      setStarted(true);
    }
  };

  useEffect(() => {
    if (!started || startTimeRef.current === null) return;

    const interval = setInterval(() => {
      const now = Date.now();
      setElapsedSec(Math.floor((now - startTimeRef.current!) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [started]);

  return { elapsedSec, start };
};
