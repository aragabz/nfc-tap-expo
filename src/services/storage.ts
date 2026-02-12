import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { AzureSession } from '../types/auth';
import { BusinessCard, ScannedCard } from '../types/card';

const STORAGE_KEYS = {
  USER_PROFILE: 'user_profile',
  SCANNED_CARDS: 'scanned_cards',
  AUTH_TOKENS: 'auth_tokens',
};

// Helper to handle SecureStore with fallback for Web or missing native module
const isSecureStoreAvailable = Platform.OS !== 'web';

const safeSecureSave = async (key: string, value: string) => {
  try {
    if (isSecureStoreAvailable) {
      await SecureStore.setItemAsync(key, value);
    } else {
      await AsyncStorage.setItem(key, value);
    }
  } catch (error) {
    // If SecureStore fails due to missing native module, fallback to AsyncStorage
    await AsyncStorage.setItem(key, value);
  }
};

const safeSecureGet = async (key: string) => {
  try {
    if (isSecureStoreAvailable) {
      return await SecureStore.getItemAsync(key);
    }
    return await AsyncStorage.getItem(key);
  } catch (error) {
    return await AsyncStorage.getItem(key);
  }
};

const safeSecureDelete = async (key: string) => {
  try {
    if (isSecureStoreAvailable) {
      await SecureStore.deleteItemAsync(key);
    } else {
      await AsyncStorage.removeItem(key);
    }
  } catch (error) {
    await AsyncStorage.removeItem(key);
  }
};

export const StorageService = {
  // Auth Tokens (Secure)
  async saveTokens(session: AzureSession): Promise<void> {
    try {
      await safeSecureSave(STORAGE_KEYS.AUTH_TOKENS, JSON.stringify(session));
    } catch (error) {
      console.error('Error saving tokens:', error);
      throw error;
    }
  },

  async getTokens(): Promise<AzureSession | null> {
    try {
      const data = await safeSecureGet(STORAGE_KEYS.AUTH_TOKENS);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting tokens:', error);
      throw error;
    }
  },

  async clearTokens(): Promise<void> {
    try {
      await safeSecureDelete(STORAGE_KEYS.AUTH_TOKENS);
    } catch (error) {
      console.error('Error clearing tokens:', error);
      throw error;
    }
  },

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
