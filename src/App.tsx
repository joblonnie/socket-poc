import { useWebSocketReceiver } from "./hooks/useWebSocket";
import useImageDataStore from "./store/useImageDataStore";
import PureBase64ImageRenderer from "./components/test-case/PureBase64ImageRenderer";
import ObjectURLImageRenderer from "./components/test-case/ObjectURLImageRenderer";
import CanvasBase64ImageRenderer from "./components/test-case/CanvasBase64ImageRenderer";
import CanvasObjectURLImageRenderer from "./components/test-case/CanvasObjectURLImageRenderer";

function App() {
  useWebSocketReceiver(import.meta.env.VITE_WS_URL);

  const imageData = useImageDataStore((state) => state.data);

  return (
    <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
      {imageData && (
        <>
          <PureBase64ImageRenderer
            imageData={{
              image: imageData.image,
              timestamp: imageData.timestamp,
              receiveTime: imageData.receiveTime,
            }}
          />
          <ObjectURLImageRenderer
            imageData={{
              image: imageData.image,
              timestamp: imageData.timestamp,
              receiveTime: imageData.receiveTime,
            }}
          />
          <CanvasBase64ImageRenderer
            imageData={{
              image: imageData.image,
              timestamp: imageData.timestamp,
              receiveTime: imageData.receiveTime,
            }}
          />
          <CanvasObjectURLImageRenderer
            imageData={{
              image: imageData.image,
              timestamp: imageData.timestamp,
              receiveTime: imageData.receiveTime,
            }}
          />
        </>
      )}
    </div>
  );
}
export default App;
