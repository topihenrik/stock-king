import { create } from "zustand";

export const useGameStore = create((set) => ({
    score: 0,
    highScore: localStorage.getItem("highScore") || 0,
    incrementScore: () => set((state) => ({ score: state.score + 1 })),
    resetScore: () => set((state) => ({ score: 0 })),
    updateHighScore: () => {
        set((state) => {
            const newHighScore = Math.max(state.highScore, state.score)
            localStorage.setItem("highScore", newHighScore);
            return { highScore: newHighScore };
        });
    }
}));