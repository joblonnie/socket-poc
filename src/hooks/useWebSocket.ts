import { useEffect, useRef } from "react";
import useImageDataStore from "../store/useImageDataStore";

export interface WebSocketMessage {
  agentIp: string;
  cameraId: number;
  currentTime: number;
  debug: any[];
  image: string;
  isRtsp: boolean;
  originHeight: number;
  originWidth: number;
  resizedHeight: number;
  resizedWidth: number;
  results: Record<string, unknown>;
  timestamp: number; // Unix timestamp (ms
  totalSeconds: number;
}

export const useWebSocketReceiver = (url: string) => {
  const socketRef = useRef<WebSocket | null>(null);
  const lastMessageRef = useRef<string | null>(null);

  const setImageData = useImageDataStore((state) => state.setImageData);

  useEffect(() => {
    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket connection established");
    };

    socket.onmessage = (e: MessageEvent<string>) => {
      const message: WebSocketMessage = JSON.parse(e.data);

      lastMessageRef.current = message.image;
      setImageData({
        image: message.image,
        timestamp: message.timestamp,
      });
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      socket.close();
      socketRef.current = null;
    };
  }, [url]);

  const getLastMessage = () => lastMessageRef.current;

  return {
    getLastMessage,
  };
};
