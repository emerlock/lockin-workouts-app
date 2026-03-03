import { Link, useParams } from "react-router-dom";
import { useMemo, useRef, useState } from "react";
import ExerciseInfographic from "../compoents/ExerciseInfographic";
import RoutinePlayer from "../compoents/RoutinePlayer";
import {
  buildDefaultCooldownRoutine,
  buildDefaultWarmupRoutine,
  getDefaultCooldownExercises,
  getDefaultWarmupExercises,
} from "../lib/routines";
import { useWorkoutStore } from "../lib/workoutStore";

export default function WorkoutDetail() {
  const [startSignal, setStartSignal] = useState<number | undefined>(undefined);
  const [includeWarmup, setIncludeWarmup] = useState(false);
  const [includeCooldown, setIncludeCooldown] = useState(false);
  const [showExercises, setShowExercises] = useState(false);
  const routineSectionRef = useRef<HTMLDivElement | null>(null);
  const { workoutId } = useParams();
  const workout = useWorkoutStore((state) =>
    workoutId ? state.getWorkoutById(workoutId) : undefined,
  );
  const isStandaloneWarmupOrCooldown = (workout?.tags ?? []).some((tag) => {
    const normalized = tag.toLowerCase();
    return normalized === "warm-up" || normalized === "cooldown";
  });
  const optionalWarmupIntervals = useMemo(
    () =>
      buildDefaultWarmupRoutine().intervals.map((interval) => ({
        ...interval,
        id: `optional-warmup-${interval.id}`,
      })),
    [],
  );
  const optionalCooldownIntervals = useMemo(
    () =>
      buildDefaultCooldownRoutine().intervals.map((interval) => ({
        ...interval,
        id: `optional-cooldown-${interval.id}`,
      })),
    [],
  );
  const effectiveIntervals = useMemo(() => {
    if (!workout) {
      return [];
    }

    return [
      ...(!isStandaloneWarmupOrCooldown && includeWarmup ? optionalWarmupIntervals : []),
      ...workout.routine.intervals,
      ...(!isStandaloneWarmupOrCooldown && includeCooldown ? optionalCooldownIntervals : []),
    ];
  }, [
    workout,
    includeWarmup,
    includeCooldown,
    isStandaloneWarmupOrCooldown,
    optionalWarmupIntervals,
    optionalCooldownIntervals,
  ]);
  const totalRoutineSeconds = effectiveIntervals.reduce(
    (total, interval) => total + interval.durationSeconds,
    0,
  );
  const optionalWarmupExercises = useMemo(() => getDefaultWarmupExercises(), []);
  const optionalCooldownExercises = useMemo(() => getDefaultCooldownExercises(), []);
  const warmupExercisesForDisplay =
    !isStandaloneWarmupOrCooldown && includeWarmup ? optionalWarmupExercises : [];
  const coreExercisesForDisplay = workout?.exercises ?? [];
  const cooldownExercisesForDisplay =
    !isStandaloneWarmupOrCooldown && includeCooldown ? optionalCooldownExercises : [];
  const effectiveExercises = useMemo(() => {
    if (!workout) {
      return [];
    }

    const merged = [
      ...(!isStandaloneWarmupOrCooldown && includeWarmup ? optionalWarmupExercises : []),
      ...workout.exercises,
      ...(!isStandaloneWarmupOrCooldown && includeCooldown ? optionalCooldownExercises : []),
    ];
    const seen = new Set<string>();
    return merged.filter((exercise) => {
      if (seen.has(exercise.id)) {
        return false;
      }
      seen.add(exercise.id);
      return true;
    });
  }, [
    workout,
    includeWarmup,
    includeCooldown,
    isStandaloneWarmupOrCooldown,
    optionalWarmupExercises,
    optionalCooldownExercises,
  ]);

  if (!workout) {
    return (
      <section className="card-modern border-orange-200 bg-orange-50 text-orange-900 dark:border-orange-700 dark:bg-orange-950/30 dark:text-orange-200">
        <p className="font-semibold">Workout not found.</p>
        <Link to="/workouts" className="mt-2 inline-block text-sm font-medium underline">
          Back to Workouts
        </Link>
      </section>
    );
  }

  const onPlayWorkout = () => {
    setStartSignal((signal) => (signal ?? 0) + 1);
    routineSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <section className="card-modern">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-brand-primary dark:text-purple-300 sm:text-3xl">
          Workout Detail
        </h1>
        <button
          type="button"
          onClick={onPlayWorkout}
          aria-label="Play workout"
          title="Play workout"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary text-white shadow-md transition hover:bg-brand-primaryDark"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
            <path d="M8 6v12l10-6-10-6z" fill="currentColor" />
          </svg>
        </button>
      </div>
      <div className="-mx-2 mt-5 rounded-xl bg-brand-primarySoft p-4 sm:mx-0 sm:p-5 dark:bg-purple-950">
        <h2 className="text-xl font-semibold text-brand-primaryDark dark:text-purple-200 sm:text-2xl">
          {workout.name}
        </h2>
        <p className="mt-2 text-sm text-purple-700 dark:text-purple-300">{workout.description}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {workout.tags.map((tag) => (
            <Link
              key={`${workout.id}-${tag}`}
              to={`/exercises?tag=${encodeURIComponent(tag)}`}
              className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-semibold text-purple-800 dark:bg-purple-900 dark:text-purple-200"
            >
              {tag}
            </Link>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2 sm:gap-3">
          <span className="rounded-full bg-white px-4 py-1 text-sm font-semibold text-brand-primary dark:bg-slate-800 dark:text-purple-100">
            Sets: {workout.sets}
          </span>
          <span className="rounded-full bg-brand-secondary px-4 py-1 text-sm font-semibold text-white">
            Reps: {workout.reps}
          </span>
          <span className="rounded-full bg-purple-700 px-4 py-1 text-sm font-semibold text-white">
            Exercises: {effectiveExercises.length}
          </span>
        </div>

        {!isStandaloneWarmupOrCooldown ? (
          <div className="mt-4 flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-xs font-semibold text-purple-800 dark:text-purple-200">
              <input
                type="checkbox"
                checked={includeWarmup}
                onChange={(event) => setIncludeWarmup(event.target.checked)}
              />
              Include warm-up (+5 min)
            </label>
            <label className="flex items-center gap-2 text-xs font-semibold text-purple-800 dark:text-purple-200">
              <input
                type="checkbox"
                checked={includeCooldown}
                onChange={(event) => setIncludeCooldown(event.target.checked)}
              />
              Include cooldown (+5 min)
            </label>
          </div>
        ) : null}

        <div className="mt-5">
          <button
            type="button"
            onClick={() => setShowExercises((open) => !open)}
            aria-expanded={showExercises}
            className="group flex w-full cursor-pointer items-center justify-between rounded-lg border-2 border-purple-300 bg-white px-3 py-2 text-left text-sm font-bold text-purple-800 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-secondary hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary dark:border-purple-700 dark:bg-slate-800 dark:text-purple-100 dark:hover:border-brand-secondary"
          >
            <span className="flex items-center gap-2">
              Exercises
              <span className="text-[11px] font-semibold uppercase tracking-wide text-purple-600 group-hover:text-brand-secondary dark:text-purple-300">
                {showExercises ? "Hide list" : "Show list"}
              </span>
            </span>
            <svg
              viewBox="0 0 24 24"
              className={`h-5 w-5 transition-transform ${showExercises ? "rotate-180" : "rotate-0"}`}
              aria-hidden="true"
            >
              <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          {showExercises ? (
            effectiveExercises.length === 0 ? (
              <p className="mt-2 text-sm text-purple-700 dark:text-purple-300">No exercises selected.</p>
            ) : (
              <div className="mt-2 space-y-4">
                {warmupExercisesForDisplay.length > 0 ? (
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-300 sm:text-base">
                      Warm-Up
                    </p>
                    <ul className="mt-2 grid gap-2">
                      {warmupExercisesForDisplay.map((exercise) => (
                        <li
                          key={`warmup-${exercise.id}`}
                          className="rounded-md bg-white px-3 py-3 text-sm text-purple-800 dark:bg-slate-800 dark:text-purple-100"
                        >
                          <p className="font-semibold">{exercise.name}</p>
                          <p className="mt-1 text-xs text-purple-700 dark:text-purple-300">
                            {exercise.description}
                          </p>
                          <ExerciseInfographic exercise={exercise} />
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <div
                  className={
                    warmupExercisesForDisplay.length > 0
                      ? "border-t border-purple-200 pt-4 dark:border-purple-700"
                      : ""
                  }
                >
                  <p className="text-sm font-bold uppercase tracking-wide text-purple-700 dark:text-purple-200 sm:text-base">
                    Core Workout
                  </p>
                  {coreExercisesForDisplay.length === 0 ? (
                    <p className="mt-2 text-sm text-purple-700 dark:text-purple-300">
                      No core workout exercises selected.
                    </p>
                  ) : (
                    <ul className="mt-2 grid gap-2">
                      {coreExercisesForDisplay.map((exercise) => (
                        <li
                          key={`core-${exercise.id}`}
                          className="rounded-md bg-white px-3 py-3 text-sm text-purple-800 dark:bg-slate-800 dark:text-purple-100"
                        >
                          <p className="font-semibold">{exercise.name}</p>
                          <p className="mt-1 text-xs text-purple-700 dark:text-purple-300">
                            {exercise.description}
                          </p>
                          <ExerciseInfographic exercise={exercise} />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {cooldownExercisesForDisplay.length > 0 ? (
                  <div className="border-t border-purple-200 pt-4 dark:border-purple-700">
                    <p className="text-sm font-bold uppercase tracking-wide text-sky-700 dark:text-sky-300 sm:text-base">
                      Cooldown
                    </p>
                    <ul className="mt-2 grid gap-2">
                      {cooldownExercisesForDisplay.map((exercise) => (
                        <li
                          key={`cooldown-${exercise.id}`}
                          className="rounded-md bg-white px-3 py-3 text-sm text-purple-800 dark:bg-slate-800 dark:text-purple-100"
                        >
                          <p className="font-semibold">{exercise.name}</p>
                          <p className="mt-1 text-xs text-purple-700 dark:text-purple-300">
                            {exercise.description}
                          </p>
                          <ExerciseInfographic exercise={exercise} />
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            )
          ) : null}
        </div>

        <div ref={routineSectionRef} className="mt-5">
          <p className="text-sm font-semibold text-purple-700 dark:text-purple-200">
            Routine: {workout.routine.name}
          </p>
          <p className="mt-1 text-xs text-purple-700 dark:text-purple-300">
            Total duration: about {Math.round(totalRoutineSeconds / 60)} minutes
          </p>
          {effectiveIntervals.length === 0 ? (
            <p className="mt-2 text-sm text-purple-700 dark:text-purple-300">
              Add exercises to generate a 30s workout / 30s walk routine.
            </p>
          ) : (
            <div className="mt-2">
              <RoutinePlayer
                intervals={effectiveIntervals}
                workoutName={workout.name}
                startSignal={startSignal}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
