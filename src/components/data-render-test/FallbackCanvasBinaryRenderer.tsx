import React, { useEffect, useRef } from "react";
import useBinaryStore from "../../store/useBinaryStore";
import useImageLatencyTracker from "../../hooks/useImageLatencyTracker";
import { useImageSizeTracker } from "../../hooks/useImageSizeTracker";
import ImageRendererView from "../ui/ImageRendererView";

type Props = {
  onLatencyUpdate?: (latencies: number[]) => void;
  onImageSizeUpdate?: (size: number[]) => void;
};

const FallbackCanvasBinaryRenderer: React.FC<Props> = ({
  onLatencyUpdate,
  onImageSizeUpdate,
}) => {
  const binaryImageData = useBinaryStore((state) => state.binary);
  const { latencies, start, end } = useImageLatencyTracker();
  const { sizes, addSize } = useImageSizeTracker();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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

  // 일반 Canvas로 이미지 렌더링 (OffscreenCanvas 대체)
  useEffect(() => {
    if (!binaryImageData || !canvasRef.current) {
      return;
    }

    console.log(
      "[Fallback Canvas Binary] Starting render, data length:",
      binaryImageData.byteLength
    );

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      console.error("[Fallback Canvas Binary] Failed to get 2D context");
      return;
    }

    // 레이턴시 측정 시작
    start();

    // ArrayBuffer를 Blob으로 변환
    const blob = new Blob([binaryImageData], { type: "image/jpeg" });
    const url = URL.createObjectURL(blob);

    const img = new Image();

    img.onload = () => {
      try {
        // Canvas 크기를 이미지에 맞게 조정
        canvas.width = img.width;
        canvas.height = img.height;

        // 이미지 그리기
        ctx.drawImage(img, 0, 0);

        console.log("[Fallback Canvas Binary] Image rendered successfully");
        end();

        // URL 정리
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error("[Fallback Canvas Binary] Failed to draw image:", error);
        end();
        URL.revokeObjectURL(url);
      }
    };

    img.onerror = () => {
      console.error("[Fallback Canvas Binary] Failed to load image");
      end();
      URL.revokeObjectURL(url);
    };

    img.src = url;
  }, [binaryImageData]); // start, end 제거

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
                border: "1px solid #eb2f96",
                borderRadius: "4px",
              }}
            />

            <div
              style={{
                position: "absolute",
                bottom: "2px",
                right: "2px",
                backgroundColor: "rgba(235,47,150,0.8)",
                color: "white",
                padding: "2px 4px",
                borderRadius: "2px",
                fontSize: "9px",
                fontWeight: "bold",
              }}
            >
              Fallback Canvas
            </div>
          </div>
        }
      />

      <div
        style={{
          marginTop: "4px",
          padding: "4px",
          backgroundColor: "#fff0f6",
          borderRadius: "4px",
          fontSize: "9px",
          color: "#c41d7f",
          textAlign: "center",
        }}
      >
        🔄 일반 Canvas 렌더링 (OffscreenCanvas 미지원)
      </div>
    </div>
  );
};

export default FallbackCanvasBinaryRenderer;
