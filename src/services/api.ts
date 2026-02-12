import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import { Platform } from "react-native";
import { StorageService } from "./storage";

// 🔧 EMERGENCY FIX: Ultra-aggressive URL cleaning

// 🔧 DEBUG: Check what's happening
console.log("🔍 ENV CHECK:", {
  EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  EXPO_PUBLIC_API_URL_LENGTH: process.env.EXPO_PUBLIC_API_URL?.length,
  NEXT_PUBLIC_API_URL_LENGTH: process.env.NEXT_PUBLIC_API_URL?.length,
});

// 🔧 FORCE FALLBACK: Ignore env vars completely if they contain spaces or quotes
// let API_BASE_URL = "https://cards-api-dev.tasama.com.sa/api"; // Hardcoded clean URL

// const envUrl =
// process.env.EXPO_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URL;
// if (envUrl) {
//   const cleaned = cleanUrl(envUrl);
//   // Only use env var if it's valid (no spaces, proper URL)
//   if (cleaned && !cleaned.includes(" ") && cleaned.startsWith("http")) {
//     API_BASE_URL = cleaned;
//     console.log("✅ Using cleaned env URL:", API_BASE_URL);
//   } else {
//     console.warn(
//       "❌ Env URL invalid, using hardcoded fallback. Cleaned was:",
//       JSON.stringify(cleaned),
//     );
//   }
// }

// console.log("🔍 FINAL API_BASE_URL:", JSON.stringify(API_BASE_URL));

const API_TIMEOUT = 30000;
const API_ENVIRONMENT = "development";

// const escapeShell = (value: string) => {
//   return `'${value.replace(/'/g, `'\\''`)}'`;
// };

const headersToRecord = (headers: any): Record<string, string> => {
  if (!headers) return {};
  if (typeof headers.toJSON === "function") return headers.toJSON();
  return { ...headers };
};

const redactHeaders = (headers: Record<string, string>) => {
  const result: Record<string, string> = {};
  for (const [k, v] of Object.entries(headers)) {
    const key = k.toLowerCase();
    if (key === "authorization" || key === "cookie" || key === "set-cookie") {
      result[k] = "REDACTED";
    } else {
      result[k] = String(v);
    }
  }
  return result;
};

// Request interceptor to add session token
const addAuthToken = async (
  config: InternalAxiosRequestConfig,
): Promise<InternalAxiosRequestConfig> => {
  try {
    console.log("[AUTH] Attempting to retrieve tokens from storage...");
    const tokens = await StorageService.getTokens();
    // Set Authorization header properly
    const authHeader = `Bearer ${tokens?.accessToken || ""}`;
    config.headers.set("Authorization", authHeader);
    return config;
  } catch (error) {
    console.error("Error adding auth token:", error);
    return config;
  }
};

// Response interceptor to handle token refresh
const handleTokenRefresh = async (error: AxiosError): Promise<any> => {
  const originalRequest = error.config as InternalAxiosRequestConfig & {
    _retry?: boolean;
  };

  if (error.response?.status === 401 && !originalRequest._retry) {
    console.warn("[AUTH] Received 401 from API");
    originalRequest._retry = true;
  }
  return Promise.reject(error);
};

// Create axios instance with default configuration
const createAxiosInstance = (
  config: any = {},
  options?: { includeAuth?: boolean },
): AxiosInstance => {
  // 🔧 FORCE CLEAN: Ensure baseURL has no spaces at instance creation
  // const baseURL = cleanUrl(config.baseURL || API_BASE_URL);
  const baseURL = "https://cards-api-dev.tasama.com.sa/api";

  console.log(
    "🔍 Creating axios instance with baseURL:",
    JSON.stringify(baseURL),
  );

  const instance = axios.create({
    baseURL,
    timeout: API_TIMEOUT,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  if (options?.includeAuth) {
    instance.interceptors.request.use(addAuthToken, (error) =>
      Promise.reject(error),
    );

    instance.interceptors.response.use(
      (response) => response,
      handleTokenRefresh,
    );
  }

  return instance;
};

export const axiosPublicInstance = createAxiosInstance(
  {},
  { includeAuth: false },
);

export const axiosPrivateInstance = createAxiosInstance(
  {},
  { includeAuth: true },
);

export const axiosInstance = axiosPrivateInstance;

// Utility function for API error handling
export const handleApiError = (error: AxiosError): string => {
  const cfg = (error as any)?.config as any | undefined;
  const rawBaseURL = "https://cards-api-dev.tasama.com.sa/api";
  const url = cfg?.url ?? "";
  const hasAuth = !!cfg?.headers?.Authorization;

  if (
    (error as any)?.code === "ERR_NETWORK" ||
    error.message === "Network Error"
  ) {
    console.error("[Network Error Details]:", {
      message: error.message,
      code: (error as any).code,
      rawBaseURL: JSON.stringify(rawBaseURL),
      cleanedBaseURL: JSON.stringify(rawBaseURL),
      url: JSON.stringify(url),
      hasAuth,
      platform: Platform.OS,
      requestHeaders: cfg?.headers
        ? redactHeaders(headersToRecord(cfg.headers))
        : "none",
    });

    let hint = "";
    if (Platform.OS === "android") {
      hint =
        " Check AndroidManifest.xml for android:usesCleartextTraffic if using HTTP.";
    } else if (Platform.OS === "ios") {
      hint = " Check Info.plist for NSAppTransportSecurity settings.";
    }

    return `Network error. Verify API_URL is reachable: ${rawBaseURL}${hint}`;
  }

  if (error.response?.data && typeof error.response.data === "object") {
    const data = error.response.data as any;
    console.error("[API Error Response]:", JSON.stringify(data, null, 2));
    return data.message || data.error || "An error occurred";
  }

  if (error.response && error.response.status === 401) {
    console.error("[API Error] 401 Unauthorized");
    return "Authentication required";
  }

  if (error.response && error.response.status === 403) {
    console.error("[API Error] 403 Forbidden");
    return "Access denied";
  }

  if (error.response && error.response.status === 404) {
    console.error("[API Error] 404 Not Found", url);
    return "Resource not found";
  }

  if (error.response && error.response.status >= 500) {
    console.error("[API Error] Server Error", error.response.status);
    return "Server error occurred";
  }

  console.error("[API Error] Unknown:", error.message);
  return error.message || "Network error occurred";
};

// Utility function for API request logging (only in development)
export const logApiRequest = (method: string, url: string, data?: any) => {
  if (API_ENVIRONMENT === "development") {
    console.log(`[API] ${method.toUpperCase()} ${url}`, data ? { data } : "");
  }
};

// Utility function for API response logging (only in development)
export const logApiResponse = (method: string, url: string, response: any) => {
  if (API_ENVIRONMENT === "development") {
    console.log(`[API] ${method.toUpperCase()} ${url} - Response:`, response);
  }
};
