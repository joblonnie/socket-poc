import { useEffect, useRef } from "react";

const objectURLCache = new Map<string, string>();

export function useObjectURL(base64: string, mimeType = "image/jpeg") {
  const urlRef = useRef<string | null>(null);

  if (!objectURLCache.has(base64)) {
    const byteString = atob(base64);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([uint8Array], { type: mimeType });
    const objectURL = URL.createObjectURL(blob);
    objectURLCache.set(base64, objectURL);
  }

  urlRef.current = objectURLCache.get(base64)!;

  // 클린업 (선택적으로 revokeObjectURL 적용 가능)
  useEffect(() => {
    const currentUrl = urlRef.current;

    return () => {
      URL.revokeObjectURL(currentUrl!); // 수동 정리 원할 경우 활성화
    };
  }, [base64]);

  return urlRef.current;
}
