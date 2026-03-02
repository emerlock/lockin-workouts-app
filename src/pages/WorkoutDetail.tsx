import { Link, useParams } from "react-router-dom";
import { useRef, useState } from "react";
import ExerciseInfographic from "../compoents/ExerciseInfographic";
import RoutinePlayer from "../compoents/RoutinePlayer";
import { useWorkoutStore } from "../lib/workoutStore";

export default function WorkoutDetail() {
  const [startSignal, setStartSignal] = useState<number | undefined>(undefined);
  const routineSectionRef = useRef<HTMLDivElement | null>(null);
  const { workoutId } = useParams();
  const workout = useWorkoutStore((state) =>
    workoutId ? state.getWorkoutById(workoutId) : undefined,
  );
  const totalRoutineSeconds = workout
    ? workout.routine.intervals.reduce((total, interval) => total + interval.durationSeconds, 0)
    : 0;

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
            Exercises: {workout.exercises.length}
          </span>
        </div>

        <div className="mt-5">
          <p className="text-sm font-semibold text-purple-700 dark:text-purple-200">Exercises</p>
          {workout.exercises.length === 0 ? (
            <p className="mt-2 text-sm text-purple-700 dark:text-purple-300">No exercises selected.</p>
          ) : (
            <ul className="mt-2 grid gap-2">
              {workout.exercises.map((exercise) => (
                <li
                  key={exercise.id}
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

        <div ref={routineSectionRef} className="mt-5">
          <p className="text-sm font-semibold text-purple-700 dark:text-purple-200">
            Routine: {workout.routine.name}
          </p>
          <p className="mt-1 text-xs text-purple-700 dark:text-purple-300">
            Total duration: about {Math.round(totalRoutineSeconds / 60)} minutes
          </p>
          {workout.routine.intervals.length === 0 ? (
            <p className="mt-2 text-sm text-purple-700 dark:text-purple-300">
              Add exercises to generate a 30s workout / 30s walk routine.
            </p>
          ) : (
            <div className="mt-2">
              <RoutinePlayer
                intervals={workout.routine.intervals}
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
