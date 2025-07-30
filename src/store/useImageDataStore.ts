import { create } from "zustand";

type State = {
  image: string | null;
};

type Actions = {
  setImage: (image: string) => void;
};

type Store = State & Actions;

const useImageDataStore = create<Store>((set) => ({
  image: null,
  setImage: (image: string) => set({ image }),
}));

export default useImageDataStore;
