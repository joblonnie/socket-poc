import { useState } from "react";

export function useResolution() {
  const [resolution, setResolution] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const updateResolution = (img: HTMLImageElement) => {
    setResolution({
      width: img.naturalWidth,
      height: img.naturalHeight,
    });
  };

  return { resolution, updateResolution };
}
