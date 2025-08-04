import { useEffect, useRef } from "react";
import useBase64ImageStore from "../../store/useBase64ImageStore";
import ImageRendererView from "../ui/ImageRendererView";

const CanvasBase64ImageRenderer = () => {
  const base64ImageData = useBase64ImageStore((state) => state.imageData);

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
      // onLoad(img, dayjs().valueOf());
    };

    img.onerror = () => {
      console.error("이미지 로딩 실패");
    };

    img.src = `data:image/jpeg;base64,${base64ImageData || ""}`;
  }, [base64ImageData]);

  return (
    <ImageRendererView
      title={"Base64 WebSocket Image Stream"}
      renderItem={
        <canvas ref={canvasRef} style={{ width: "300px", height: "auto" }} />
      }
      // metrics={[
      //   {
      //     label: "Elapsed Time",
      //     value: elapsedSec,
      //     unit: " s",
      //     description:
      //       "현재 탭에서 이미지 스트리밍을 시작한 이후 경과 시간입니다.",
      //   },
      //   {
      //     label: "FPS",
      //     value: fps,
      //     unit: " fps",
      //     description: "초당 렌더링되는 이미지 프레임 수입니다.",
      //   },
      //   {
      //     label: "Total Frames",
      //     value: totalFrames,
      //     unit: " frames",
      //     description: "총 처리된 이미지 프레임 수입니다.",
      //   },
      //   {
      //     label: "Dropped Frames",
      //     value: droppedFrames,
      //     unit: " frames",
      //     description: "처리되지 않고 누락된 프레임 수입니다.",
      //   },
      //   {
      //     label: "Drop Rate",
      //     value: dropRate,
      //     unit: " %",
      //     description: "전체 프레임 대비 누락된 프레임의 비율입니다.",
      //   },

      //   // {
      //   //   label: "Latency",
      //   //   value: latencySec ?? 0,
      //   //   unit: " s",
      //   //   description: "서버에서 받은 시점부터 렌더링까지의 지연 시간입니다.",
      //   // },
      //   {
      //     label: "Memory Usage",
      //     value: memoryUsage?.used ?? 0,
      //     unit: " MB",
      //     description: "웹페이지가 사용하는 메모리 양입니다.",
      //   },
      //   {
      //     label: "Image Size",
      //     value: imageData.image.length / 1024,
      //     unit: " KB",
      //     description: "Base64 인코딩된 이미지 데이터 크기입니다.",
      //   },
      //   ...(resolution
      //     ? [
      //         {
      //           label: "Resolution",
      //           value: 1,
      //           unit: ` ${resolution.width}x${resolution.height}`,
      //           description: "이미지 해상도 (가로 x 세로 픽셀)",
      //         },
      //       ]
      //     : []),
      // ]}
    />
  );
};

export default CanvasBase64ImageRenderer;
