import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ExerciseInfographic from "../compoents/ExerciseInfographic";
import { STANDING_NO_EQUIPMENT_EXERCISES } from "../lib/exercises";
import { useWorkoutStore } from "../lib/workoutStore";
import type { Exercise } from "../types/workout";

type ExerciseTypeFilter = "all" | Exercise["exerciseType"];
type PostureFilter = "all" | Exercise["posture"];

export default function ExerciseList() {
  const EXERCISES_PER_PAGE = 10;
  const [searchParams, setSearchParams] = useSearchParams();
  const workouts = useWorkoutStore((state) => state.workouts);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<ExerciseTypeFilter>("all");
  const [postureFilter, setPostureFilter] = useState<PostureFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const activeTag = searchParams.get("tag")?.trim().toLowerCase() ?? "";

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
    return STANDING_NO_EQUIPMENT_EXERCISES.filter((exercise) => {
      const matchesTag = !taggedExerciseIds || taggedExerciseIds.has(exercise.id);
      const matchesQuery =
        query.trim().length === 0 ||
        exercise.name.toLowerCase().includes(query.toLowerCase()) ||
        exercise.description.toLowerCase().includes(query.toLowerCase());
      const matchesType = typeFilter === "all" || exercise.exerciseType === typeFilter;
      const matchesPosture = postureFilter === "all" || exercise.posture === postureFilter;
      return matchesTag && matchesQuery && matchesType && matchesPosture;
    });
  }, [query, typeFilter, postureFilter, taggedExerciseIds]);
  const totalPages = Math.max(1, Math.ceil(filteredExercises.length / EXERCISES_PER_PAGE));
  const pageStart = (currentPage - 1) * EXERCISES_PER_PAGE;
  const pagedExercises = filteredExercises.slice(pageStart, pageStart + EXERCISES_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [query, typeFilter, postureFilter, activeTag]);

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
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search exercises..."
            className="input-modern"
          />
        </label>

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

        <p className="text-xs font-semibold text-purple-700 dark:text-purple-300">
          {filteredExercises.length} exercises shown
        </p>
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
