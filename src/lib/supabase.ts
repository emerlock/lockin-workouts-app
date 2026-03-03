import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL ?? "").trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY ?? "").trim();

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
export const isSupabaseSyncEnabled = import.meta.env.VITE_SUPABASE_SYNC === "true";

let browserClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.",
    );
  }

  if (!browserClient) {
    browserClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: "pkce",
      },
    });
  }

  return browserClient;
}

export async function pingSupabase() {
  if (!isSupabaseConfigured) {
    return { ok: false, message: "Missing Supabase environment variables." };
  }

  const supabase = getSupabaseClient();
  const { error } = await supabase.from("workouts").select("id").limit(1);

  if (error) {
    return { ok: false, message: error.message };
  }

  return { ok: true, message: "Connected successfully." };
}
