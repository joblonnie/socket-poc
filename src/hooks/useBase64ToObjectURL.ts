import { useEffect, useRef, useMemo } from "react";

export function useBase64ToObjectURL(
  base64Data: string | null,
  mimeType = "image/jpeg"
) {
  const previousUrlRef = useRef<string | null>(null);

  // useMemo로 ObjectURL 생성을 메모이제이션
  const objectURL = useMemo(() => {
    if (!base64Data) {
      return undefined;
    }

    // Base64 문자열을 Blob으로 변환
    const byteString = atob(base64Data);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([uint8Array], { type: mimeType });
    const url = URL.createObjectURL(blob);

    return url;
  }, [base64Data, mimeType]);

  // URL 정리를 위한 useEffect
  useEffect(() => {
    // 이전 URL 정리
    if (previousUrlRef.current && previousUrlRef.current !== objectURL) {
      URL.revokeObjectURL(previousUrlRef.current);
    }

    // 현재 URL 저장
    previousUrlRef.current = objectURL || null;

    // cleanup 함수
    return () => {
      if (objectURL) {
        URL.revokeObjectURL(objectURL);
      }
    };
  }, [objectURL]);

  return objectURL;
}
