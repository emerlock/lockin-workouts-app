import { Link } from "react-router-dom";
import { useWorkoutStore } from "../lib/workoutStore";

export default function WorkoutList() {
  const workouts = useWorkoutStore((state) => state.workouts);

  return (
    <section className="space-y-5">
      <div className="card-modern flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand-primary dark:text-purple-300">Workouts</h1>
          <p className="mt-1 text-sm text-purple-700 dark:text-purple-200">
            Track and review your saved sessions.
          </p>
        </div>
        <Link to="/workouts/new" className="btn-secondary w-full text-center sm:w-auto">
          New Workout
        </Link>
      </div>

      <div className="grid gap-4">
        {workouts.map((workout) => (
          <article
            key={workout.id}
            className="card-modern border-l-4 border-l-brand-primary transition hover:-translate-y-0.5"
          >
            <h2 className="text-xl font-semibold text-brand-primaryDark dark:text-purple-200">
              <Link to={`/workouts/${workout.id}`} className="underline-offset-2 hover:underline">
                {workout.name}
              </Link>
            </h2>
            <p className="mt-1 text-sm text-purple-700 dark:text-purple-300">{workout.description}</p>
            <p className="mt-2 text-sm text-purple-700 dark:text-purple-300">
              {workout.sets} sets x {workout.reps} reps
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {workout.tags.map((tag) => (
                <Link
                  key={`${workout.id}-${tag}`}
                  to={`/exercises?tag=${encodeURIComponent(tag)}`}
                  className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-semibold text-purple-800 transition hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-200 dark:hover:bg-purple-800"
                >
                  {tag}
                </Link>
              ))}
            </div>
            <p className="mt-2 text-xs text-purple-600 dark:text-purple-300">
              {workout.exercises.length} exercises
            </p>
            <div className="mt-3">
              <Link to={`/workouts/${workout.id}`} className="btn-primary inline-flex">
                Open Workout
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
