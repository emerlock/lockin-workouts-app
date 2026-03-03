import { Switch } from "@headlessui/react";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { getCurrentUser, signInWithMagicLink, signOutSupabase } from "../lib/supabaseAuth";
import { validateEmailInput } from "../lib/inputGuard";
import { isSupabaseConfigured, isSupabaseSyncEnabled, pingSupabase } from "../lib/supabase";
import { useThemeStore } from "../lib/themeStore";
import { useVoiceStore } from "../lib/voiceStore";

export default function Settings() {
  const [enabled, setEnabled] = useState(true);
  const [email, setEmail] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [authStatus, setAuthStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [authMessage, setAuthMessage] = useState("");
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [connectionMessage, setConnectionMessage] = useState("");
  const isDark = useThemeStore((state) => state.theme === "dark");
  const setTheme = useThemeStore((state) => state.setTheme);
  const preferredVoice = useVoiceStore((state) => state.preferredVoice);
  const setPreferredVoice = useVoiceStore((state) => state.setPreferredVoice);

  useEffect(() => {
    let cancelled = false;

    async function loadUser() {
      if (!isSupabaseConfigured) {
        return;
      }
      const currentUser = await getCurrentUser();
      if (!cancelled) {
        setUser(currentUser);
      }
    }

    void loadUser();

    return () => {
      cancelled = true;
    };
  }, []);

  const onTestConnection = async () => {
    setConnectionStatus("loading");
    const result = await pingSupabase();
    setConnectionStatus(result.ok ? "success" : "error");
    setConnectionMessage(result.message);
  };

  const onSignIn = async () => {
    const validatedEmail = validateEmailInput(email);
    if (validatedEmail.error) {
      setAuthStatus("error");
      setAuthMessage(validatedEmail.error);
      return;
    }

    setAuthStatus("loading");
    try {
      await signInWithMagicLink(validatedEmail.value);
      setAuthStatus("success");
      setAuthMessage("Magic link sent. Open your email and complete sign in.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to sign in.";
      setAuthStatus("error");
      setAuthMessage(message);
    }
  };

  const onSignOut = async () => {
    setAuthStatus("loading");
    try {
      await signOutSupabase();
      setUser(null);
      setAuthStatus("success");
      setAuthMessage("Signed out.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to sign out.";
      setAuthStatus("error");
      setAuthMessage(message);
    }
  };

  return (
    <section className="card-modern max-w-2xl space-y-5">
      <h1 className="text-2xl font-bold text-brand-primary dark:text-purple-300 sm:text-3xl">Settings</h1>
      <p className="text-sm text-purple-700 dark:text-purple-200">Customize your app preferences.</p>

      <div className="rounded-xl bg-brand-primarySoft p-4 dark:bg-purple-950">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-brand-primaryDark dark:text-purple-100">Theme</p>
            <p className="text-sm text-purple-700 dark:text-purple-200">Switch between light and dark mode.</p>
          </div>
          <Switch
            checked={isDark}
            onChange={(next) => setTheme(next ? "dark" : "light")}
            className={`${isDark ? "bg-brand-secondary" : "bg-purple-300"} relative inline-flex h-7 w-12 items-center rounded-full transition`}
          >
            <span
              className={`${isDark ? "translate-x-7" : "translate-x-1"} inline-block h-5 w-5 transform rounded-full bg-white transition`}
            />
          </Switch>
        </div>
      </div>

      <div className="rounded-xl bg-brand-primarySoft p-4 dark:bg-purple-950">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-brand-primaryDark dark:text-purple-100">Voice</p>
            <p className="text-sm text-purple-700 dark:text-purple-200">
              Choose your preferred announcement voice style.
            </p>
          </div>
          <div className="inline-flex items-center rounded-full border border-purple-300 bg-white p-1 dark:border-purple-700 dark:bg-slate-900">
            <button
              type="button"
              onClick={() => setPreferredVoice("female")}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                preferredVoice === "female"
                  ? "bg-brand-primary text-white"
                  : "text-purple-800 dark:text-purple-200"
              }`}
            >
              Female
            </button>
            <button
              type="button"
              onClick={() => setPreferredVoice("male")}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                preferredVoice === "male"
                  ? "bg-brand-primary text-white"
                  : "text-purple-800 dark:text-purple-200"
              }`}
            >
              Male
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-brand-primarySoft p-4 dark:bg-purple-950">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-brand-primaryDark dark:text-purple-100">Workout Reminders</p>
            <p className="text-sm text-purple-700 dark:text-purple-200">Enable reminder notifications (demo toggle).</p>
          </div>
          <Switch
            checked={enabled}
            onChange={setEnabled}
            className={`${enabled ? "bg-brand-secondary" : "bg-purple-300"} relative inline-flex h-7 w-12 items-center rounded-full transition`}
          >
            <span
              className={`${enabled ? "translate-x-7" : "translate-x-1"} inline-block h-5 w-5 transform rounded-full bg-white transition`}
            />
          </Switch>
        </div>
      </div>

      <div className="rounded-xl bg-brand-primarySoft p-4 dark:bg-purple-950">
        <div className="space-y-3">
          <div className="flex flex-col gap-1">
            <p className="font-semibold text-brand-primaryDark dark:text-purple-100">Supabase Connection</p>
            <p className="text-sm text-purple-700 dark:text-purple-200">
              Client uses publishable anon key only. Service role key must stay server-side.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            <span className="rounded-full bg-white px-2 py-1 text-purple-800 dark:bg-slate-900 dark:text-purple-200">
              Configured: {isSupabaseConfigured ? "Yes" : "No"}
            </span>
            <span className="rounded-full bg-white px-2 py-1 text-purple-800 dark:bg-slate-900 dark:text-purple-200">
              Sync enabled: {isSupabaseSyncEnabled ? "Yes" : "No"}
            </span>
          </div>
          <button
            type="button"
            onClick={onTestConnection}
            disabled={connectionStatus === "loading"}
            className="btn-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            {connectionStatus === "loading" ? "Testing..." : "Test Supabase Connection"}
          </button>
          {connectionMessage ? (
            <p
              className={`text-xs font-medium ${
                connectionStatus === "success"
                  ? "text-emerald-700 dark:text-emerald-300"
                  : "text-orange-800 dark:text-orange-200"
              }`}
            >
              {connectionMessage}
            </p>
          ) : null}
        </div>
      </div>

      <div className="rounded-xl bg-brand-primarySoft p-4 dark:bg-purple-950">
        <div className="space-y-3">
          <div>
            <p className="font-semibold text-brand-primaryDark dark:text-purple-100">Account</p>
            <p className="text-sm text-purple-700 dark:text-purple-200">
              Sign in to save custom workouts per user with RLS-protected access.
            </p>
          </div>
          {user ? (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-purple-800 dark:text-purple-200">
                Signed in as {user.email ?? user.id}
              </p>
              <button
                type="button"
                onClick={onSignOut}
                disabled={authStatus === "loading"}
                className="rounded-md border border-purple-300 px-3 py-2 text-xs font-semibold text-purple-800 disabled:cursor-not-allowed disabled:opacity-60 dark:border-purple-700 dark:text-purple-200"
              >
                {authStatus === "loading" ? "Working..." : "Sign Out"}
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="input-modern"
              />
              <button
                type="button"
                onClick={onSignIn}
                disabled={authStatus === "loading" || !isSupabaseConfigured}
                className="btn-primary disabled:cursor-not-allowed disabled:opacity-60"
              >
                {authStatus === "loading" ? "Working..." : "Send Magic Link"}
              </button>
            </div>
          )}
          {authMessage ? (
            <p
              className={`text-xs font-medium ${
                authStatus === "error"
                  ? "text-orange-800 dark:text-orange-200"
                  : "text-emerald-700 dark:text-emerald-300"
              }`}
            >
              {authMessage}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
