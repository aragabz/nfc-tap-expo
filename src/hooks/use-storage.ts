import { useCallback, useEffect } from "react";
import { STORAGE_KEYS } from "../constants/storage";
import { StorageService } from "../services";
import { useWalletStore } from "../store/use-wallet-store";
import { ScannedCard } from "../types/card";

export const useStorage = () => {
  const { 
    scannedCards, 
    loading: isLoading, 
    setScannedCards, 
    addScannedCard: addCardToStore, 
    removeScannedCard: removeCardFromStore, 
    setLoading 
  } = useWalletStore();

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const cards = await StorageService.getItem<ScannedCard[]>(STORAGE_KEYS.SCANNED_CARDS);
      setScannedCards(cards || []);
    } catch (error) {
      console.error("Error loading scanned cards:", error);
    } finally {
      setLoading(false);
    }
  }, [setScannedCards, setLoading]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const addScannedCard = async (card: ScannedCard) => {
    try {
      const cards = await StorageService.getItem<ScannedCard[]>(STORAGE_KEYS.SCANNED_CARDS) || [];
      const updatedCards = [card, ...cards];
      await StorageService.saveItem(STORAGE_KEYS.SCANNED_CARDS, updatedCards);
      addCardToStore(card);
    } catch (error) {
      console.error("Error adding scanned card:", error);
    }
  };

  const removeScannedCard = async (cardId: string) => {
    try {
      const cards = await StorageService.getItem<ScannedCard[]>(STORAGE_KEYS.SCANNED_CARDS) || [];
      const updatedCards = cards.filter((c) => c.id !== cardId);
      await StorageService.saveItem(STORAGE_KEYS.SCANNED_CARDS, updatedCards);
      removeCardFromStore(cardId);
    } catch (error) {
      console.error("Error removing scanned card:", error);
    }
  };

  return {
    scannedCards,
    isLoading,
    addScannedCard,
    removeScannedCard,
    refresh: loadData,
  };
};
