import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

// Helper to handle SecureStore with fallback for Web or missing native module
const isSecureStoreAvailable = Platform.OS !== "web";

export const StorageService = {
  /**
   * Save an item to AsyncStorage
   */
  async saveItem<T>(key: string, value: T): Promise<void> {
    try {
      const stringValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, stringValue);
    } catch (error) {
      console.error(`Error saving item [${key}]:`, error);
      throw error;
    }
  },

  /**
   * Get an item from AsyncStorage
   */
  async getItem<T>(key: string): Promise<T | null> {
    try {
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Error getting item [${key}]:`, error);
      throw error;
    }
  },

  /**
   * Remove an item from AsyncStorage
   */
  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item [${key}]:`, error);
      throw error;
    }
  },

  /**
   * Save an item to SecureStore (with AsyncStorage fallback)
   */
  async saveSecureItem<T>(key: string, value: T): Promise<void> {
    try {
      const stringValue = JSON.stringify(value);
      if (isSecureStoreAvailable) {
        await SecureStore.setItemAsync(key, stringValue);
      } else {
        await AsyncStorage.setItem(key, stringValue);
      }
    } catch (error) {
      // Fallback if SecureStore fails
      try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
      } catch (innerError) {
        console.error(`Error saving secure item [${key}]:`, error);
        throw error;
      }
    }
  },

  /**
   * Get an item from SecureStore (with AsyncStorage fallback)
   */
  async getSecureItem<T>(key: string): Promise<T | null> {
    try {
      let data: string | null = null;
      if (isSecureStoreAvailable) {
        data = await SecureStore.getItemAsync(key);
      }
      
      if (!data) {
        data = await AsyncStorage.getItem(key);
      }
      
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Error getting secure item [${key}]:`, error);
      throw error;
    }
  },

  /**
   * Remove an item from SecureStore (and AsyncStorage)
   */
  async removeSecureItem(key: string): Promise<void> {
    try {
      if (isSecureStoreAvailable) {
        await SecureStore.deleteItemAsync(key);
      }
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing secure item [${key}]:`, error);
      throw error;
    }
  },

  /**
   * Clear all items from AsyncStorage
   */
  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error("Error clearing storage:", error);
      throw error;
    }
  }
};
