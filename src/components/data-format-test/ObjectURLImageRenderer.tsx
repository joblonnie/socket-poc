import dayjs from "dayjs";
import useBase64ImageStore from "../../store/useBase64ImageStore";
import ImageRendererView from "../ui/ImageRendererView";
import { useEffect } from "react";
import useImageLatencyTracker from "../../hooks/useImageLatencyTracker";
import { useImageSizeTracker } from "../../hooks/useImageSizeTracker";
import { useBase64ToObjectURL } from "../../hooks/useBase64ToObjectURL";

type Props = {
  onLatencyUpdate: (latencies: number[]) => void;
  onImageSizeUpdate: (size: number[]) => void;
};

const ObjectURLImageRenderer = ({
  onLatencyUpdate,
  onImageSizeUpdate,
}: Props) => {
  const base64ImageData = useBase64ImageStore((state) => state.imageData);
  const { latencies, start, end } = useImageLatencyTracker();

  const { sizes, addSize } = useImageSizeTracker();

  const objectURL = useBase64ToObjectURL(base64ImageData || null, "image/jpeg");

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    end();
  };

  useEffect(() => {
    if (base64ImageData) {
      start();
    }
  }, [base64ImageData]);

  useEffect(() => {
    onLatencyUpdate(latencies);
  }, [latencies, onLatencyUpdate]);

  useEffect(() => {
    if (base64ImageData) {
      const sizeKB = base64ImageData.length / 1024;
      addSize(sizeKB);
    }
  }, [base64ImageData]);

  useEffect(() => {
    if (sizes.length > 0) {
      onImageSizeUpdate(sizes);
    }
  }, [sizes, onImageSizeUpdate]);

  return (
    <ImageRendererView
      renderItem={
        <img
          src={objectURL}
          alt="WebSocket Stream"
          style={{
            width: "250px",
            height: "auto",
            maxHeight: "200px",
            objectFit: "contain",
          }}
          onLoad={handleLoad}
        />
      }
    />
  );
};

export default ObjectURLImageRenderer;
