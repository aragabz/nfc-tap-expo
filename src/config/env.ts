import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url(),
  NEXT_PUBLIC_ENVIRONMENT: z.enum(['development', 'staging', 'production']).default('development'),
});

const parseEnv = () => {
  try {
    return envSchema.parse({
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
      NEXT_PUBLIC_ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT,
    });
  } catch (error) {
    console.error('Environment validation failed:', error);
    throw new Error('Invalid environment configuration');
  }
};

export const env = parseEnv();

export const API_CONFIG = {
  BASE_URL: env.NEXT_PUBLIC_API_URL,
  ENVIRONMENT: env.NEXT_PUBLIC_ENVIRONMENT,
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
} as const;