import { useEffect, useMemo, useRef, useState } from "react";
import { useVoiceStore } from "../lib/voiceStore";
import type { RoutineInterval } from "../types/workout";

type RoutinePlayerProps = {
  intervals: RoutineInterval[];
  workoutName: string;
  startSignal?: number;
};

function formatSeconds(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function RoutinePlayer({ intervals, workoutName, startSignal }: RoutinePlayerProps) {
  const preferredVoice = useVoiceStore((state) => state.preferredVoice);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showFloatingBox, setShowFloatingBox] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(
    intervals[0]?.durationSeconds ?? 0,
  );
  const audioContextRef = useRef<AudioContext | null>(null);
  const previousIndexRef = useRef<number>(0);
  const listContainerRef = useRef<HTMLOListElement | null>(null);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const preferredVoiceRef = useRef<SpeechSynthesisVoice | null>(null);

  const totalDurationSeconds = useMemo(
    () => intervals.reduce((total, interval) => total + interval.durationSeconds, 0),
    [intervals],
  );

  const elapsedSeconds = useMemo(() => {
    const completed = intervals
      .slice(0, currentIndex)
      .reduce((total, interval) => total + interval.durationSeconds, 0);
    const currentIntervalDuration = intervals[currentIndex]?.durationSeconds ?? 0;
    return completed + (currentIntervalDuration - remainingSeconds);
  }, [currentIndex, intervals, remainingSeconds]);
  const remainingWorkoutSeconds = Math.max(totalDurationSeconds - elapsedSeconds, 0);

  const progressPercent = totalDurationSeconds
    ? Math.min((elapsedSeconds / totalDurationSeconds) * 100, 100)
    : 0;

  const isComplete =
    intervals.length > 0 &&
    currentIndex === intervals.length - 1 &&
    remainingSeconds === 0;

  useEffect(() => {
    setIsPlaying(false);
    setShowFloatingBox(false);
    setCurrentIndex(0);
    setRemainingSeconds(intervals[0]?.durationSeconds ?? 0);
    previousIndexRef.current = 0;
  }, [intervals]);

  const playSwitchChime = () => {
    const AudioContextCtor = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextCtor) {
      return;
    }

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContextCtor();
    }

    const ctx = audioContextRef.current;
    if (ctx.state === "suspended") {
      void ctx.resume();
    }

    const now = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(0.22, now + 0.01);
    master.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
    master.connect(ctx.destination);

    const tones: Array<{ frequency: number; type: OscillatorType; detune?: number; duration: number }> = [
      { frequency: 1046.5, type: "sine", duration: 0.7 }, // C6
      { frequency: 1318.5, type: "triangle", duration: 0.6 }, // E6
      { frequency: 1568.0, type: "sine", detune: 4, duration: 0.5 }, // G6
    ];

    tones.forEach((tone, index) => {
      const osc = ctx.createOscillator();
      const partialGain = ctx.createGain();
      osc.type = tone.type;
      osc.frequency.setValueAtTime(tone.frequency, now);
      if (tone.detune) {
        osc.detune.setValueAtTime(tone.detune, now);
      }

      const startAt = now + index * 0.015;
      partialGain.gain.setValueAtTime(0.0001, startAt);
      partialGain.gain.exponentialRampToValueAtTime(0.32 / (index + 1), startAt + 0.01);
      partialGain.gain.exponentialRampToValueAtTime(0.0001, startAt + tone.duration);

      osc.connect(partialGain);
      partialGain.connect(master);
      osc.start(startAt);
      osc.stop(startAt + tone.duration);
    });
  };

  const pickBestLocalVoice = (voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null => {
    if (voices.length === 0) {
      return null;
    }

    const femaleHints = [
      "female",
      "woman",
      "samantha",
      "victoria",
      "zira",
      "aria",
      "jenny",
      "ava",
      "allison",
      "susan",
      "sara",
      "katya",
    ];
    const maleHints = [
      "male",
      "man",
      "david",
      "mark",
      "guy",
      "roger",
      "jason",
      "daniel",
      "brian",
      "tom",
      "matthew",
      "ryan",
    ];

    const scoreVoice = (voice: SpeechSynthesisVoice): number => {
      const name = voice.name.toLowerCase();
      const lang = voice.lang.toLowerCase();

      let score = 0;
      if (voice.localService) score += 40;
      if (lang.startsWith("en-us")) score += 35;
      else if (lang.startsWith("en")) score += 25;
      if (voice.default) score += 10;
      if (name.includes("neural") || name.includes("natural")) score += 35;
      if (name.includes("enhanced") || name.includes("premium")) score += 20;
      if (name.includes("siri") || name.includes("google") || name.includes("microsoft")) score += 8;
      if (preferredVoice === "female" && femaleHints.some((hint) => name.includes(hint))) score += 22;
      if (preferredVoice === "male" && maleHints.some((hint) => name.includes(hint))) score += 22;
      return score;
    };

    const sorted = [...voices].sort((a, b) => scoreVoice(b) - scoreVoice(a));
    return sorted[0] ?? null;
  };

  const announceWorkoutStart = () => {
    if (!("speechSynthesis" in window)) {
      return;
    }

    const synth = window.speechSynthesis;
    if (!preferredVoiceRef.current) {
      preferredVoiceRef.current = pickBestLocalVoice(synth.getVoices());
    }

    const minutes = Math.floor(totalDurationSeconds / 60);
    const seconds = totalDurationSeconds % 60;
    const timeText =
      seconds === 0
        ? `${minutes} minutes`
        : `${minutes} minutes and ${seconds} seconds`;
    const message = `Starting workout. ${workoutName}. Estimated time ${timeText}.`;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.rate = 0.96;
    utterance.pitch = 1.02;
    if (preferredVoiceRef.current) {
      utterance.voice = preferredVoiceRef.current;
    }
    synth.speak(utterance);
  };

  const announceIntervalName = (intervalLabel: string) => {
    if (!("speechSynthesis" in window)) {
      return;
    }

    const synth = window.speechSynthesis;
    if (!preferredVoiceRef.current) {
      preferredVoiceRef.current = pickBestLocalVoice(synth.getVoices());
    }

    const utterance = new SpeechSynthesisUtterance(intervalLabel);
    utterance.rate = 1;
    utterance.pitch = 1;
    if (preferredVoiceRef.current) {
      utterance.voice = preferredVoiceRef.current;
    }
    synth.speak(utterance);
  };

  useEffect(() => {
    if (!("speechSynthesis" in window)) {
      return;
    }

    const synth = window.speechSynthesis;
    const updatePreferredVoice = () => {
      preferredVoiceRef.current = pickBestLocalVoice(synth.getVoices());
    };

    updatePreferredVoice();
    synth.addEventListener("voiceschanged", updatePreferredVoice);
    return () => synth.removeEventListener("voiceschanged", updatePreferredVoice);
  }, [preferredVoice]);

  useEffect(() => {
    if (!isPlaying || intervals.length === 0) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setRemainingSeconds((seconds) => Math.max(seconds - 1, 0));
    }, 1000);

    return () => window.clearTimeout(timeoutId);
  }, [isPlaying, intervals.length, currentIndex, remainingSeconds]);

  useEffect(() => {
    if (!isPlaying || remainingSeconds > 0 || intervals.length === 0) {
      return;
    }

    if (currentIndex >= intervals.length - 1) {
      setIsPlaying(false);
      return;
    }

    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    setRemainingSeconds(intervals[nextIndex].durationSeconds);
  }, [isPlaying, remainingSeconds, currentIndex, intervals]);

  useEffect(() => {
    if (!isPlaying) {
      previousIndexRef.current = currentIndex;
      return;
    }

    if (currentIndex !== previousIndexRef.current) {
      playSwitchChime();
      announceIntervalName(intervals[currentIndex].label);
      previousIndexRef.current = currentIndex;
    }
  }, [currentIndex, isPlaying, intervals]);

  useEffect(() => {
    if (!isPlaying || intervals.length === 0) {
      return;
    }

    const atStartOfFirstInterval =
      currentIndex === 0 && remainingSeconds === intervals[0].durationSeconds;
    if (atStartOfFirstInterval) {
      announceIntervalName(intervals[0].label);
    }
  }, [isPlaying, currentIndex, remainingSeconds, intervals]);

  useEffect(() => {
    if (startSignal === undefined || intervals.length === 0) {
      return;
    }

    setShowFloatingBox(true);
    setCurrentIndex(0);
    setRemainingSeconds(intervals[0].durationSeconds);
    previousIndexRef.current = 0;
    announceWorkoutStart();
    setIsPlaying(true);
  }, [startSignal, intervals]);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const container = listContainerRef.current;
    const activeItem = itemRefs.current[currentIndex];
    if (!container || !activeItem) {
      return;
    }

    const nextScrollTop = activeItem.offsetTop - container.offsetTop;
    container.scrollTo({
      top: Math.max(nextScrollTop, 0),
      behavior: "smooth",
    });
  }, [currentIndex, isPlaying]);

  const onPlayPause = () => {
    if (intervals.length === 0) {
      return;
    }

    if (isComplete) {
      setShowFloatingBox(true);
      setCurrentIndex(0);
      setRemainingSeconds(intervals[0].durationSeconds);
      previousIndexRef.current = 0;
      announceWorkoutStart();
      setIsPlaying(true);
      return;
    }

    if (
      !isPlaying &&
      currentIndex === 0 &&
      remainingSeconds === intervals[0].durationSeconds
    ) {
      setShowFloatingBox(true);
      announceWorkoutStart();
    }

    setIsPlaying((playing) => !playing);
  };

  const onReset = () => {
    setIsPlaying(false);
    setShowFloatingBox(false);
    setCurrentIndex(0);
    setRemainingSeconds(intervals[0]?.durationSeconds ?? 0);
    previousIndexRef.current = 0;
  };

  if (intervals.length === 0) {
    return null;
  }

  const currentInterval = intervals[currentIndex];
  const nextInterval = intervals[currentIndex + 1];
  const currentIntervalDuration = currentInterval.durationSeconds;
  const intervalProgressPercent = currentIntervalDuration
    ? Math.min(((currentIntervalDuration - remainingSeconds) / currentIntervalDuration) * 100, 100)
    : 0;

  return (
    <div className="rounded-xl border border-purple-200 bg-white p-4 dark:border-purple-700 dark:bg-slate-900">
      <p className="text-sm font-semibold text-purple-800 dark:text-purple-200">Interval Player</p>
      <p className="mt-1 text-xs text-purple-700 dark:text-purple-300">
        Interval {currentIndex + 1} of {intervals.length}
      </p>
      <p className="mt-2 text-lg font-bold text-brand-primary dark:text-purple-200">
        {currentInterval.label}
      </p>
      <p className="text-xs text-purple-700 dark:text-purple-300">
        {currentInterval.description}
      </p>
      <p className="text-sm text-purple-700 dark:text-purple-300">
        Time left: {formatSeconds(remainingSeconds)}
      </p>
      <p className="mt-1 text-xs text-purple-600 dark:text-purple-300">
        {nextInterval ? `Next: ${nextInterval.label}` : "Last interval"}
      </p>

      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-purple-100 dark:bg-purple-950">
        <div
          className="h-full bg-brand-secondary transition-all"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <p className="mt-1 text-xs text-purple-700 dark:text-purple-300">
        {formatSeconds(elapsedSeconds)} / {formatSeconds(totalDurationSeconds)}
      </p>

      <div className="mt-3 flex gap-2">
        <button type="button" onClick={onPlayPause} className="btn-primary">
          {isPlaying ? "Pause" : isComplete ? "Replay" : "Play"}
        </button>
        <button type="button" onClick={onReset} className="btn-secondary">
          Reset
        </button>
      </div>

      <div className="relative mt-3">
        <ol ref={listContainerRef} className="scroll-modern grid max-h-72 gap-2 overflow-y-auto pr-2">
          {intervals.map((interval, index) => {
            const isActive = isPlaying && index === currentIndex;
            return (
              <li
                key={interval.id}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                className={`rounded-md px-3 py-2 text-sm transition ${
                  isActive
                    ? "border-2 border-brand-secondary bg-orange-100 text-orange-950 shadow-md ring-2 ring-orange-300 dark:bg-orange-950/50 dark:text-orange-100 dark:ring-orange-700"
                    : "bg-purple-50 text-purple-800 dark:bg-slate-800 dark:text-purple-100"
                }`}
              >
                <p className={isActive ? "text-xl font-black sm:text-2xl" : "font-semibold"}>
                  {index + 1}. {interval.label}
                </p>
                <p className={isActive ? "mt-1 text-sm font-semibold sm:text-base" : "mt-0.5 text-xs"}>
                  {interval.description}
                </p>
                <p className={isActive ? "mt-1 text-base font-bold sm:text-lg" : "text-xs"}>
                  {interval.durationSeconds}s {interval.type === "walk" ? "recovery" : "work"}
                </p>
              </li>
            );
          })}
        </ol>
      </div>

      {showFloatingBox ? (
        <div className="fixed bottom-4 right-4 z-50 w-72 rounded-2xl border border-orange-300 bg-white/95 p-4 shadow-2xl backdrop-blur dark:border-orange-700 dark:bg-slate-900/95">
          <button
            type="button"
            onClick={() => setIsPlaying((playing) => !playing)}
            aria-label={isPlaying ? "Pause workout" : "Resume workout"}
            title={isPlaying ? "Pause workout" : "Resume workout"}
            className="absolute right-3 top-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary text-white shadow-md transition hover:bg-brand-primaryDark"
          >
            {isPlaying ? (
              <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
                <path d="M7 5h4v14H7V5zm6 0h4v14h-4V5z" fill="currentColor" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
                <path d="M8 6v12l10-6-10-6z" fill="currentColor" />
              </svg>
            )}
          </button>
          <p className="text-xs font-semibold uppercase tracking-wide text-orange-700 dark:text-orange-300">
            Now Playing
          </p>
          <p className="mt-1 text-lg font-black text-brand-primary dark:text-purple-200">
            {currentInterval.label}
          </p>
          <div className="mt-3 grid gap-2 text-sm">
            <div className="relative overflow-hidden rounded-lg bg-orange-50 dark:bg-orange-950/40">
              <div
                className="absolute inset-y-0 left-0 bg-brand-secondary/30 transition-all dark:bg-brand-secondary/40"
                style={{ width: `${intervalProgressPercent}%` }}
              />
              <div className="relative flex items-center justify-between px-3 py-2">
                <span className="font-semibold text-orange-900 dark:text-orange-200">Interval Left</span>
                <span className="font-black text-orange-900 dark:text-orange-200">
                  {formatSeconds(remainingSeconds)}
                </span>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg bg-purple-50 dark:bg-purple-950/50">
              <div
                className="absolute inset-y-0 left-0 bg-brand-primary/25 transition-all dark:bg-brand-primary/35"
                style={{ width: `${progressPercent}%` }}
              />
              <div className="relative flex items-center justify-between px-3 py-2">
                <span className="font-semibold text-purple-900 dark:text-purple-200">Workout Left</span>
                <span className="font-black text-purple-900 dark:text-purple-200">
                  {formatSeconds(remainingWorkoutSeconds)}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
