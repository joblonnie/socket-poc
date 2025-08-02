import { useEffect, useRef } from "react";

const objectURLCacheBase64 = new Map<string, string>();
const objectURLCacheBinary = new WeakMap<Uint8Array, string>();

export function useObjectURL(
  data: string | Uint8Array,
  mimeType = "image/jpeg"
) {
  const urlRef = useRef<string | null>(null);

  if (typeof data === "string") {
    // base64 처리
    if (!objectURLCacheBase64.has(data)) {
      const byteString = atob(data);
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const uint8Array = new Uint8Array(arrayBuffer);

      for (let i = 0; i < byteString.length; i++) {
        uint8Array[i] = byteString.charCodeAt(i);
      }

      const blob = new Blob([uint8Array], { type: mimeType });
      const objectURL = URL.createObjectURL(blob);
      objectURLCacheBase64.set(data, objectURL);
    }

    urlRef.current = objectURLCacheBase64.get(data)!;
  } else {
    // binary 처리
    if (!objectURLCacheBinary.has(data)) {
      const blob = new Blob([data], { type: mimeType });
      const objectURL = URL.createObjectURL(blob);
      objectURLCacheBinary.set(data, objectURL);
    }

    urlRef.current = objectURLCacheBinary.get(data)!;
  }

  useEffect(() => {
    const currentUrl = urlRef.current;

    return () => {
      URL.revokeObjectURL(currentUrl!);

      if (typeof data === "string") {
        objectURLCacheBase64.delete(data);
      } else {
        objectURLCacheBinary.delete(data);
      }
    };
  }, [data]);

  return urlRef.current;
}
