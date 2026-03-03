import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useWorkoutStore } from "../lib/workoutStore";

const TYPE_TAGS = new Set(["standing", "bodyweight", "warm-up", "cooldown"]);
const POSTURE_TAGS = new Set(["upright", "hands-based", "on-back", "prone"]);

export default function WorkoutList() {
  const WORKOUTS_PER_PAGE = 5;
  const workouts = useWorkoutStore((state) => state.workouts);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [focusFilter, setFocusFilter] = useState("all");
  const [postureFilter, setPostureFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const { typeTags, focusTags, postureTags } = useMemo(() => {
    const allTags = Array.from(new Set(workouts.flatMap((workout) => workout.tags)));
    const typeTags = allTags.filter((tag) => TYPE_TAGS.has(tag.toLowerCase())).sort((a, b) => a.localeCompare(b));
    const postureTags = allTags
      .filter((tag) => POSTURE_TAGS.has(tag.toLowerCase()))
      .sort((a, b) => a.localeCompare(b));
    const focusTags = allTags
      .filter((tag) => !TYPE_TAGS.has(tag.toLowerCase()) && !POSTURE_TAGS.has(tag.toLowerCase()))
      .sort((a, b) => a.localeCompare(b));
    return { typeTags, focusTags, postureTags };
  }, [workouts]);
  const filteredWorkouts = useMemo(() => {
    const term = query.trim().toLowerCase();

    return workouts.filter((workout) => {
      const hasTag = (selected: string) =>
        workout.tags.some((tag) => tag.toLowerCase() === selected.toLowerCase());
      const matchesType = typeFilter === "all" || hasTag(typeFilter);
      const matchesFocus = focusFilter === "all" || hasTag(focusFilter);
      const matchesPosture = postureFilter === "all" || hasTag(postureFilter);

      if (!matchesType || !matchesFocus || !matchesPosture) {
        return false;
      }

      if (!term) {
        return true;
      }
      const inName = workout.name.toLowerCase().includes(term);
      const inDescription = workout.description.toLowerCase().includes(term);
      const inTags = workout.tags.some((tag) => tag.toLowerCase().includes(term));
      return inName || inDescription || inTags;
    });
  }, [query, typeFilter, focusFilter, postureFilter, workouts]);
  const totalPages = Math.max(1, Math.ceil(filteredWorkouts.length / WORKOUTS_PER_PAGE));
  const pageStart = (currentPage - 1) * WORKOUTS_PER_PAGE;
  const pagedWorkouts = filteredWorkouts.slice(pageStart, pageStart + WORKOUTS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [query, typeFilter, focusFilter, postureFilter]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

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

      <div className="card-modern sticky top-2 z-30 bg-white/95 backdrop-blur dark:bg-slate-900/95">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search workouts..."
          className="input-modern"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <p className="w-full text-xs font-bold uppercase tracking-wide text-purple-700 dark:text-purple-200">
            Types
          </p>
          <button
            type="button"
            onClick={() => setTypeFilter("all")}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
              typeFilter === "all"
                ? "bg-brand-primary text-white"
                : "border border-purple-300 text-purple-800 dark:border-purple-700 dark:text-purple-200"
            }`}
          >
            All Types
          </button>
          {typeTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setTypeFilter(tag)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                typeFilter === tag
                  ? "bg-brand-primary text-white"
                  : "border border-purple-300 text-purple-800 dark:border-purple-700 dark:text-purple-200"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <p className="w-full text-xs font-bold uppercase tracking-wide text-purple-700 dark:text-purple-200">
            Focus Areas
          </p>
          <button
            type="button"
            onClick={() => setFocusFilter("all")}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
              focusFilter === "all"
                ? "bg-brand-secondary text-white"
                : "border border-orange-300 text-orange-900 dark:border-orange-700 dark:text-orange-200"
            }`}
          >
            All Focus Areas
          </button>
          {focusTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setFocusFilter(tag)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                focusFilter === tag
                  ? "bg-brand-secondary text-white"
                  : "border border-orange-300 text-orange-900 dark:border-orange-700 dark:text-orange-200"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <p className="w-full text-xs font-bold uppercase tracking-wide text-purple-700 dark:text-purple-200">
            Postures
          </p>
          <button
            type="button"
            onClick={() => setPostureFilter("all")}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
              postureFilter === "all"
                ? "bg-purple-700 text-white"
                : "border border-purple-300 text-purple-800 dark:border-purple-700 dark:text-purple-200"
            }`}
          >
            All Postures
          </button>
          {postureTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setPostureFilter(tag)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                postureFilter === tag
                  ? "bg-purple-700 text-white"
                  : "border border-purple-300 text-purple-800 dark:border-purple-700 dark:text-purple-200"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs font-semibold text-purple-700 dark:text-purple-300">
          {filteredWorkouts.length} workouts shown
        </p>
      </div>

      <div className="grid gap-4">
        {pagedWorkouts.map((workout) => (
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
        {pagedWorkouts.length === 0 ? (
          <div className="card-modern text-sm text-purple-700 dark:text-purple-300">
            No workouts match your search.
          </div>
        ) : null}
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
