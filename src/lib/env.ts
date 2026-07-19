import { z } from "zod";

// Treats an empty string the same as an unset variable, since .env files
// commonly leave optional keys present but blank (e.g. `BILLPLZ_API_KEY=`).
const optionalString = (schema: z.ZodString) =>
  z.preprocess((val) => (val === "" ? undefined : val), schema.optional());

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_SITE_URL: optionalString(z.string().url()),
  // Server-only: bypasses RLS. Never expose to the client.
  SUPABASE_SERVICE_ROLE_KEY: optionalString(z.string().min(1)),
  // Billplz (Malaysian payment gateway) - optional until the user provides sandbox/live keys.
  BILLPLZ_API_KEY: optionalString(z.string().min(1)),
  BILLPLZ_COLLECTION_ID: optionalString(z.string().min(1)),
  BILLPLZ_X_SIGNATURE_KEY: optionalString(z.string().min(1)),
  BILLPLZ_SANDBOX: optionalString(z.string()),
});

const _env = envSchema.safeParse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  BILLPLZ_API_KEY: process.env.BILLPLZ_API_KEY,
  BILLPLZ_COLLECTION_ID: process.env.BILLPLZ_COLLECTION_ID,
  BILLPLZ_X_SIGNATURE_KEY: process.env.BILLPLZ_X_SIGNATURE_KEY,
  BILLPLZ_SANDBOX: process.env.BILLPLZ_SANDBOX,
});

if (!_env.success) {
  console.error("❌ Invalid environment variables:", _env.error.format());
  throw new Error("Invalid environment variables");
}

export const env = _env.data;

export const isServiceRoleConfigured = Boolean(env.SUPABASE_SERVICE_ROLE_KEY);

export const isPaymentsConfigured = Boolean(
  env.BILLPLZ_API_KEY && env.BILLPLZ_COLLECTION_ID && env.BILLPLZ_X_SIGNATURE_KEY && isServiceRoleConfigured
);
