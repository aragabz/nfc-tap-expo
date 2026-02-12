import { useCallback, useState } from "react";
import { Profile, ProfileService } from "../services";

interface UseProfileState {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
}

export const useProfile = () => {
  const [state, setState] = useState<UseProfileState>({
    profile: null,
    loading: false,
    error: null,
  });

  const getPublicProfile = useCallback(async (id: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const profile = await ProfileService.getPublicProfile(id);
      setState((prev) => ({ ...prev, profile, loading: false }));
      return profile;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch profile";
      setState((prev) => ({ ...prev, error: errorMessage, loading: false }));
      throw error;
    }
  }, []);

  // const updateProfile = useCallback(async (profileData: Partial<Profile>) => {
  //   setState((prev) => ({ ...prev, loading: true, error: null }));

  //   try {
  //     const updatedProfile = await ProfileService.updateProfile(profileData);
  //     setState((prev) => ({
  //       ...prev,
  //       profile: updatedProfile,
  //       loading: false,
  //     }));
  //     return updatedProfile;
  //   } catch (error) {
  //     const errorMessage =
  //       error instanceof Error ? error.message : "Failed to update profile";
  //     setState((prev) => ({ ...prev, error: errorMessage, loading: false }));
  //     throw error;
  //   }
  // }, []);

  // const uploadProfileImage = useCallback(async (imageFile: File) => {
  //   setState((prev) => ({ ...prev, loading: true, error: null }));

  //   try {
  //     const imageUrl = await ProfileService.uploadProfileImage(imageFile);
  //     setState((prev) => ({ ...prev, loading: false }));
  //     return imageUrl;
  //   } catch (error) {
  //     const errorMessage =
  //       error instanceof Error ? error.message : "Failed to upload image";
  //     setState((prev) => ({ ...prev, error: errorMessage, loading: false }));
  //     throw error;
  //   }
  // }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    getPublicProfile,
    // updateProfile,
    // uploadProfileImage,
    clearError,
  };
};
