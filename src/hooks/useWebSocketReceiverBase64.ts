// useWebSocketReceiverBase64.ts
import { useEffect, useRef } from "react";
import useImageDataStore from "../store/useBase64ImageStore";
import dayjs from "dayjs";
import { Base64WebSocketImageData, WebSocketMessage } from "../types";

export const useWebSocketReceiverBase64 = (url: string) => {
  const socketRef = useRef<WebSocket | null>(null);
  const setImageData = useImageDataStore((state) => state.setImageData);

  useEffect(() => {
    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.onopen = () => console.log("WebSocket (Base64) connected");

    socket.onmessage = (e: MessageEvent<string>) => {
      try {
        // const receiveTime = dayjs().valueOf();
        const message: Base64WebSocketImageData = JSON.parse(e.data);

        if (typeof message.image === "string") {
          setImageData(message.image);
        }
      } catch (err) {
        console.error("Failed to parse Base64 message", err);
      }
    };

    socket.onerror = (err) => console.error("WebSocket error:", err);
    socket.onclose = () => console.log("WebSocket closed");

    return () => {
      socket.close();
      socketRef.current = null;
    };
  }, [url]);
};
