import React, { useEffect, useState } from "react";
import { useOffscreenCanvas } from "../../hooks/useOffscreenCanvas";
import useBinaryStore from "../../store/useBinaryStore";
import useImageLatencyTracker from "../../hooks/useImageLatencyTracker";
import { useImageSizeTracker } from "../../hooks/useImageSizeTracker";
import ImageRendererView from "../ui/ImageRendererView";
import FallbackCanvasBinaryRenderer from "./FallbackCanvasBinaryRenderer";

type Props = {
  onLatencyUpdate?: (latencies: number[]) => void;
  onImageSizeUpdate?: (size: number[]) => void;
};

const OffscreenCanvasBinaryRenderer: React.FC<Props> = ({
  onLatencyUpdate,
  onImageSizeUpdate,
}) => {
  const binaryImageData = useBinaryStore((state) => state.binary);
  const { latencies, start, end } = useImageLatencyTracker();
  const { sizes, addSize } = useImageSizeTracker();
  const [useOffscreenCanvasFeature, setUseOffscreenCanvasFeature] =
    useState(true);

  const {
    canvasRef,
    isReady,
    renderImage,
    isProcessing,
    lastRenderTime,
    processingStats,
    imageProcessingResult,
    error,
  } = useOffscreenCanvas();

  // OffscreenCanvas 지원 확인
  useEffect(() => {
    const checkOffscreenCanvasSupport = () => {
      const testCanvas = document.createElement("canvas");
      const isSupported =
        typeof testCanvas.transferControlToOffscreen === "function" &&
        typeof Worker !== "undefined";

      if (!isSupported) {
        console.warn(
          "[OffscreenCanvas Binary] OffscreenCanvas or WebWorker not supported, using fallback"
        );
        setUseOffscreenCanvasFeature(false);
      }

      return isSupported;
    };

    checkOffscreenCanvasSupport();
  }, []);

  // 에러 발생 시 fallback으로 전환
  useEffect(() => {
    if (error && error.includes("초기화 실패")) {
      console.warn(
        "[OffscreenCanvas Binary] Initialization failed, switching to fallback"
      );
      setUseOffscreenCanvasFeature(false);
    }
  }, [error]);

  // OffscreenCanvas를 사용할 수 없는 경우 Fallback 컴포넌트 사용
  if (!useOffscreenCanvasFeature) {
    return (
      <FallbackCanvasBinaryRenderer
        onLatencyUpdate={onLatencyUpdate}
        onImageSizeUpdate={onImageSizeUpdate}
      />
    );
  }

  // 레이턴시 업데이트
  useEffect(() => {
    if (onLatencyUpdate) {
      onLatencyUpdate(latencies);
    }
  }, [latencies]); // onLatencyUpdate 제거

  // 이미지 크기 업데이트
  useEffect(() => {
    if (onImageSizeUpdate) {
      onImageSizeUpdate(sizes);
    }
  }, [sizes]); // onImageSizeUpdate 제거

  // Binary 데이터 크기 추적
  useEffect(() => {
    if (binaryImageData) {
      const sizeKB = binaryImageData.byteLength / 1024;
      addSize(sizeKB);
    }
  }, [binaryImageData]); // addSize 제거

  // OffscreenCanvas로 이미지 렌더링
  useEffect(() => {
    if (!binaryImageData || !isReady || isProcessing) {
      return;
    }

    console.log(
      "[OffscreenCanvas Binary] Starting render, data length:",
      binaryImageData.byteLength
    );

    // 레이턴시 측정 시작
    start();

    // OffscreenCanvas로 렌더링 (ArrayBuffer를 직접 전달)
    renderImage(binaryImageData, "image/jpeg");
  }, [binaryImageData, isReady, isProcessing]); // renderImage, start 제거

  // 렌더링 완료 시 레이턴시 측정 종료
  useEffect(() => {
    if (lastRenderTime !== null) {
      console.log(
        "[OffscreenCanvas Binary] Render completed, ending latency measurement"
      );
      end();
    }
  }, [lastRenderTime]); // end 제거

  return (
    <div style={{ width: "100%" }}>
      <ImageRendererView
        renderItem={
          <div style={{ position: "relative" }}>
            <canvas
              ref={canvasRef}
              style={{
                width: "200px",
                height: "auto",
                maxHeight: "150px",
                objectFit: "contain",
                border: error ? "2px solid #ff4d4f" : "1px solid #d9d9d9",
                borderRadius: "4px",
              }}
            />

            {/* 상태 표시 오버레이 */}
            {!isReady && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(0,0,0,0.7)",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  borderRadius: "4px",
                }}
              >
                초기화 중...
              </div>
            )}

            {/* {isProcessing && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(255,165,0,0.7)",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  borderRadius: "4px",
                }}
              >
                ⚡ WebWorker 처리 중...
              </div>
            )} */}

            {error && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(255,77,79,0.8)",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "11px",
                  borderRadius: "4px",
                  padding: "4px",
                  textAlign: "center",
                }}
              >
                ❌ {error}
              </div>
            )}
          </div>
        }
      />

      {/* 상세 성능 정보 */}
      {processingStats && (
        <div
          style={{
            marginTop: "8px",
            padding: "6px",
            backgroundColor: "#fff7e6",
            borderRadius: "4px",
            fontSize: "10px",
            color: "#d46b08",
          }}
        >
          <div>
            <strong>OffscreenCanvas 성능 (Binary)</strong>
          </div>
          <div>Blob 생성: {processingStats.blobCreation.toFixed(1)}ms</div>
          <div>이미지 로드: {processingStats.imageLoad.toFixed(1)}ms</div>
          <div>렌더링: {processingStats.rendering.toFixed(1)}ms</div>
          <div>
            <strong>총 시간: {processingStats.total.toFixed(1)}ms</strong>
          </div>
          <div style={{ fontStyle: "italic", marginTop: "2px" }}>
            🚀 메인 스레드 부하 감소
          </div>
        </div>
      )}

      {/* 이미지 분석 결과 */}
      {imageProcessingResult && (
        <div
          style={{
            marginTop: "4px",
            padding: "4px",
            backgroundColor: "#f6ffed",
            borderRadius: "4px",
            fontSize: "9px",
            color: "#52c41a",
          }}
        >
          <div>평균 밝기: {imageProcessingResult.avgBrightness.toFixed(1)}</div>
          <div>
            분석 시간: {imageProcessingResult.processingTime.toFixed(1)}ms
          </div>
          <div>
            분석 픽셀: {imageProcessingResult.pixelsAnalyzed.toLocaleString()}개
          </div>
        </div>
      )}
    </div>
  );
};

export default OffscreenCanvasBinaryRenderer;
