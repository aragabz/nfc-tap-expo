import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { StorageService } from '../services/storage';

interface OnboardingContextType {
  isCompleted: boolean | null;
  isLoading: boolean;
  completeOnboarding: () => Promise<void>;
  resetOnboarding: () => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCompleted, setIsCompleted] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadOnboardingStatus = useCallback(async () => {
    try {
      const status = await StorageService.getOnboardingStatus();
      setIsCompleted(status);
    } catch (error) {
      console.error('Error loading onboarding status:', error);
      setIsCompleted(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOnboardingStatus();
  }, [loadOnboardingStatus]);

  const completeOnboarding = async () => {
    try {
      console.log('Completing onboarding...');
      await StorageService.saveOnboardingStatus(true);
      setIsCompleted(true);
      console.log('Onboarding state updated to true');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  const resetOnboarding = async () => {
    try {
      await StorageService.saveOnboardingStatus(false);
      setIsCompleted(false);
    } catch (error) {
      console.error('Error resetting onboarding:', error);
    }
  };

  return (
    <OnboardingContext.Provider value={{ isCompleted, isLoading, completeOnboarding, resetOnboarding }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};