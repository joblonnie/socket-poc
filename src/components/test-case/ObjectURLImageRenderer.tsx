import dayjs from "dayjs";
import CommonImageRenderer from "../widgets/CommonImageRenderer";
import { WebSocketMessage } from "../../hooks/useWebSocket";
import { useObjectURL } from "../../hooks/useObjectURL";

const ObjectURLRenderMethod = (
  data: string | Uint8Array,
  onLoad: (img: HTMLImageElement, renderTime: number) => void
) => {
  const objectURL = useObjectURL(data);

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    onLoad(e.currentTarget, dayjs().valueOf());
  };

  return (
    <img
      src={objectURL}
      alt="WebSocket Stream"
      style={{
        width: "300px",
        height: "auto",
        display: "block",
        margin: "0 auto",
      }}
      onLoad={handleLoad}
    />
  );
};

type Props = {
  imageData: Pick<WebSocketMessage, "image" | "timestamp"> & {
    receiveTime: number;
  };
};

const ObjectURLImageRenderer = ({ imageData }: Props) => {
  return (
    <CommonImageRenderer
      title="Object URL WebSocket Image Stream"
      imageData={imageData}
      renderMethod={ObjectURLRenderMethod}
    />
  );
};

export default ObjectURLImageRenderer;
