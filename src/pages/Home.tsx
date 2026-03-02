import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="space-y-6">
      <div className="card-modern">
        <p className="text-xs font-bold uppercase tracking-wide text-brand-secondary">
          Build Better Routines
        </p>
        <h1 className="mt-2 text-4xl font-black text-brand-primary dark:text-purple-300">
          Welcome to LockIn Workouts
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-purple-700 dark:text-purple-200">
          Plan effective no-equipment workouts, follow guided intervals, and stay focused with
          voice prompts, timers, and smart routine flow.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link to="/workouts" className="btn-primary">
            View Workouts
          </Link>
          <Link to="/workouts/new" className="btn-secondary">
            Create Workout
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="card-modern">
          <h2 className="text-lg font-bold text-brand-primary dark:text-purple-300">
            Guided Intervals
          </h2>
          <p className="mt-2 text-sm text-purple-700 dark:text-purple-200">
            Stay on pace with interval timers, visual progress, and a floating playback box.
          </p>
        </article>
        <article className="card-modern">
          <h2 className="text-lg font-bold text-brand-primary dark:text-purple-300">
            Smart Exercise Library
          </h2>
          <p className="mt-2 text-sm text-purple-700 dark:text-purple-200">
            Mix standing and bodyweight exercises with descriptions, tags, and visual guidance.
          </p>
        </article>
        <article className="card-modern">
          <h2 className="text-lg font-bold text-brand-primary dark:text-purple-300">
            Consistent Training
          </h2>
          <p className="mt-2 text-sm text-purple-700 dark:text-purple-200">
            Use ready-made routines or build your own and jump right into a focused session.
          </p>
        </article>
      </div>
    </section>
  );
}
