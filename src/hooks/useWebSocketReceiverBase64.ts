import { useEffect, useRef } from "react";
import useImageDataStore from "../store/useBase64ImageStore";
import { Base64WebSocketImageData } from "../types";

export const useWebSocketReceiverBase64 = (url: string | null) => {
  const socketRef = useRef<WebSocket | null>(null);
  const setImageData = useImageDataStore((state) => state.setImageData);
  const lastUpdateRef = useRef<number>(0);
  const updateIntervalRef = useRef<number>(100); // 100ms 최소 간격
  const messageCountRef = useRef<number>(0);
  const droppedCountRef = useRef<number>(0);

  useEffect(() => {
    if (!url) return;

    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket (Base64) connected");
      messageCountRef.current = 0;
      droppedCountRef.current = 0;
    };

    socket.onmessage = (e: MessageEvent<string>) => {
      try {
        messageCountRef.current++;
        const now = performance.now();

        // Rate limiting: 100ms 간격으로만 업데이트
        if (now - lastUpdateRef.current < updateIntervalRef.current) {
          droppedCountRef.current++;
          if (droppedCountRef.current % 10 === 0) {
            console.log(
              `[Base64] Dropped ${
                droppedCountRef.current
              } messages, processed ${
                messageCountRef.current - droppedCountRef.current
              }`
            );
          }
          return; // 너무 빠른 업데이트 무시
        }

        const message: Base64WebSocketImageData = JSON.parse(e.data);

        if (typeof message.image === "string") {
          setImageData(message.image);
          lastUpdateRef.current = now;
        }
      } catch (err) {
        console.error("Failed to parse Base64 message", err);
      }
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
