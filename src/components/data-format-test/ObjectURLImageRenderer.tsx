import useBase64ImageStore from "../../store/useBase64ImageStore";
import ImageRendererView from "../ui/ImageRendererView";
import { useObjectURL } from "../../hooks/useObjectURL";

const ObjectURLImageRenderer = () => {
  const base64ImageData = useBase64ImageStore((state) => state.imageData);

  const objectURL = useObjectURL(base64ImageData || "");

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {};

  return (
    <ImageRendererView
      title={"Object URL WebSocket Stream"}
      renderItem={
        <img
          src={objectURL}
          alt="Object URL WebSocket Stream"
          style={{ width: "300px", height: "auto" }}
          onLoad={handleLoad}
        />
      }
    />
  );
};

export default ObjectURLImageRenderer;
