export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

export const AUTH_NOT_CONFIGURED_MESSAGE =
  "Accounts are not switched on yet. Add the Supabase keys from .env.example to enable sign-in and booking.";
