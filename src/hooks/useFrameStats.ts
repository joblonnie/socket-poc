import { useEffect, useRef, useState } from "react";

export const useFrameStats = () => {
  const [fps, setFps] = useState(0);
  const [totalFrames, setTotalFrames] = useState(0);
  const [droppedFrames, setDroppedFrames] = useState(0);

  const frameCount = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const received = frameCount.current;
      const dropped = Math.max(fps - received, 0);

      setFps(received);
      setDroppedFrames((prev) => prev + dropped);
      setTotalFrames((prev) => prev + received);

      frameCount.current = 0;
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const countFrame = () => {
    frameCount.current += 1;
  };

  const dropRate =
    totalFrames + droppedFrames > 0
      ? (droppedFrames / (totalFrames + droppedFrames)) * 100
      : 0;

  return {
    fps,
    totalFrames,
    droppedFrames,
    dropRate,
    countFrame,
  };
};
