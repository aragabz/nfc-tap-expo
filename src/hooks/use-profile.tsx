import { useCallback, useEffect } from "react";
import { Profile, ProfileService, StorageService } from "../services";
import { STORAGE_KEYS } from "../constants/storage";
import { useProfileStore } from "../store/use-profile-store";

export const useProfile = () => {
  const { profile, loading, error, setProfile, setLoading, setError, clearProfile } = useProfileStore();

  const loadProfile = useCallback(async () => {
    console.log("[useProfile] loadProfile called");
    setLoading(true);
    setError(null);
    try {
      const storedProfile = await StorageService.getItem<Profile>(STORAGE_KEYS.USER_PROFILE);
      console.log("[useProfile] storedProfile retrieved:", !!storedProfile);
      setProfile(storedProfile);
      return storedProfile;
    } catch (err) {
      console.error("[useProfile] Error loading profile from storage:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to load profile";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [setProfile, setLoading, setError]);

  const getPublicProfile = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const profileData = await ProfileService.getPublicProfile(id);
      setProfile(profileData);
      return profileData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch profile";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setProfile, setLoading, setError]);

  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  // Initial load
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return {
    profile,
    loading,
    error,
    loadProfile,
    getPublicProfile,
    clearError,
    clearProfile
  };
};
