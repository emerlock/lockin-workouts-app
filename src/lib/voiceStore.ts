import { create } from "zustand";
import { persist } from "zustand/middleware";

export type VoicePreference = "female" | "male";

type VoiceState = {
  preferredVoice: VoicePreference;
  setPreferredVoice: (preferredVoice: VoicePreference) => void;
};

export const useVoiceStore = create<VoiceState>()(
  persist(
    (set) => ({
      preferredVoice: "female",
      setPreferredVoice: (preferredVoice) => set({ preferredVoice }),
    }),
    { name: "workout-voice-preference" },
  ),
);
