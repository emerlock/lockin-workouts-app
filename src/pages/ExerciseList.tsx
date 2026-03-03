import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ExerciseInfographic from "../compoents/ExerciseInfographic";
import {
  COOLDOWN_EXERCISE_IDS,
  STANDING_NO_EQUIPMENT_EXERCISES,
  WARMUP_STRETCH_EXERCISE_IDS,
} from "../lib/exercises";
import { validateSafeTextInput } from "../lib/inputGuard";
import { isSupabaseConfigured, isSupabaseSyncEnabled } from "../lib/supabase";
import { fetchExerciseCatalogFromSupabase } from "../lib/supabaseExercises";
import { useWorkoutStore } from "../lib/workoutStore";
import type { Exercise } from "../types/workout";

type ExerciseTypeFilter = "all" | Exercise["exerciseType"];
type PostureFilter = "all" | Exercise["posture"];
type FocusFilter = "all" | "warmup-stretch" | "cooldown";

export default function ExerciseList() {
  const EXERCISES_PER_PAGE = 10;
  const [searchParams, setSearchParams] = useSearchParams();
  const workouts = useWorkoutStore((state) => state.workouts);
  const [query, setQuery] = useState("");
  const [queryError, setQueryError] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [typeFilter, setTypeFilter] = useState<ExerciseTypeFilter>("all");
  const [postureFilter, setPostureFilter] = useState<PostureFilter>("all");
  const [focusFilter, setFocusFilter] = useState<FocusFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [allExercises, setAllExercises] = useState<Exercise[]>(STANDING_NO_EQUIPMENT_EXERCISES);
  const [warmupIds, setWarmupIds] = useState<Set<string>>(new Set(WARMUP_STRETCH_EXERCISE_IDS));
  const [cooldownIds, setCooldownIds] = useState<Set<string>>(new Set(COOLDOWN_EXERCISE_IDS));
  const activeTag = searchParams.get("tag")?.trim().toLowerCase() ?? "";

  useEffect(() => {
    let cancelled = false;

    async function syncExercises() {
      if (!isSupabaseSyncEnabled || !isSupabaseConfigured) {
        return;
      }

      try {
        const catalog = await fetchExerciseCatalogFromSupabase();
        if (cancelled) {
          return;
        }
        if (catalog.exercises.length > 0) {
          setAllExercises(catalog.exercises);
          setWarmupIds(catalog.warmupIds);
          setCooldownIds(catalog.cooldownIds);
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to sync exercises from Supabase.";
        console.error("[supabase-sync]", message);
      }
    }

    void syncExercises();

    return () => {
      cancelled = true;
    };
  }, []);

  const taggedExerciseIds = useMemo(() => {
    if (!activeTag) {
      return null;
    }

    const matchingWorkouts = workouts.filter((workout) =>
      workout.tags.some((tag) => tag.trim().toLowerCase() === activeTag),
    );
    return new Set(matchingWorkouts.flatMap((workout) => workout.exercises.map((exercise) => exercise.id)));
  }, [activeTag, workouts]);

  const filteredExercises = useMemo(() => {
    return allExercises.filter((exercise) => {
      const matchesTag = !taggedExerciseIds || taggedExerciseIds.has(exercise.id);
      const matchesQuery =
        query.trim().length === 0 ||
        exercise.name.toLowerCase().includes(query.toLowerCase()) ||
        exercise.description.toLowerCase().includes(query.toLowerCase());
      const matchesType = typeFilter === "all" || exercise.exerciseType === typeFilter;
      const matchesPosture = postureFilter === "all" || exercise.posture === postureFilter;
      const matchesFocus =
        focusFilter === "all" ||
        (focusFilter === "warmup-stretch" && warmupIds.has(exercise.id)) ||
        (focusFilter === "cooldown" && cooldownIds.has(exercise.id));
      return matchesTag && matchesQuery && matchesType && matchesPosture && matchesFocus;
    });
  }, [allExercises, query, typeFilter, postureFilter, focusFilter, taggedExerciseIds, warmupIds, cooldownIds]);
  const totalPages = Math.max(1, Math.ceil(filteredExercises.length / EXERCISES_PER_PAGE));
  const pageStart = (currentPage - 1) * EXERCISES_PER_PAGE;
  const pagedExercises = filteredExercises.slice(pageStart, pageStart + EXERCISES_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [query, typeFilter, postureFilter, focusFilter, activeTag]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  const clearTag = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("tag");
    setSearchParams(next);
  };

  return (
    <section className="space-y-5">
      <div className="card-modern">
        <h1 className="text-2xl font-bold text-brand-primary dark:text-purple-300 sm:text-3xl">
          Exercises
        </h1>
        <p className="mt-1 text-sm text-purple-700 dark:text-purple-200">
          Browse all no-equipment exercises, with form cues and infographics.
        </p>
      </div>

      <div className="card-modern sticky top-2 z-30 space-y-3 bg-white/95 backdrop-blur dark:bg-slate-900/95">
        {activeTag ? (
          <div className="flex flex-wrap items-center gap-2 rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 text-xs dark:border-orange-700 dark:bg-orange-950/30">
            <span className="font-semibold text-orange-900 dark:text-orange-200">Tag filter:</span>
            <span className="rounded-full bg-orange-200 px-2 py-0.5 font-bold text-orange-900 dark:bg-orange-900 dark:text-orange-100">
              {activeTag}
            </span>
            <button
              type="button"
              onClick={clearTag}
              className="rounded-md border border-orange-300 px-2 py-0.5 font-semibold text-orange-900 hover:bg-orange-100 dark:border-orange-700 dark:text-orange-200 dark:hover:bg-orange-900/40"
            >
              Clear
            </button>
          </div>
        ) : null}

        <label className="block">
          <input
            value={query}
            onChange={(event) => {
              const validated = validateSafeTextInput(event.target.value, {
                maxLength: 120,
                allowEmpty: true,
              });
              if (validated.error) {
                setQueryError(validated.error);
                return;
              }
              setQuery(validated.value);
              setQueryError("");
            }}
            placeholder="Search exercises..."
            className="input-modern"
          />
        </label>
        {queryError ? (
          <p className="text-xs font-medium text-orange-700 dark:text-orange-300">{queryError}</p>
        ) : null}

        {showFilters ? (
          <>
            <div className="flex flex-wrap gap-2">
              {(["all", "standing", "bodyweight"] as const).map((value) => {
                const active = typeFilter === value;
                return (
                  <button
                    key={`type-${value}`}
                    type="button"
                    onClick={() => setTypeFilter(value)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                      active
                        ? "bg-brand-primary text-white"
                        : "border border-purple-300 text-purple-800 dark:border-purple-700 dark:text-purple-200"
                    }`}
                  >
                    {value === "all" ? "All Types" : value === "standing" ? "Standing" : "Bodyweight"}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-2">
              {(["all", "warmup-stretch", "cooldown"] as const).map((value) => {
                const active = focusFilter === value;
                return (
                  <button
                    key={`focus-${value}`}
                    type="button"
                    onClick={() => setFocusFilter(value)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                      active
                        ? "bg-brand-secondary text-white"
                        : "border border-purple-300 text-purple-800 dark:border-purple-700 dark:text-purple-200"
                    }`}
                  >
                    {value === "all"
                      ? "All Focus Areas"
                      : value === "warmup-stretch"
                        ? "Warm-Up / Stretch"
                        : "Cooldown"}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-2">
              {(["all", "standing", "hands", "back", "prone"] as const).map((value) => {
                const active = postureFilter === value;
                const label =
                  value === "all"
                    ? "All Postures"
                    : value === "hands"
                      ? "Hands"
                      : value === "back"
                        ? "On Back"
                        : value === "prone"
                          ? "Prone"
                          : "Standing";

                return (
                  <button
                    key={`posture-${value}`}
                    type="button"
                    onClick={() => setPostureFilter(value)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                      active
                        ? "bg-brand-secondary text-white"
                        : "border border-orange-300 text-orange-900 dark:border-orange-700 dark:text-orange-200"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </>
        ) : null}

        <p className="text-xs font-semibold text-purple-700 dark:text-purple-300">
          {filteredExercises.length} exercises shown
        </p>
        <button
          type="button"
          onClick={() => setShowFilters((open) => !open)}
          className="flex w-full items-center justify-center gap-2 rounded-md border border-purple-300 bg-white/80 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-purple-800 transition hover:bg-white dark:border-purple-700 dark:bg-slate-800 dark:text-purple-200 dark:hover:bg-slate-700"
        >
          <span>{showFilters ? "Hide Filters" : "Show Filters"}</span>
          <svg
            viewBox="0 0 24 24"
            className={`h-4 w-4 transition-transform ${showFilters ? "rotate-180" : "rotate-0"}`}
            aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="grid gap-4">
        {pagedExercises.map((exercise) => (
          <article
            key={exercise.id}
            className="card-modern border-l-4 border-l-brand-secondary p-4 sm:p-6"
          >
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold text-brand-primaryDark dark:text-purple-200 sm:text-xl">
                {exercise.name}
              </h2>
              <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-semibold text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                {exercise.exerciseType}
              </span>
              <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-900 dark:bg-orange-950/60 dark:text-orange-200">
                {exercise.posture}
              </span>
              {warmupIds.has(exercise.id) ? (
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200">
                  warm-up/stretch
                </span>
              ) : null}
              {cooldownIds.has(exercise.id) ? (
                <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-semibold text-sky-900 dark:bg-sky-950/60 dark:text-sky-200">
                  cooldown
                </span>
              ) : null}
            </div>
            <p className="mt-2 text-sm text-purple-700 dark:text-purple-300">{exercise.description}</p>
            <ExerciseInfographic exercise={exercise} size="large" />
          </article>
        ))}
      </div>

      <div className="card-modern flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
          disabled={currentPage === 1}
          className="rounded-md border border-purple-300 px-3 py-1.5 text-xs font-semibold text-purple-800 disabled:cursor-not-allowed disabled:opacity-50 dark:border-purple-700 dark:text-purple-200"
        >
          Previous
        </button>
        <p className="text-xs font-semibold text-purple-700 dark:text-purple-300">
          Page {currentPage} of {totalPages}
        </p>
        <button
          type="button"
          onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="rounded-md border border-purple-300 px-3 py-1.5 text-xs font-semibold text-purple-800 disabled:cursor-not-allowed disabled:opacity-50 dark:border-purple-700 dark:text-purple-200"
        >
          Next
        </button>
      </div>
    </section>
  );
}
