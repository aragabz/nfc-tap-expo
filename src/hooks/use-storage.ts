import { useState, useEffect, useCallback } from 'react';
import { StorageService } from '../services/storage';
import { BusinessCard, ScannedCard } from '../types/card';

export const useStorage = () => {
  const [userProfile, setUserProfile] = useState<BusinessCard | null>(null);
  const [scannedCards, setScannedCards] = useState<ScannedCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const profile = await StorageService.getUserProfile();
      const cards = await StorageService.getScannedCards();
      setUserProfile(profile);
      setScannedCards(cards);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const saveProfile = async (card: BusinessCard) => {
    await StorageService.saveUserProfile(card);
    setUserProfile(card);
  };

  const addScannedCard = async (card: ScannedCard) => {
    await StorageService.saveScannedCard(card);
    setScannedCards((prev) => [card, ...prev]);
  };

  const removeScannedCard = async (cardId: string) => {
    await StorageService.deleteScannedCard(cardId);
    setScannedCards((prev) => prev.filter((c) => c.id !== cardId));
  };

  return {
    userProfile,
    scannedCards,
    isLoading,
    saveProfile,
    addScannedCard,
    removeScannedCard,
    refresh: loadData,
  };
};
