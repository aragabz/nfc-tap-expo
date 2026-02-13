import { z } from "zod";

const envSchema = z.object({
  API_URL: z.string().url(),
  ENVIRONMENT: z
    .enum(["development", "staging", "production"])
    .default("development"),
});

const parseEnv = () => {
  try {
    return envSchema.parse({
      API_URL:
        process.env.EXPO_PUBLIC_API_URL ||
        "https://cards-api-dev.tasama.com.sa/api",
      ENVIRONMENT: process.env.EXPO_PUBLIC_ENVIRONMENT || "development",
    });
  } catch (error) {
    console.error("Environment validation failed:", error);
    throw new Error("Invalid environment configuration");
  }
};

export const env = parseEnv();

export const API_CONFIG = {
  BASE_URL: env.API_URL,
  ENVIRONMENT: env.ENVIRONMENT,
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
} as const;
