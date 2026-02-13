// Export all services from a single entry point
export {
    axiosPrivateInstance,
    axiosPublicInstance,
    handleApiError,
    logApiRequest,
    logApiResponse
} from "./api";
export { AzureService } from "./azure";
export { ProfileService } from "./profile";
export { StorageService } from "./storage";

// Export types
export type { Employee as Profile, ProfileResponse } from "./profile";
