import { create } from "zustand";

export const useGameStore = create((set) => ({
    score: 0,
    incrementScore: () => set((state) => ({ score: state.score + 1 })),
    resetScore: () => set((state) => ({ score: 0 })),
}));