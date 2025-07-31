import dayjs from "dayjs";
import CommonImageRenderer from "../widgets/CommonImageRenderer";
import { WebSocketMessage } from "../../hooks/useWebSocket";
import { useEffect, useRef, useState } from "react";

const canvasRenderMethod = (
  base64: string,
  onLoad: (img: HTMLImageElement, renderTime: number) => void
) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      onLoad(img, dayjs().valueOf());
    };

    img.onerror = () => {
      console.error("이미지 로딩 실패");
    };

    img.src = `data:image/jpeg;base64,${base64}`;
  }, [base64]);

  return <canvas ref={canvasRef} style={{ width: "300px", height: "auto" }} />;
};

type Props = {
  imageData: Pick<WebSocketMessage, "image" | "timestamp"> & {
    receiveTime: number;
  };
};

const CanvasBase64ImageRenderer = ({ imageData }: Props) => {
  return (
    <CommonImageRenderer
      title="Canvas WebSocket Image Stream"
      imageData={imageData}
      renderMethod={canvasRenderMethod}
    />
  );
};

export default CanvasBase64ImageRenderer;
