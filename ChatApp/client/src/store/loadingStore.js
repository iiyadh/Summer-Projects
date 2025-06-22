import { create } from "zustand";

export const useLoadingStore = create((set) => ({
  loading: false,
  show: () => set({ loading: true }),
  hide: () => set({ loading: false }),
}));