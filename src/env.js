import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string().url(),
    BETTER_AUTH_SECRET: z.string().min(1, {
      message: "BETTER_AUTH_SECRET must be set",
    }),
    BETTER_AUTH_URL: z.string().url(),
    RESEND_API_KEY: z.string().min(1, {
      message: "RESEND_API_KEY must be set",
    }),
    EMAIL_FROM: z.string().email({
      message: "EMAIL_FROM must be a valid email address",
    }),
    EMAIL_VERIFICATION_CALLBACK_URL: z
      .string()
      .url()
      .default("http://localhost:3000/api/auth/callback/email-verification"),
    ORGANIZATION_INVITATION_CALLBACK_URL: z.string().url(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),

    R2_ACCESS_KEY_ID: z.string().min(1, {
      message: "R2_ACCESS_KEY_ID must be set",
    }),
    R2_SECRET_ACCESS_KEY: z.string().min(1, {
      message: "R2_SECRET_ACCESS_KEY must be set",
    }),
    UPSTASH_REDIS_REST_URL: z.string().url().optional(), // Optional Redis URL
    UPSTASH_REDIS_REST_TOKEN: z.string().optional(), // Optional Redis token
    GROQ_API_KEY: z.string().min(1, {
      message: "GROQ_API_KEY must be set",
    }),
    PINECONE_API_KEY: z.string().min(1, {
      message: "PINECONE_API_KEY must be set",
    }),
    PINECONE_INDEX: z.string().min(1, {
      message: "PINECONE_INDEX must be set",
    }),
    GEMINI_API_KEY: z.string().min(1, {
      message: "GEMINI_API_KEY must be set",
    }),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_BETTER_AUTH_URL: z.string().url(),
    NEXT_PUBLIC_R2_ENDPOINT_URL: z.string().url(),
    NEXT_PUBLIC_R2_BUCKET_NAME: z.string().min(1, {
      message: "R2_BUCKET_NAME must be set",
    }),
    NEXT_PUBLIC_R2_PUBLIC_URL: z.string().url(),
    NEXT_PUBLIC_C15T_URL: z.string().url().optional(), // Optional tracking URL
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   * 
   * Hardcoded values for demo deployment - no need to set environment variables!
   */
  runtimeEnv: {
    // App URLs - Updated for production domain
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://hr.augment.cfd",
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL || "http://hr.augment.cfd",
    NEXT_PUBLIC_BETTER_AUTH_URL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://hr.augment.cfd",
    
    // Database - Keep from env as this is deployment-specific
    DATABASE_URL: process.env.DATABASE_URL || "postgresql://neondb_owner:npg_DC7ynfJQ9pEq@ep-summer-sea-adloz59o-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
    
    // System
    NODE_ENV: process.env.NODE_ENV,
    
    // Auth Secret - Hardcoded for demo
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET || "demo-jwt-secret-key-augment-hr-2025-production",
    
    // Email - Using your current setup
    RESEND_API_KEY: process.env.RESEND_API_KEY || "re_N9fmDBnw_N48pxHCiXy5Mhn21dMrMpr2k",
    EMAIL_FROM: process.env.EMAIL_FROM || "aiaugments@gmail.com",
    EMAIL_VERIFICATION_CALLBACK_URL: process.env.EMAIL_VERIFICATION_CALLBACK_URL || "http://hr.augment.cfd/auth-callback",
    ORGANIZATION_INVITATION_CALLBACK_URL: process.env.ORGANIZATION_INVITATION_CALLBACK_URL || "http://hr.augment.cfd/dashboard",
    
    // R2 Storage - Hardcoded fake values (disabled in code anyway)
    NEXT_PUBLIC_R2_ENDPOINT_URL: process.env.NEXT_PUBLIC_R2_ENDPOINT_URL || "https://demo-r2-endpoint.augment.cfd",
    R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID || "DEMO_ACCESS_KEY_AUGMENT_HR",
    R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY || "demo-secret-key-augment-hr-storage-2025",
    NEXT_PUBLIC_R2_BUCKET_NAME: process.env.NEXT_PUBLIC_R2_BUCKET_NAME || "augment-hr-demo-bucket",
    NEXT_PUBLIC_R2_PUBLIC_URL: process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "https://augment-hr-demo-bucket.r2.dev",
    
    // Redis - Optional (disabled in code)
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL || undefined,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN || undefined,
    
    // AI APIs - Using your current keys
    GROQ_API_KEY: process.env.GROQ_API_KEY || "gsk_fake123456789abcdefghijklmnopqrstuvwxyz",
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || "demo-gemini-key-get-from-google-ai-studio",
    PINECONE_API_KEY: process.env.PINECONE_API_KEY || "pcsk_3smRTf_Ss6oHrgWp52y9V4PbyoHpcdMyTKwEfePzBVvWDQeoYi3D3wd5XUxx3UhmxBbBE2",
    PINECONE_INDEX: process.env.PINECONE_INDEX || "new",
    
    // Tracking - Optional (disabled)
    NEXT_PUBLIC_C15T_URL: process.env.NEXT_PUBLIC_C15T_URL || undefined,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
