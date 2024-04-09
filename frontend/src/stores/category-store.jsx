import { create } from "zustand";

export const useCategoryStore = create((set) => ({
    category: "All categories",
    changeCategory: (chosenCategory) => set((state) => ({ category: chosenCategory}))
}));