import type { Workout } from "../types/workout";
import { getSupabaseClient, isSupabaseConfigured, isSupabaseSyncEnabled } from "./supabase";
import { getCurrentUser } from "./supabaseAuth";

type UserWorkoutRow = {
  id: string;
  name: string;
  description: string;
  tags: string[];
  sets: number;
  reps: number;
  exercises: Workout["exercises"];
  routine: Workout["routine"];
};

function normalizeWorkoutRow(row: UserWorkoutRow): Workout {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    tags: Array.isArray(row.tags) ? row.tags : [],
    sets: row.sets,
    reps: row.reps,
    exercises: Array.isArray(row.exercises) ? row.exercises : [],
    routine: row.routine,
  };
}

export async function fetchUserWorkoutsFromSupabase(): Promise<Workout[]> {
  if (!isSupabaseConfigured || !isSupabaseSyncEnabled) {
    return [];
  }

  const user = await getCurrentUser();
  if (!user) {
    return [];
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("user_workouts")
    .select("id,name,description,tags,sets,reps,exercises,routine")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch user workouts: ${error.message}`);
  }

  return ((data ?? []) as UserWorkoutRow[]).map(normalizeWorkoutRow);
}

export async function persistUserWorkoutToSupabase(workout: Workout): Promise<void> {
  if (!isSupabaseConfigured || !isSupabaseSyncEnabled) {
    return;
  }

  const user = await getCurrentUser();
  if (!user) {
    return;
  }

  const supabase = getSupabaseClient();
  const payload = {
    id: workout.id,
    user_id: user.id,
    name: workout.name,
    description: workout.description,
    tags: workout.tags,
    sets: workout.sets,
    reps: workout.reps,
    exercises: workout.exercises,
    routine: workout.routine,
  };

  const { error } = await supabase.from("user_workouts").upsert(payload as never);
  if (error) {
    throw new Error(`Failed to save workout: ${error.message}`);
  }
}

export async function deleteUserWorkoutFromSupabase(workoutId: string): Promise<void> {
  if (!isSupabaseConfigured || !isSupabaseSyncEnabled) {
    return;
  }

  const user = await getCurrentUser();
  if (!user) {
    return;
  }

  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from("user_workouts")
    .delete()
    .eq("id", workoutId)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(`Failed to delete workout: ${error.message}`);
  }
}
