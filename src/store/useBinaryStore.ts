// store/useBinaryImageStore.ts
import { create } from "zustand";

interface BinaryImageStore {
  binary: ArrayBuffer | null;
  lastUpdate: number;
  setBinaryData: (data: ArrayBuffer) => void;
  clearBinaryData: () => void;
}

const useBinaryStore = create<BinaryImageStore>((set, get) => ({
  binary: null,
  lastUpdate: 0,
  setBinaryData: (data) => {
    const state = get();
    const now = performance.now();

    // 너무 빠른 업데이트는 무시 (50ms 간격)
    if (now - state.lastUpdate < 50) {
      return;
    }

    set({ binary: data, lastUpdate: now });
  },
  clearBinaryData: () => set({ binary: null, lastUpdate: 0 }),
}));

export default useBinaryStore;
