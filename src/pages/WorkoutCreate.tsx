import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import ExerciseInfographic from "../compoents/ExerciseInfographic";
import { STANDING_NO_EQUIPMENT_EXERCISES } from "../lib/exercises";
import { buildStandingIntervalRoutine } from "../lib/routines";
import { useWorkoutStore } from "../lib/workoutStore";

export default function WorkoutCreate() {
  const MIN_EXERCISES = 6;
  const EXERCISES_PER_PAGE = 5;
  const addWorkout = useWorkoutStore((state) => state.addWorkout);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(10);
  const [selectedExerciseIds, setSelectedExerciseIds] = useState<string[]>([]);
  const [selectionError, setSelectionError] = useState("");
  const [exerciseFilter, setExerciseFilter] = useState<"all" | "standing" | "bodyweight">("all");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredExercises = STANDING_NO_EQUIPMENT_EXERCISES.filter((exercise) =>
    exerciseFilter === "all" ? true : exercise.exerciseType === exerciseFilter,
  );
  const totalPages = Math.max(1, Math.ceil(filteredExercises.length / EXERCISES_PER_PAGE));
  const pageStart = (currentPage - 1) * EXERCISES_PER_PAGE;
  const pagedExercises = filteredExercises.slice(
    pageStart,
    pageStart + EXERCISES_PER_PAGE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [exerciseFilter]);

  const onExerciseToggle = (exerciseId: string, checked: boolean) => {
    setSelectedExerciseIds((prev) => {
      if (checked) {
        return prev.includes(exerciseId) ? prev : [...prev, exerciseId];
      }

      return prev.filter((id) => id !== exerciseId);
    });
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim()) {
      return;
    }

    const exercises = STANDING_NO_EQUIPMENT_EXERCISES.filter((exercise) =>
      selectedExerciseIds.includes(exercise.id),
    );

    if (exercises.length < MIN_EXERCISES) {
      setSelectionError(`Select at least ${MIN_EXERCISES} different exercises.`);
      return;
    }

    const typeTags = Array.from(
      new Set(
        exercises.map((exercise) =>
          exercise.exerciseType === "bodyweight" ? "bodyweight" : "standing",
        ),
      ),
    );
    const postureTags = Array.from(new Set(exercises.map((exercise) => exercise.posture)));
    const tags = Array.from(
      new Set([
        ...typeTags,
        ...postureTags.map((posture) => {
          if (posture === "hands") return "hands-based";
          if (posture === "back") return "on-back";
          if (posture === "prone") return "prone";
          return "upright";
        }),
        "custom",
      ]),
    );
    const description = `Custom workout with ${exercises.length} exercises focused on ${tags
      .slice(0, 3)
      .join(", ")}.`;

    setSelectionError("");
    addWorkout({
      name: name.trim(),
      description,
      tags,
      sets,
      reps,
      exercises,
      routine: buildStandingIntervalRoutine(exercises),
    });
    navigate("/workouts");
  };

  return (
    <section className="card-modern max-w-2xl">
      <h1 className="mb-1 text-3xl font-bold text-brand-primary dark:text-purple-300">Create Workout</h1>
      <p className="mb-6 text-sm text-purple-700 dark:text-purple-200">
        Build a new workout template in seconds.
      </p>

      <form onSubmit={onSubmit} className="space-y-5">
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-purple-700 dark:text-purple-200">
            Workout Name
          </span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="input-modern"
            placeholder="Leg Day"
          />
        </label>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-purple-700 dark:text-purple-200">
              Sets
            </span>
            <input
              type="number"
              min={1}
              value={sets}
              onChange={(event) => setSets(Number(event.target.value))}
              className="input-modern"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-purple-700 dark:text-purple-200">
              Reps
            </span>
            <input
              type="number"
              min={1}
              value={reps}
              onChange={(event) => setReps(Number(event.target.value))}
              className="input-modern"
            />
          </label>
        </div>

        <div className="rounded-xl border border-purple-200 bg-purple-50/50 p-4 dark:border-purple-800 dark:bg-purple-950/40">
          <p className="mb-2 text-sm font-semibold text-purple-800 dark:text-purple-100">
            No-Equipment Exercises ({selectedExerciseIds.length} selected, min {MIN_EXERCISES})
          </p>
          <div className="mb-3 flex flex-wrap gap-2">
            {(["all", "standing", "bodyweight"] as const).map((filterKey) => {
              const isActive = exerciseFilter === filterKey;
              return (
                <button
                  key={filterKey}
                  type="button"
                  onClick={() => setExerciseFilter(filterKey)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    isActive
                      ? "bg-brand-primary text-white"
                      : "border border-purple-300 text-purple-800 dark:border-purple-700 dark:text-purple-200"
                  }`}
                >
                  {filterKey === "all" ? "All" : filterKey === "standing" ? "Standing" : "Bodyweight"}
                </button>
              );
            })}
          </div>
          <div className="grid grid-cols-1 gap-2">
            {pagedExercises.map((exercise) => {
              const checked = selectedExerciseIds.includes(exercise.id);

              return (
                <label
                  key={exercise.id}
                  className="rounded-md px-2 py-2 text-sm text-purple-800 hover:bg-white dark:text-purple-100 dark:hover:bg-slate-900"
                >
                  <span className="flex items-center gap-2 font-medium">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(event) => onExerciseToggle(exercise.id, event.target.checked)}
                    />
                    <span>{exercise.name}</span>
                  </span>
                  <span className="mt-1 block pl-6 text-xs text-purple-700 dark:text-purple-300">
                    {exercise.description}
                  </span>
                  <ExerciseInfographic exercise={exercise} compact />
                </label>
              );
            })}
          </div>
          {pagedExercises.length === 0 ? (
            <p className="text-sm text-purple-700 dark:text-purple-300">
              No exercises available for this filter.
            </p>
          ) : null}
          <div className="mt-3 flex items-center justify-between gap-2">
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
          {selectionError ? (
            <p className="mt-3 text-sm font-medium text-orange-700 dark:text-orange-300">{selectionError}</p>
          ) : null}
        </div>

        <button type="submit" className="btn-primary">
          Save Workout
        </button>
      </form>
    </section>
  );
}
