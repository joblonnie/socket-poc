import ImageRendererView from "../ImageRendererView";
import { WebSocketMessage } from "../../hooks/useWebSocket";
import { useResolution } from "../../hooks/useResolution";
import { useRenderTime } from "../../hooks/useRenderTime";
import { useLatency } from "../../hooks/useLatency";
import { useFps } from "../../hooks/useFps";

import { useTotalFrames } from "../../hooks/useTotalFrame";
import { useMemoryUsage } from "../../hooks/useMemoryUsage";
import { useCpuLoadEstimate } from "../../hooks/useCpuLoadEstimate";
import { useDroppedFrames } from "../../hooks/useDroppedFrame";

type Props = {
  imageData: Pick<WebSocketMessage, "image" | "timestamp">;
  renderMethod: (
    base64: string,
    onLoad: (img: HTMLImageElement, renderTime: number) => void
  ) => React.ReactNode;
};

const CommonImageRenderer = ({ imageData, renderMethod }: Props) => {
  const { resolution, updateResolution } = useResolution();
  const { renderTime, updateRenderTime } = useRenderTime();
  const { latency, calculateLatency } = useLatency();
  const fps = useFps();
  const droppedFrames = useDroppedFrames();
  const { totalFrames, markFrame } = useTotalFrames();
  const memoryUsage = useMemoryUsage();
  const load = useCpuLoadEstimate();

  const handleLoad = (img: HTMLImageElement, renderTime: number) => {
    markFrame();
    updateResolution(img);
    updateRenderTime(renderTime);
    calculateLatency(imageData.timestamp, renderTime);
  };

  return (
    <ImageRendererView
      title="WebSocket Image Stream"
      renderItem={renderMethod(imageData.image, handleLoad)}
      metrics={[
        {
          label: "FPS",
          value: fps,
          unit: " fps",
          description: "초당 렌더링되는 이미지 프레임 수입니다.",
        },
        {
          label: "Latency",
          value: latency ?? 0,
          unit: " s",
          description: "서버에서 전송된 시점부터 렌더링까지의 지연 시간입니다.",
        },
        {
          label: "TotalFrames",
          value: totalFrames,
          unit: " frames",
          description: "총 처리된 이미지 프레임 수입니다.",
        },
        {
          label: "Dropped Frames",
          value: droppedFrames.droppedFrames,
          unit: " frames",
          description: "처리되지 않고 누락된 프레임 수입니다.",
        },
        {
          label: "Memory Usage",
          value: memoryUsage?.used ?? 0,
          unit: " MB",
          description: "웹페이지가 사용하는 메모리 양입니다.",
        },
        {
          label: "CPU Load",
          value: load ?? 0,
          unit: " %",
          description: "브라우저 탭의 추정 CPU 부하입니다.",
        },
        {
          label: "Image Size",
          value: imageData.image.length / 1024,
          unit: " KB",
          description: "Base64 인코딩된 이미지 데이터 크기입니다.",
        },
        ...(resolution
          ? [
              {
                label: "Resolution",
                value: 1,
                unit: ` ${resolution.width}x${resolution.height}`,
                description: "이미지 해상도 (가로 x 세로 픽셀)",
              },
            ]
          : []),
        ...(renderTime
          ? [
              {
                label: "Render Time",
                value: renderTime,
                unit: " s",
                description: "페이지 로드 기준 렌더링된 상대 시간입니다.",
              },
            ]
          : []),
      ]}
    />
  );
};

export default CommonImageRenderer;
