import { create } from "zustand";

export const useCurrencyStore = create((set) => ({
    gameCurrency: "USD",
    changeGameCurrency: (currency) => set((state) => ({ gameCurrency: currency}))
}));