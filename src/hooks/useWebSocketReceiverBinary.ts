import { useEffect, useRef } from "react";
import useBinaryImageStore from "../store/useBinaryStore";

export const useWebSocketReceiverBinary = (url: string | null) => {
  const socketRef = useRef<WebSocket | null>(null);
  const setBinaryData = useBinaryImageStore((state) => state.setBinaryData);
  const lastUpdateRef = useRef<number>(0);
  const updateIntervalRef = useRef<number>(100); // 100ms 최소 간격
  const messageCountRef = useRef<number>(0);
  const droppedCountRef = useRef<number>(0);

  useEffect(() => {
    if (!url) return;

    const socket = new WebSocket(url);
    socket.binaryType = "arraybuffer"; // 수신 포맷 지정
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket (Binary) connected");
      messageCountRef.current = 0;
      droppedCountRef.current = 0;
    };

    socket.onmessage = (e: MessageEvent<ArrayBuffer>) => {
      messageCountRef.current++;
      const now = performance.now();

      // Rate limiting: 100ms 간격으로만 업데이트
      if (now - lastUpdateRef.current < updateIntervalRef.current) {
        droppedCountRef.current++;
        if (droppedCountRef.current % 10 === 0) {
          console.log(
            `[Binary] Dropped ${droppedCountRef.current} messages, processed ${
              messageCountRef.current - droppedCountRef.current
            }`
          );
        }
        return; // 너무 빠른 업데이트 무시
      }

      setBinaryData(e.data);
      lastUpdateRef.current = now;
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
