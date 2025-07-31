import dayjs from "dayjs";
import CommonImageRenderer from "../widgets/CommonImageRenderer";
import { WebSocketMessage } from "../../hooks/useWebSocket";

const simpleRenderMethod = (
  base64: string,
  onLoad: (img: HTMLImageElement, renderTime: number) => void
) => {
  const src = `data:image/jpeg;base64,${base64}`;

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    onLoad(e.currentTarget, dayjs().valueOf());
  };

  return (
    <img
      src={src}
      alt="WebSocket Stream"
      style={{ width: "300px", height: "auto" }}
      onLoad={handleLoad}
    />
  );
};

type Props = {
  imageData: Pick<WebSocketMessage, "image" | "timestamp"> & {
    receiveTime: number;
  };
};

const PureBase64ImageRenderer = ({ imageData }: Props) => {
  return (
    <CommonImageRenderer
      title="Pure Base64 WebSocket Image Stream"
      imageData={imageData}
      renderMethod={simpleRenderMethod}
    />
  );
};

export default PureBase64ImageRenderer;
