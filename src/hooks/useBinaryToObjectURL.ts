import { useEffect, useRef, useMemo } from "react";

export function useBinaryToObjectURL(
  binaryData: ArrayBuffer | null,
  mimeType = "image/jpeg"
) {
  const previousUrlRef = useRef<string | null>(null);

  // useMemo로 ObjectURL 생성을 메모이제이션
  const objectURL = useMemo(() => {
    if (!binaryData) {
      return undefined;
    }

    // ArrayBuffer를 직접 Blob으로 변환 (가장 빠른 방법)
    const blob = new Blob([binaryData], { type: mimeType });
    const url = URL.createObjectURL(blob);

    return url;
  }, [binaryData, mimeType]);

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
