import {
  axiosPublicInstance,
  handleApiError,
  logApiRequest,
  logApiResponse,
} from "./api";

export interface Employee {
  id: string;
  fullName: string;
  email: string;
  jobTitle?: string;
  organization?: string;
  phoneNumber?: string;
  profileImageUrl?: string;
  bio?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// export interface ProfileResponse {
//   success: boolean;
//   data: Profile;
//   message?: string;
// }

export interface ProfileResponse {
  success: boolean;
  data: Employee;
  message?: string;
}

export const ProfileService = {
  /**
   * Get public profile by user ID
   * @param id - The user ID to fetch profile for
   * @returns Promise with the user profile data
   */
  async getPublicProfile(id: string): Promise<Employee> {
    try {
      const endpoint = `/users/public/${id}`;
      logApiRequest("GET", endpoint);

      const response = await axiosPublicInstance.get<Employee>(endpoint);

      logApiResponse("GET", endpoint, response.data);

      console.log("Response:", JSON.stringify(response.data));

      return response.data;
    } catch (error) {
      console.error("Error fetching public profile:", error);
      throw new Error(handleApiError(error as any));
    }
  },

  /**
  //  * Get current user's profile (requires authentication)
  //  * @returns Promise with the current user profile data
  //  */
  // async getCurrentUserProfile(): Promise<Profile> {
  //   try {
  //     const endpoint = "/users/me";
  //     logApiRequest("GET", endpoint);

  //     const response =
  //       await axiosPrivateInstance.get<ProfileResponse>(endpoint);

  //     logApiResponse("GET", endpoint, response.data);

  //     if (!response.data.success) {
  //       throw new Error(response.data.message || "Failed to fetch profile");
  //     }

  //     return response.data.data;
  //   } catch (error) {
  //     console.error("Error fetching current user profile:", error);
  //     throw new Error(handleApiError(error as any));
  //   }
  // },

  // /**
  //  * Update current user's profile (requires authentication)
  //  * @param profileData - The profile data to update
  //  * @returns Promise with the updated profile data
  //  */
  // async updateProfile(profileData: Partial<Profile>): Promise<Profile> {
  //   try {
  //     const endpoint = "/users/me";
  //     logApiRequest("PUT", endpoint, profileData);

  //     const response = await axiosPrivateInstance.put<ProfileResponse>(
  //       endpoint,
  //       profileData,
  //     );

  //     logApiResponse("PUT", endpoint, response.data);

  //     if (!response.data.success) {
  //       throw new Error(response.data.message || "Failed to update profile");
  //     }

  //     return response.data.data;
  //   } catch (error) {
  //     console.error("Error updating profile:", error);
  //     throw new Error(handleApiError(error as any));
  //   }
  // },

  // /**
  //  * Upload profile image (requires authentication)
  //  * @param imageFile - The image file to upload
  //  * @returns Promise with the uploaded image URL
  //  */
  // async uploadProfileImage(imageFile: File): Promise<string> {
  //   try {
  //     const endpoint = "/users/me/profile-image";
  //     const formData = new FormData();
  //     formData.append("image", imageFile);

  //     logApiRequest("POST", endpoint, { imageFile: imageFile.name });

  //     const response = await axiosPrivateInstance.post<{
  //       success: boolean;
  //       data: { imageUrl: string };
  //       message?: string;
  //     }>(endpoint, formData, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     });

  //     logApiResponse("POST", endpoint, response.data);

  //     if (!response.data.success) {
  //       throw new Error(
  //         response.data.message || "Failed to upload profile image",
  //       );
  //     }

  //     return response.data.data.imageUrl;
  //   } catch (error) {
  //     console.error("Error uploading profile image:", error);
  //     throw new Error(handleApiError(error as any));
  //   }
  // },

  // /**
  //  * Delete current user's profile (requires authentication)
  //  * @returns Promise that resolves when profile is deleted
  //  */
  // async deleteProfile(): Promise<void> {
  //   try {
  //     const endpoint = "/users/me";
  //     logApiRequest("DELETE", endpoint);

  //     const response = await axiosPrivateInstance.delete<{
  //       success: boolean;
  //       message?: string;
  //     }>(endpoint);

  //     logApiResponse("DELETE", endpoint, response.data);

  //     if (!response.data.success) {
  //       throw new Error(response.data.message || "Failed to delete profile");
  //     }
  //   } catch (error) {
  //     console.error("Error deleting profile:", error);
  //     throw new Error(handleApiError(error as any));
  //   }
  // },

  // /**
  //  * Search for profiles by name or organization
  //  * @param query - The search query
  //  * @returns Promise with array of matching profiles
  //  */
  // async searchProfiles(query: string): Promise<Profile[]> {
  //   try {
  //     const endpoint = `/users/search?q=${encodeURIComponent(query)}`;
  //     logApiRequest("GET", endpoint);

  //     const response = await axiosPrivateInstance.get<{
  //       success: boolean;
  //       data: Profile[];
  //       message?: string;
  //     }>(endpoint);

  //     logApiResponse("GET", endpoint, response.data);

  //     if (!response.data.success) {
  //       throw new Error(response.data.message || "Failed to search profiles");
  //     }

  //     return response.data.data;
  //   } catch (error) {
  //     console.error("Error searching profiles:", error);
  //     throw new Error(handleApiError(error as any));
  //   }
  // },
};
