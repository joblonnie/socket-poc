// store/useBinaryImageStore.ts
import { create } from "zustand";

interface BinaryImageStore {
  binary: ArrayBuffer | null;
  setBinaryData: (data: ArrayBuffer) => void;
  clearBinaryData: () => void;
}

const useBinaryStore = create<BinaryImageStore>((set) => ({
  binary: null,
  setBinaryData: (data) => set({ binary: data }),
  clearBinaryData: () => set({ binary: null }),
}));

export default useBinaryStore;
