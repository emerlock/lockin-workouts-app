import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="space-y-6">
      <div className="card-modern">
        <p className="text-xs font-bold uppercase tracking-wide text-brand-secondary">
          Build Better Routines
        </p>
        <h1 className="mt-2 text-3xl font-black text-brand-primary dark:text-purple-300 sm:text-4xl">
          Welcome to LockIn Workouts
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-purple-700 dark:text-purple-200">
          Plan no-equipment workouts, add optional warm-up/cooldown blocks, and follow guided
          routines with voice prompts, timers, and smart playback flow.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link to="/workouts" className="btn-primary">
            View Workouts
          </Link>
          <Link to="/exercises" className="btn-primary">
            Browse Exercises
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
            Stay on pace with interval timers, voice cues, chimes, visual progress, and a floating
            playback box.
          </p>
        </article>
        <article className="card-modern">
          <h2 className="text-lg font-bold text-brand-primary dark:text-purple-300">
            Smart Exercise Library
          </h2>
          <p className="mt-2 text-sm text-purple-700 dark:text-purple-200">
            Explore standing, bodyweight, warm-up, and cooldown exercises with infographic-based
            movement guidance.
          </p>
        </article>
        <article className="card-modern">
          <h2 className="text-lg font-bold text-brand-primary dark:text-purple-300">
            Fast Filtering
          </h2>
          <p className="mt-2 text-sm text-purple-700 dark:text-purple-200">
            Use sticky search, grouped tag filters, and pagination on both Workouts and Exercises
            to find sessions quickly.
          </p>
        </article>
        <article className="card-modern md:col-span-3">
          <h2 className="text-lg font-bold text-brand-primary dark:text-purple-300">
            Flexible Session Flow
          </h2>
          <p className="mt-2 text-sm text-purple-700 dark:text-purple-200">
            On workout details, optionally include +5 minute warm-up and/or cooldown blocks and
            review exercises by section (Warm-Up, Core Workout, Cooldown) with a collapsible
            accordion.
          </p>
        </article>
      </div>
    </section>
  );
}
