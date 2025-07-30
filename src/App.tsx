import { useWebSocketReceiver } from "./hooks/useWebSocket";
import useImageDataStore from "./store/useImageDataStore";
import CommonImageRenderer from "./components/renderer/CommonImageRenderer";

const simpleRenderMethod = (
  base64: string,
  onLoad: (img: HTMLImageElement, renderTime: number) => void
) => {
  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    onLoad(e.currentTarget, performance.now() / 1000);
  };

  return (
    <img
      src={`data:image/jpeg;base64,${base64}`}
      alt="WebSocket Stream"
      style={{ width: "300px", height: "auto" }}
      onLoad={handleLoad}
    />
  );
};

function App() {
  useWebSocketReceiver(import.meta.env.VITE_WS_URL);

  const imageData = useImageDataStore((state) => state.data);

  return (
    <div>
      {imageData && (
        <CommonImageRenderer
          imageData={imageData}
          renderMethod={simpleRenderMethod}
        />
      )}
    </div>
  );
}
export default App;
