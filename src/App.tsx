import { useEffect, useState } from "react";
import ImageRenderer from "./components/PureBase64ImageRenderer";
import { useWebSocketReceiver } from "./hooks/useWebSocket";
import useImageDataStore from "./store/useImageDataStore";

function App() {
  useWebSocketReceiver(import.meta.env.VITE_WS_URL);

  const image = useImageDataStore((state) => state.image);

  return <div>{image && <ImageRenderer image={image} />}</div>;
}

export default App;
