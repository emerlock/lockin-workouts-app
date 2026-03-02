import { Link } from "react-router-dom";
import { useWorkoutStore } from "../lib/workoutStore";

export default function WorkoutList() {
  const workouts = useWorkoutStore((state) => state.workouts);

  return (
    <section className="space-y-5">
      <div className="card-modern flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand-primary dark:text-purple-300">Workouts</h1>
          <p className="mt-1 text-sm text-purple-700 dark:text-purple-200">
            Track and review your saved sessions.
          </p>
        </div>
        <Link to="/workouts/new" className="btn-secondary">
          New Workout
        </Link>
      </div>

      <div className="grid gap-4">
        {workouts.map((workout) => (
          <Link
            key={workout.id}
            to={`/workouts/${workout.id}`}
            className="card-modern block border-l-4 border-l-brand-primary transition hover:-translate-y-0.5"
          >
            <h2 className="text-xl font-semibold text-brand-primaryDark dark:text-purple-200">
              {workout.name}
            </h2>
            <p className="mt-1 text-sm text-purple-700 dark:text-purple-300">{workout.description}</p>
            <p className="mt-2 text-sm text-purple-700 dark:text-purple-300">
              {workout.sets} sets x {workout.reps} reps
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {workout.tags.map((tag) => (
                <span
                  key={`${workout.id}-${tag}`}
                  className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-semibold text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                >
                  {tag}
                </span>
              ))}
            </div>
            <p className="mt-2 text-xs text-purple-600 dark:text-purple-300">
              {workout.exercises.length} exercises
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
