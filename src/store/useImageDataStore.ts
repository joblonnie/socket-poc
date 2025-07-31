import { create } from "zustand";
import { WebSocketMessage } from "../hooks/useWebSocket";

type State = {
  data: Pick<WebSocketMessage, "image" | "timestamp"> & {
    receiveTime: number;
  };
};

type Actions = {
  setImageData: (
    data: Pick<WebSocketMessage, "image" | "timestamp"> & {
      receiveTime: number;
    }
  ) => void;
};

type Store = State & Actions;

const useImageDataStore = create<Store>((set) => ({
  data: {
    image: "",
    timestamp: 0,
    receiveTime: 0,
  },
  setImageData: (data) =>
    set((state) => ({
      data: {
        ...state.data,
        ...data,
      },
    })),
}));

export default useImageDataStore;
