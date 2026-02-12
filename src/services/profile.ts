import axios from "axios";
import {
  axiosPrivateInstance,
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

      const response = await axiosPrivateInstance.get<Employee>(endpoint);

      logApiResponse("GET", endpoint, response.data);

      console.log("Response:", JSON.stringify(response.data));

      return response.data;
    } catch (error) {
      console.error("Error fetching public profile:", error);
      console.log("Error details:", JSON.stringify(error, null, 2));
      throw new Error(handleApiError(error as any));
    }
  },
};
