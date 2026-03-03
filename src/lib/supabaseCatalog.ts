import { buildFiveMinuteCooldownRoutine, buildFiveMinuteWarmupRoutine, buildStandingIntervalRoutine } from "./routines";
import { getSupabaseClient } from "./supabase";
import type { Exercise, Workout } from "../types/workout";

type WorkoutRow = {
  id: string;
  name: string;
  description: string;
  is_warmup: boolean;
  is_cooldown: boolean;
};

type WorkoutTagRow = {
  workout_id: string;
  tags: { name: string } | null;
};

type WorkoutIntervalRow = {
  id: string;
  workout_id: string;
  label: string | null;
  description: string;
  kind: "exercise" | "walk" | "rest";
  duration_seconds: number;
  position: number;
  exercises:
    | {
        id: string;
        name: string;
        description: string;
        type: "standing" | "bodyweight" | "warmup" | "cooldown";
        posture: "standing" | "hands" | "back" | "prone";
        infographic_key: string | null;
      }
    | null;
};

function mapExercise(exercise: WorkoutIntervalRow["exercises"]): Exercise | null {
  if (!exercise) {
    return null;
  }

  return {
    id: exercise.infographic_key ?? exercise.id,
    name: exercise.name,
    description: exercise.description,
    steps: [],
    exerciseType: exercise.type === "bodyweight" ? "bodyweight" : "standing",
    equipment: "none",
    posture: exercise.posture,
  };
}

function fallbackRoutine(workout: Workout, isWarmup: boolean, isCooldown: boolean) {
  if (isWarmup) {
    return buildFiveMinuteWarmupRoutine(workout.exercises.slice(0, 5));
  }

  if (isCooldown) {
    return buildFiveMinuteCooldownRoutine(workout.exercises.slice(0, 5));
  }

  return buildStandingIntervalRoutine(workout.exercises);
}

export async function fetchWorkoutsFromSupabase(): Promise<Workout[]> {
  const supabase = getSupabaseClient();

  const [{ data: workoutsData, error: workoutsError }, { data: tagsData, error: tagsError }, { data: intervalsData, error: intervalsError }] =
    await Promise.all([
      supabase
        .from("workouts")
        .select("id,name,description,is_warmup,is_cooldown")
        .order("created_at", { ascending: true }),
      supabase
        .from("workout_tags")
        .select("workout_id,tags(name)"),
      supabase
        .from("workout_intervals")
        .select(
          "id,workout_id,label,description,kind,duration_seconds,position,exercises(id,name,description,type,posture,infographic_key)",
        )
        .order("position", { ascending: true }),
    ]);

  if (workoutsError) {
    throw new Error(`Failed to load workouts: ${workoutsError.message}`);
  }
  if (tagsError) {
    throw new Error(`Failed to load workout tags: ${tagsError.message}`);
  }
  if (intervalsError) {
    throw new Error(`Failed to load workout intervals: ${intervalsError.message}`);
  }

  const workouts = (workoutsData ?? []) as WorkoutRow[];
  const tagRows = (tagsData ?? []) as WorkoutTagRow[];
  const intervalRows = (intervalsData ?? []) as WorkoutIntervalRow[];

  const tagsByWorkoutId = new Map<string, string[]>();
  for (const row of tagRows) {
    const current = tagsByWorkoutId.get(row.workout_id) ?? [];
    if (row.tags?.name) {
      current.push(row.tags.name);
    }
    tagsByWorkoutId.set(row.workout_id, current);
  }

  const intervalsByWorkoutId = new Map<string, WorkoutIntervalRow[]>();
  for (const row of intervalRows) {
    const current = intervalsByWorkoutId.get(row.workout_id) ?? [];
    current.push(row);
    intervalsByWorkoutId.set(row.workout_id, current);
  }

  return workouts.map((workoutRow) => {
    const intervalRowsForWorkout = (intervalsByWorkoutId.get(workoutRow.id) ?? []).sort(
      (a, b) => a.position - b.position,
    );

    const exerciseMap = new Map<string, Exercise>();
    for (const row of intervalRowsForWorkout) {
      const mapped = mapExercise(row.exercises);
      if (mapped && !exerciseMap.has(mapped.id)) {
        exerciseMap.set(mapped.id, mapped);
      }
    }
    const exercises = Array.from(exerciseMap.values());

    const routineIntervals = intervalRowsForWorkout.map((row) => ({
      id: row.id,
      label: row.label ?? (row.kind === "exercise" ? "Exercise" : "Walking in Place"),
      description: row.description,
      type: (row.kind === "exercise" ? "exercise" : "walk") as "exercise" | "walk",
      durationSeconds: row.duration_seconds,
    }));

    const workout: Workout = {
      id: workoutRow.id,
      name: workoutRow.name,
      description: workoutRow.description,
      tags: tagsByWorkoutId.get(workoutRow.id) ?? [],
      sets: workoutRow.is_warmup || workoutRow.is_cooldown ? 1 : 3,
      reps: workoutRow.is_warmup || workoutRow.is_cooldown ? 5 : 10,
      exercises,
      routine: {
        name: `${workoutRow.name} Routine`,
        intervals: routineIntervals,
      },
    };

    if (workout.routine.intervals.length === 0 && workout.exercises.length > 0) {
      workout.routine = fallbackRoutine(workout, workoutRow.is_warmup, workoutRow.is_cooldown);
    }

    return workout;
  });
}
