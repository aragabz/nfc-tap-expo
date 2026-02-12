import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import { Platform } from "react-native";
import { StorageService } from "./storage";

// 🔧 FIXED: Better URL normalization that actually removes ALL whitespace
const normalizeBaseUrl = (value: string): string => {
  if (!value) return "";

  // Step 1: Remove zero-width characters
  let cleaned = value.replace(/[\u200B-\u200D\uFEFF]/g, "");

  // Step 2: Remove all types of quotes (single, double, curly, backtick)
  cleaned = cleaned.replace(/['"`"'"'"`]/g, "");

  // Step 3: Trim whitespace from ends
  cleaned = cleaned.trim();

  // Step 4: Remove ALL whitespace characters from entire string (including internal spaces)
  cleaned = cleaned.replace(/\s+/g, "");

  // Step 5: Remove trailing slashes
  cleaned = cleaned.replace(/\/+$/, "");

  console.log("[API] Normalized baseURL:", {
    original: JSON.stringify(value),
    cleaned: JSON.stringify(cleaned),
    originalLength: value.length,
    cleanedLength: cleaned.length,
  });

  return cleaned;
};

// 🔧 FIXED: Ensure no trailing space in fallback URL
const API_BASE_URL = normalizeBaseUrl(
  process.env.NEXT_PUBLIC_API_URL || "https://cards-api-dev.tasama.com.sa/api",
);
const API_TIMEOUT = 30000;
const API_ENVIRONMENT = process.env.NEXT_PUBLIC_ENVIRONMENT || "development";

const escapeShell = (value: string) => {
  return `'${value.replace(/'/g, `'\\''`)}'`;
};

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

const buildFullUrl = (baseURL: string | undefined, url: string | undefined) => {
  const u = (url || "").trim();
  if (/^https?:\/\//i.test(u)) return u;
  if (!baseURL) return u;
  const a = String(baseURL).replace(/\/+$/, "");
  const b = u.replace(/^\/+/, "");
  return b ? `${a}/${b}` : a;
};

const toCurl = (config: any) => {
  const method = String(config?.method || "get").toUpperCase();
  const fullUrl = buildFullUrl(config?.baseURL, config?.url);

  const rawHeaders = headersToRecord(config?.headers);
  const safeHeaders = redactHeaders(rawHeaders);

  const headerArgs = Object.entries(safeHeaders)
    .filter(([_, v]) => v !== undefined && v !== null && String(v).length > 0)
    .map(([k, v]) => `-H ${escapeShell(`${k}: ${v}`)}`)
    .join(" ");

  let dataArg = "";
  const data = config?.data;
  const isFormData =
    typeof FormData !== "undefined" && data instanceof FormData;
  if (data !== undefined && data !== null && !isFormData) {
    const body =
      typeof data === "string"
        ? data
        : typeof data === "object"
          ? JSON.stringify(data)
          : String(data);
    const clipped = body.length > 2000 ? `${body.slice(0, 2000)}…` : body;
    dataArg = `--data ${escapeShell(clipped)}`;
  }

  const parts = [
    "curl",
    "-i",
    "-X",
    method,
    escapeShell(fullUrl),
    headerArgs,
    dataArg,
  ].filter(Boolean);

  return parts.join(" ");
};

// Request interceptor to add session token
const addAuthToken = async (
  config: InternalAxiosRequestConfig,
): Promise<InternalAxiosRequestConfig> => {
  try {
    console.log("[AUTH] Attempting to retrieve tokens from storage...");
    const tokens = await StorageService.getTokens();

    if (!tokens?.accessToken) {
      console.warn("[AUTH] No tokens found or no accessToken");
      return config;
    }

    // Ensure headers object exists
    if (!config.headers) {
      config.headers = new axios.AxiosHeaders();
    }

    // Set Authorization header properly
    const authHeader = `Bearer ${tokens.accessToken}`;
    config.headers.set("Authorization", authHeader);

    const prefix = tokens.accessToken.slice(0, 8);
    const suffix = tokens.accessToken.slice(-4);
    console.log(
      `[AUTH] Authorization set (Bearer len=${tokens.accessToken.length} ${prefix}…${suffix})`,
    );

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
  const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    ...config,
  });

  if (API_ENVIRONMENT === "development") {
    instance.interceptors.request.use(
      (cfg) => {
        try {
          if (cfg?.baseURL) cfg.baseURL = normalizeBaseUrl(String(cfg.baseURL));
          if (cfg?.url) cfg.url = String(cfg.url).trim();
          const fullUrl = buildFullUrl(cfg?.baseURL, cfg?.url);
          console.log(
            "[AXIOS]",
            JSON.stringify({
              method: cfg?.method,
              baseURL: cfg?.baseURL,
              url: cfg?.url,
              fullUrl,
            }),
          );
          console.log("[CURL]", toCurl(cfg));
        } catch {}
        return cfg;
      },
      (error) => Promise.reject(error),
    );
  }

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
  if ((error as any)?.code === "ERR_NETWORK") {
    const cfg = (error as any)?.config as any | undefined;
    const baseURL = cfg?.baseURL ?? API_BASE_URL;
    const url = cfg?.url ?? "";
    const hasAuth = !!cfg?.headers?.Authorization;

    console.error("[Network Error Details]:", {
      message: error.message,
      code: (error as any).code,
      baseURL: JSON.stringify(baseURL),
      url: JSON.stringify(url),
      hasAuth,
      platform: Platform.OS,
    });

    let hint = "";
    if (Platform.OS === "android") {
      hint =
        " Check AndroidManifest.xml for android:usesCleartextTraffic if using HTTP.";
    } else if (Platform.OS === "ios") {
      hint = " Check Info.plist for NSAppTransportSecurity settings.";
    }

    return `Network error. Verify API_URL is reachable: ${baseURL}${hint}`;
  }

  if (error.response?.data && typeof error.response.data === "object") {
    const data = error.response.data as any;
    return data.message || data.error || "An error occurred";
  }

  if (error.response && error.response.status === 401) {
    return "Authentication required";
  }

  if (error.response && error.response.status === 403) {
    return "Access denied";
  }

  if (error.response && error.response.status === 404) {
    return "Resource not found";
  }

  if (error.response && error.response.status >= 500) {
    return "Server error occurred";
  }

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
