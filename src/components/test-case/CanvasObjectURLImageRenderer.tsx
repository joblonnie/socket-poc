import dayjs from "dayjs";
import CommonImageRenderer from "../widgets/CommonImageRenderer";
import { WebSocketMessage } from "../../hooks/useWebSocket";
import { useEffect, useRef } from "react";
import { useObjectURL } from "../../hooks/useObjectURL";

const CanvasObjectURLRenderMethod = (
  data: string | Uint8Array,
  onLoad: (img: HTMLImageElement, renderTime: number) => void
) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const objectURL = useObjectURL(data);

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

    img.src = objectURL;
  }, [data]);

  return <canvas ref={canvasRef} style={{ width: "300px", height: "auto" }} />;
};

type Props = {
  imageData: Pick<WebSocketMessage, "image" | "timestamp"> & {
    receiveTime: number;
  };
};

const CanvasObjectURLImageRenderer = ({ imageData }: Props) => {
  return (
    <CommonImageRenderer
      title="Canvas Object URL WebSocket Image Stream"
      imageData={imageData}
      renderMethod={CanvasObjectURLRenderMethod}
    />
  );
};

export default CanvasObjectURLImageRenderer;
