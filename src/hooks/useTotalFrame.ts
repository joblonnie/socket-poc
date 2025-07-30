import { useRef, useState } from "react";

export function useTotalFrames() {
  const [totalFrames, setTotalFrames] = useState(0);
  const frameCountRef = useRef(0);

  const markFrame = () => {
    frameCountRef.current += 1;
    setTotalFrames((prev) => prev + 1);
  };

  return { totalFrames, markFrame };
}
