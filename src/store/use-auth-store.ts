import { create } from "zustand";
import { AzureUser, AzureSession } from "../types/auth";

interface AuthState {
  session: AzureSession | null;
  user: AzureUser | null;
  isLoading: boolean;
  isOffline: boolean;
  hasLocalProfile: boolean;
  setSession: (session: AzureSession | null) => void;
  setUser: (user: AzureUser | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsOffline: (isOffline: boolean) => void;
  setHasLocalProfile: (hasLocalProfile: boolean) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  isLoading: true,
  isOffline: false,
  hasLocalProfile: false,
  setSession: (session) => set({ session }),
  setUser: (user) => set({ user }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setIsOffline: (isOffline) => set({ isOffline }),
  setHasLocalProfile: (hasLocalProfile) => set({ hasLocalProfile }),
  clearAuth: () => set({ session: null, user: null, isLoading: false, hasLocalProfile: false }),
}));
