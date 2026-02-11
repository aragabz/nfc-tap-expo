import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { StorageService } from '../storage';
import { BusinessCard, ScannedCard } from '../../types/card';
import { AuthSession } from '../../types/auth';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

const mockCard: BusinessCard = {
  id: '1',
  fullName: 'John Doe',
  version: '1.0',
};

const mockScannedCard: ScannedCard = {
  ...mockCard,
  scannedAt: new Date().toISOString(),
};

const mockSession: AuthSession = {
  accessToken: 'access-token',
  refreshToken: 'refresh-token',
  expiresAt: 123456789,
};

describe('StorageService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('saves auth tokens', async () => {
    await StorageService.saveTokens(mockSession);
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith('auth_tokens', JSON.stringify(mockSession));
  });

  it('gets auth tokens', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(JSON.stringify(mockSession));
    const result = await StorageService.getTokens();
    expect(result).toEqual(mockSession);
  });

  it('clears auth tokens', async () => {
    await StorageService.clearTokens();
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('auth_tokens');
  });

  it('saves onboarding status', async () => {
    await StorageService.saveOnboardingStatus(true);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('onboarding_completed', JSON.stringify(true));
  });

  it('gets onboarding status', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(true));
    const result = await StorageService.getOnboardingStatus();
    expect(result).toBe(true);
  });

  it('saves user profile', async () => {
    await StorageService.saveUserProfile(mockCard);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('user_profile', JSON.stringify(mockCard));
  });

  it('gets user profile', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockCard));
    const result = await StorageService.getUserProfile();
    expect(result).toEqual(mockCard);
  });

  it('deletes user profile', async () => {
    await StorageService.deleteUserProfile();
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('user_profile');
  });

  it('saves scanned card', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([]));
    await StorageService.saveScannedCard(mockScannedCard);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'scanned_cards',
      JSON.stringify([mockScannedCard])
    );
  });

  it('gets scanned cards', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([mockScannedCard]));
    const result = await StorageService.getScannedCards();
    expect(result).toEqual([mockScannedCard]);
  });
});