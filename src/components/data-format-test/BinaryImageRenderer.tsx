import ImageRendererView from "../ui/ImageRendererView";
import useBinaryImageStore from "../../store/useBinaryStore";
import { useEffect } from "react";
import useImageLatencyTracker from "../../hooks/useImageLatencyTracker";
import { useObjectURLNoCache } from "../../hooks/useObjectURLNoCache";
import { useImageSizeTracker } from "../../hooks/useImageSizeTracker";

type Props = {
  onLatencyUpdate: (latencies: number[]) => void;
  onImageSizeUpdate: (size: number[]) => void;
};

const BinaryImageRenderer = ({ onLatencyUpdate, onImageSizeUpdate }: Props) => {
  const binaryImageData = useBinaryImageStore((state) => state.binary);

  const { latencies, start, end } = useImageLatencyTracker();

  const { sizes, addSize } = useImageSizeTracker();

  const objectURL = useObjectURLNoCache(binaryImageData || "", "image/jpeg");

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    end();
  };
  useEffect(() => {
    if (binaryImageData) {
      start();
    }
  }, [binaryImageData]);

  useEffect(() => {
    onLatencyUpdate(latencies);
  }, [latencies, onLatencyUpdate]);

  useEffect(() => {
    if (binaryImageData) {
      const sizeKB = binaryImageData.byteLength / 1024;
      addSize(sizeKB);
    }
  }, [binaryImageData]);

  useEffect(() => {
    if (sizes.length > 0) {
      onImageSizeUpdate(sizes);
    }
  }, [sizes, onImageSizeUpdate]);

  return (
    <ImageRendererView
      title={"Binary WebSocket Image Stream"}
      renderItem={
        <img
          src={objectURL}
          alt="WebSocket Stream"
          style={{ width: "300px", height: "auto" }}
          onLoad={handleLoad}
        />
      }
    />
  );
};

export default BinaryImageRenderer;
