import { Switch } from "@headlessui/react";
import { useState } from "react";
import { useThemeStore } from "../lib/themeStore";
import { useVoiceStore } from "../lib/voiceStore";

export default function Settings() {
  const [enabled, setEnabled] = useState(true);
  const isDark = useThemeStore((state) => state.theme === "dark");
  const setTheme = useThemeStore((state) => state.setTheme);
  const preferredVoice = useVoiceStore((state) => state.preferredVoice);
  const setPreferredVoice = useVoiceStore((state) => state.setPreferredVoice);

  return (
    <section className="card-modern max-w-2xl space-y-5">
      <h1 className="text-3xl font-bold text-brand-primary dark:text-purple-300">Settings</h1>
      <p className="text-sm text-purple-700 dark:text-purple-200">Customize your app preferences.</p>

      <div className="rounded-xl bg-brand-primarySoft p-4 dark:bg-purple-950">
        <div className="flex items-center justify-between">
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
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-brand-primaryDark dark:text-purple-100">Voice</p>
            <p className="text-sm text-purple-700 dark:text-purple-200">
              Choose your preferred announcement voice style.
            </p>
          </div>
          <div className="flex items-center rounded-full border border-purple-300 bg-white p-1 dark:border-purple-700 dark:bg-slate-900">
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
        <div className="flex items-center justify-between">
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
    </section>
  );
}
