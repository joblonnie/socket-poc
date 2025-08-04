// useWebSocketReceiverBinary.ts
import { useEffect, useRef } from "react";
import useBinaryImageStore from "../store/useBinaryStore"; // Base64용 store가 아님!
import dayjs from "dayjs";

export const useWebSocketReceiverBinary = (url: string) => {
  const socketRef = useRef<WebSocket | null>(null);
  const setBinaryData = useBinaryImageStore((state) => state.setBinaryData); // 이 store는 binary 전용

  useEffect(() => {
    const socket = new WebSocket(url);
    socket.binaryType = "arraybuffer"; // 수신 포맷 지정
    socketRef.current = socket;

    socket.onopen = () => console.log("WebSocket (Binary) connected");

    socket.onmessage = (e: MessageEvent<ArrayBuffer>) => {
      // const receiveTime = dayjs().valueOf();

      setBinaryData(e.data);
    };

    socket.onerror = (err) => console.error("WebSocket error:", err);
    socket.onclose = () => console.log("WebSocket closed");

    return () => {
      socket.close();
      socketRef.current = null;
    };
  }, [url]);
};
