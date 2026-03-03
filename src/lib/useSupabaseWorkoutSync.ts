import { useEffect, useState } from "react";
import { fetchWorkoutsFromSupabase } from "./supabaseCatalog";
import { isSupabaseConfigured, isSupabaseSyncEnabled } from "./supabase";
import { fetchUserWorkoutsFromSupabase } from "./supabaseUserWorkouts";
import { useWorkoutStore } from "./workoutStore";

export function useSupabaseWorkoutSync() {
  const setWorkouts = useWorkoutStore((state) => state.setWorkouts);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [hasSynced, setHasSynced] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function sync() {
      if (!isSupabaseSyncEnabled || !isSupabaseConfigured) {
        return;
      }

      try {
        const [catalogWorkouts, userWorkouts] = await Promise.all([
          fetchWorkoutsFromSupabase(),
          fetchUserWorkoutsFromSupabase(),
        ]);
        if (cancelled) {
          return;
        }
        const workouts = [...catalogWorkouts];
        for (const userWorkout of userWorkouts) {
          if (!workouts.some((workout) => workout.id === userWorkout.id)) {
            workouts.push(userWorkout);
          }
        }
        if (workouts.length > 0) {
          setWorkouts(workouts);
        }
        setHasSynced(true);
      } catch (error) {
        if (!cancelled) {
          const message = error instanceof Error ? error.message : "Failed to sync workouts from Supabase.";
          setSyncError(message);
          console.error("[supabase-sync]", message);
        }
      }
    }

    void sync();

    return () => {
      cancelled = true;
    };
  }, [setWorkouts]);

  return {
    isSupabaseConfigured,
    isSupabaseSyncEnabled,
    hasSynced,
    syncError,
  };
}
