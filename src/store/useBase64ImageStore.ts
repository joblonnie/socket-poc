// store/useBase64ImageStore.ts
import { create } from "zustand";

interface Base64ImageStore {
  imageData: string | null;
  setImageData: (data: string) => void;
  clearImageData: () => void;
}

const useBase64ImageStore = create<Base64ImageStore>((set) => ({
  imageData: null,
  setImageData: (data) => set({ imageData: data }),
  clearImageData: () => set({ imageData: null }),
}));

export default useBase64ImageStore;
