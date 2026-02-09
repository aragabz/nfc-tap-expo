import AsyncStorage from '@react-native-async-storage/async-storage';
import { BusinessCard, ScannedCard } from '../types/card';

const STORAGE_KEYS = {
  USER_PROFILE: 'user_profile',
  SCANNED_CARDS: 'scanned_cards',
};

export const StorageService = {
  // User Profile
  async saveUserProfile(card: BusinessCard): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(card));
    } catch (error) {
      console.error('Error saving user profile:', error);
      throw error;
    }
  },

  async getUserProfile(): Promise<BusinessCard | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  },

  async deleteUserProfile(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
    } catch (error) {
      console.error('Error deleting user profile:', error);
      throw error;
    }
  },

  // Scanned Cards (Wallet)
  async saveScannedCard(card: ScannedCard): Promise<void> {
    try {
      const cards = await this.getScannedCards();
      const updatedCards = [card, ...cards];
      await AsyncStorage.setItem(STORAGE_KEYS.SCANNED_CARDS, JSON.stringify(updatedCards));
    } catch (error) {
      console.error('Error saving scanned card:', error);
      throw error;
    }
  },

  async getScannedCards(): Promise<ScannedCard[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SCANNED_CARDS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting scanned cards:', error);
      throw error;
    }
  },

  async deleteScannedCard(cardId: string): Promise<void> {
    try {
      const cards = await this.getScannedCards();
      const updatedCards = cards.filter((c) => c.id !== cardId);
      await AsyncStorage.setItem(STORAGE_KEYS.SCANNED_CARDS, JSON.stringify(updatedCards));
    } catch (error) {
      console.error('Error deleting scanned card:', error);
      throw error;
    }
  },

  async updateScannedCardNote(cardId: string, notes: string): Promise<void> {
    try {
      const cards = await this.getScannedCards();
      const updatedCards = cards.map((c) =>
        c.id === cardId ? { ...c, notes } : c
      );
      await AsyncStorage.setItem(STORAGE_KEYS.SCANNED_CARDS, JSON.stringify(updatedCards));
    } catch (error) {
      console.error('Error updating scanned card note:', error);
      throw error;
    }
  },
};