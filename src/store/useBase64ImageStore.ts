// store/useBase64ImageStore.ts
import { create } from "zustand";

interface Base64ImageStore {
  imageData: string | null;
  lastUpdate: number;
  setImageData: (data: string) => void;
  clearImageData: () => void;
}

const useBase64ImageStore = create<Base64ImageStore>((set, get) => ({
  imageData: null,
  lastUpdate: 0,
  setImageData: (data) => {
    const state = get();
    const now = performance.now();

    // 같은 데이터이거나 너무 빠른 업데이트는 무시
    if (state.imageData === data || now - state.lastUpdate < 50) {
      return;
    }

    set({ imageData: data, lastUpdate: now });
  },
  clearImageData: () => set({ imageData: null, lastUpdate: 0 }),
}));

export default useBase64ImageStore;
