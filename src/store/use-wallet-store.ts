import { create } from "zustand";
import { ScannedCard } from "../types/card";

interface WalletState {
  scannedCards: ScannedCard[];
  loading: boolean;
  setScannedCards: (cards: ScannedCard[]) => void;
  addScannedCard: (card: ScannedCard) => void;
  removeScannedCard: (cardId: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  scannedCards: [],
  loading: false,
  setScannedCards: (scannedCards) => set({ scannedCards }),
  addScannedCard: (card) => set((state) => ({ scannedCards: [card, ...state.scannedCards] })),
  removeScannedCard: (cardId) => set((state) => ({ 
    scannedCards: state.scannedCards.filter(c => c.id !== cardId) 
  })),
  setLoading: (loading) => set({ loading }),
}));
