import { useEffect, useRef, useState } from "react";

export function useObjectURLNoCache(
  data: string | ArrayBuffer,
  mimeType = "image/jpeg"
) {
  const [objectURL, setObjectURL] = useState<string | undefined>(undefined);
  const previousUrlRef = useRef<string | null>(null);

  useEffect(() => {
    // 기존 URL 해제
    if (previousUrlRef.current) {
      URL.revokeObjectURL(previousUrlRef.current);
    }

    let blob: Blob;

    if (typeof data === "string") {
      const byteString = atob(data);
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const uint8Array = new Uint8Array(arrayBuffer);

      for (let i = 0; i < byteString.length; i++) {
        uint8Array[i] = byteString.charCodeAt(i);
      }

      blob = new Blob([uint8Array], { type: mimeType });
    } else {
      blob = new Blob([data], { type: mimeType });
    }

    const url = URL.createObjectURL(blob);
    setObjectURL(url);
    previousUrlRef.current = url;

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [data, mimeType]);

  return objectURL;
}
