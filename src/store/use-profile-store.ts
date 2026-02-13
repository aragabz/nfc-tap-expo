import { create } from "zustand";
import { Profile } from "../services";

interface ProfileState {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  setProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearProfile: () => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  loading: false,
  error: null,
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearProfile: () => set({ profile: null, loading: false, error: null }),
}));
