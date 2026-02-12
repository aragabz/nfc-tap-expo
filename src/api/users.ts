import { apiClient } from "./client";

export interface PublicUserResponse {
  id: string;
  // Add actual response fields here once confirmed from backend
  [key: string]: any;
}

export const getPublicUser = async (
  userId: string,
): Promise<PublicUserResponse> => {
  try {
    const response = await apiClient.get<PublicUserResponse>(
      `/users/public/${userId}`,
    );

    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("API Error:", error.response.data);
      throw new Error(error.response.data?.message || "Server error");
    } else if (error.request) {
      console.error("Network Error:", error.message);
      throw new Error("Network error. Please check your connection.");
    } else {
      console.error("Unexpected Error:", error.message);
      throw error;
    }
  }
};
