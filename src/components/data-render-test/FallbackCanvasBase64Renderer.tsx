import React, { useEffect, useRef } from "react";
import useBase64ImageStore from "../../store/useBase64ImageStore";
import useImageLatencyTracker from "../../hooks/useImageLatencyTracker";
import { useImageSizeTracker } from "../../hooks/useImageSizeTracker";
import ImageRendererView from "../ui/ImageRendererView";

type Props = {
  onLatencyUpdate?: (latencies: number[]) => void;
  onImageSizeUpdate?: (size: number[]) => void;
};

const FallbackCanvasBase64Renderer: React.FC<Props> = ({
  onLatencyUpdate,
  onImageSizeUpdate,
}) => {
  const base64ImageData = useBase64ImageStore((state) => state.imageData);
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

  // Base64 데이터 크기 추적
  useEffect(() => {
    if (base64ImageData) {
      const sizeKB = base64ImageData.length / 1024;
      addSize(sizeKB);
    }
  }, [base64ImageData]); // addSize 제거

  // 일반 Canvas로 이미지 렌더링 (OffscreenCanvas 대체)
  useEffect(() => {
    if (!base64ImageData || !canvasRef.current) {
      return;
    }

    console.log(
      "[Fallback Canvas Base64] Starting render, data length:",
      base64ImageData.length
    );

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      console.error("[Fallback Canvas Base64] Failed to get 2D context");
      return;
    }

    // 레이턴시 측정 시작
    start();

    const img = new Image();

    img.onload = () => {
      try {
        // Canvas 크기를 이미지에 맞게 조정
        canvas.width = img.width;
        canvas.height = img.height;

        // 이미지 그리기
        ctx.drawImage(img, 0, 0);

        console.log("[Fallback Canvas Base64] Image rendered successfully");
        end();
      } catch (error) {
        console.error("[Fallback Canvas Base64] Failed to draw image:", error);
        end();
      }
    };

    img.onerror = () => {
      console.error("[Fallback Canvas Base64] Failed to load image");
      end();
    };

    img.src = base64ImageData;
  }, [base64ImageData]); // start, end 제거

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
                border: "1px solid #fa8c16",
                borderRadius: "4px",
              }}
            />

            <div
              style={{
                position: "absolute",
                bottom: "2px",
                right: "2px",
                backgroundColor: "rgba(250,140,22,0.8)",
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
          backgroundColor: "#fff7e6",
          borderRadius: "4px",
          fontSize: "9px",
          color: "#d46b08",
          textAlign: "center",
        }}
      >
        🔄 일반 Canvas 렌더링 (OffscreenCanvas 미지원)
      </div>
    </div>
  );
};

export default FallbackCanvasBase64Renderer;
