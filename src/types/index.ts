export interface WebSocketMessage<ImageType> {
  agentIp: string;
  cameraId: number;
  currentTime: number;
  debug: any[];
  image: ImageType;
  isRtsp: boolean;
  originHeight: number;
  originWidth: number;
  resizedHeight: number;
  resizedWidth: number;
  results: Record<string, unknown>;
  timestamp: number; // Unix timestamp (ms)
  totalSeconds: number;
}

export type Base64WebSocketImageData = Pick<WebSocketMessage<string>, "image">;
