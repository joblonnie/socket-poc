import { useRef, useState } from "react";

export function useDroppedFrames() {
  const [droppedFrames, setDroppedFrames] = useState(0);
  const lastFrameTime = useRef<number | null>(null);

  const markFrame = (currentTime: number) => {
    if (lastFrameTime.current !== null) {
      const expectedNextFrameTime = lastFrameTime.current + 16.67; // Assuming ~60 FPS
      if (currentTime > expectedNextFrameTime) {
        const missedFrames = Math.floor(
          (currentTime - expectedNextFrameTime) / 16.67
        );
        setDroppedFrames((prev) => prev + missedFrames);
      }
    }
    lastFrameTime.current = currentTime;
  };

  return { droppedFrames, markFrame };
}
