import { useEffect, useRef } from "react";
import useBinaryImageStore from "../store/useBinaryStore";

export const useWebSocketReceiverBinary = (url: string | null) => {
  const socketRef = useRef<WebSocket | null>(null);
  const setBinaryData = useBinaryImageStore((state) => state.setBinaryData);

  useEffect(() => {
    if (!url) return;

    const socket = new WebSocket(url);
    socket.binaryType = "arraybuffer"; // 수신 포맷 지정
    socketRef.current = socket;

    socket.onopen = () => console.log("WebSocket (Binary) connected");

    socket.onmessage = (e: MessageEvent<ArrayBuffer>) => {
      setBinaryData(e.data);
    };

    socket.onerror = (err) => console.error("WebSocket error:", err);
    socket.onclose = () => console.log("WebSocket closed");

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [url]);
};
