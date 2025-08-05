import { useEffect, useRef, useState, useCallback } from "react";

interface OffscreenCanvasHookResult {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  isReady: boolean;
  renderImage: (imageData: string | ArrayBuffer, mimeType?: string) => void;
  isProcessing: boolean;
  lastRenderTime: number | null;
  processingStats: {
    blobCreation: number;
    imageLoad: number;
    rendering: number;
    total: number;
  } | null;
  imageProcessingResult: {
    avgBrightness: number;
    processingTime: number;
    pixelsAnalyzed: number;
  } | null;
  error: string | null;
}

export const useOffscreenCanvas = (): OffscreenCanvasHookResult => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const workerRef = useRef<Worker | null>(null);

  const [isReady, setIsReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // isProcessing 상태 변경 로깅
  useEffect(() => {
    console.log("[OffscreenCanvas] isProcessing changed:", isProcessing);
  }, [isProcessing]);
  const [lastRenderTime, setLastRenderTime] = useState<number | null>(null);
  const [processingStats, setProcessingStats] = useState<{
    blobCreation: number;
    imageLoad: number;
    rendering: number;
    total: number;
  } | null>(null);
  const [imageProcessingResult, setImageProcessingResult] = useState<{
    avgBrightness: number;
    processingTime: number;
    pixelsAnalyzed: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // WebWorker 초기화
  useEffect(() => {
    if (!canvasRef.current) return;

    // 이미 초기화된 경우 건너뛰기
    if (workerRef.current) return;

    const initializeWorker = async () => {
      try {
        console.log("[OffscreenCanvas] Initializing WebWorker...");

        const canvas = canvasRef.current;
        if (!canvas) return;

        // OffscreenCanvas 지원 확인
        if (!canvas.transferControlToOffscreen) {
          throw new Error("OffscreenCanvas is not supported in this browser");
        }

        // WebWorker 지원 확인
        if (typeof Worker === "undefined") {
          throw new Error("WebWorker is not supported in this browser");
        }

        // WebWorker 생성
        workerRef.current = new Worker("/offscreen-canvas-worker.js");

        // Worker 메시지 리스너 설정
        workerRef.current.onmessage = (event) => {
          const { type, data, timing, error } = event.data;

          switch (type) {
            case "CANVAS_READY":
              if (data?.success) {
                console.log("[OffscreenCanvas] Canvas ready");
              } else {
                setError("Canvas 초기화 실패");
              }
              break;

            case "RENDER_COMPLETE":
              // 타임아웃 클리어
              if ((workerRef.current as any)?._currentTimeoutId) {
                clearTimeout((workerRef.current as any)._currentTimeoutId);
                (workerRef.current as any)._currentTimeoutId = null;
              }

              setIsProcessing(false);
              setLastRenderTime(performance.now());

              if (timing) {
                setProcessingStats({
                  blobCreation: timing.blobCreation,
                  imageLoad: timing.imageLoad,
                  rendering: timing.rendering,
                  total: timing.total,
                });
              }

              console.log("[OffscreenCanvas] Render completed:", event.data);
              break;

            case "RENDER_ERROR":
              // 타임아웃 클리어
              if ((workerRef.current as any)?._currentTimeoutId) {
                clearTimeout((workerRef.current as any)._currentTimeoutId);
                (workerRef.current as any)._currentTimeoutId = null;
              }

              setIsProcessing(false);
              setError(error || "렌더링 오류 발생");
              console.error("[OffscreenCanvas] Render error:", error);
              break;

            default:
              console.log("[OffscreenCanvas] Unknown message type:", type);
          }
        };

        // 에러 핸들러 설정
        workerRef.current.onerror = (error) => {
          console.error("[OffscreenCanvas] Worker error:", error);
          setError("WebWorker 오류 발생");
          setIsProcessing(false);
        };

        // Canvas 준비 및 OffscreenCanvas 생성
        try {
          // Canvas가 DOM에 완전히 마운트되었는지 확인
          if (!canvas.parentNode) {
            throw new Error("Canvas is not mounted in DOM");
          }

          // Canvas에 기본 크기 설정
          canvas.width = 200;
          canvas.height = 150;

          // 잠시 기다려서 Canvas가 완전히 준비되도록 함
          await new Promise((resolve) => setTimeout(resolve, 50));

          const offscreen = canvas.transferControlToOffscreen();
          console.log(
            "[OffscreenCanvas] Successfully transferred control to offscreen"
          );

          // 초기 설정 메시지 전송
          workerRef.current.postMessage(
            {
              type: "INIT_CANVAS",
              data: {
                canvas: offscreen,
                width: 200,
                height: 150,
              },
            },
            [offscreen]
          );

          setIsReady(true);
          setError(null);
          console.log("[OffscreenCanvas] WebWorker initialized successfully");
        } catch (transferError) {
          console.error(
            "[OffscreenCanvas] Failed to transfer control:",
            transferError
          );
          throw new Error(
            `Canvas control transfer failed: ${
              transferError instanceof Error
                ? transferError.message
                : "Unknown error"
            }`
          );
        }
      } catch (error) {
        console.error(
          "[OffscreenCanvas] Failed to initialize WebWorker:",
          error
        );
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        setError(`초기화 실패: ${errorMessage}`);
        setIsReady(false);
      }
    };

    // DOM이 완전히 준비될 때까지 더 긴 지연 시간
    const timeoutId = setTimeout(initializeWorker, 200);

    return () => {
      clearTimeout(timeoutId);
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
      setIsReady(false);
    };
  }, []); // 빈 의존성 배열로 한 번만 실행

  // 이미지 렌더링 함수
  const renderImage = useCallback(
    (imageData: string | ArrayBuffer, mimeType: string = "image/jpeg") => {
      if (!workerRef.current || !isReady || isProcessing) {
        console.warn(
          "[OffscreenCanvas] Cannot render - worker not ready or already processing"
        );
        return;
      }

      setIsProcessing(true);
      setError(null);

      console.log("[OffscreenCanvas] Sending render request to worker");

      // 타임아웃 설정 (5초 후 자동으로 processing 상태 해제)
      const timeoutId = setTimeout(() => {
        console.warn(
          "[OffscreenCanvas] Render timeout, resetting processing state"
        );
        setIsProcessing(false);
        setError("렌더링 타임아웃 (5초)");
      }, 5000);

      workerRef.current.postMessage({
        type: "RENDER_IMAGE",
        data: {
          imageData,
          mimeType,
        },
      });

      // 타임아웃 ID를 worker ref에 저장
      if (workerRef.current) {
        (workerRef.current as any)._currentTimeoutId = timeoutId;
      }
    },
    [isReady, isProcessing]
  );

  return {
    canvasRef,
    isReady,
    renderImage,
    isProcessing,
    lastRenderTime,
    processingStats,
    imageProcessingResult,
    error,
  };
};
