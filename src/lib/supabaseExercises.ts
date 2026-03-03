import { getSupabaseClient } from "./supabase";
import type { Exercise } from "../types/workout";

type ExerciseRow = {
  id: string;
  name: string;
  description: string;
  type: "standing" | "bodyweight" | "warmup" | "cooldown";
  posture: "standing" | "hands" | "back" | "prone";
  infographic_key: string | null;
};

type ExerciseTagRow = {
  exercise_id: string;
  tags: { name: string } | null;
};

export type ExerciseCatalog = {
  exercises: Exercise[];
  warmupIds: Set<string>;
  cooldownIds: Set<string>;
};

export async function fetchExerciseCatalogFromSupabase(): Promise<ExerciseCatalog> {
  const supabase = getSupabaseClient();

  const [{ data: exercisesData, error: exercisesError }, { data: exerciseTagsData, error: tagsError }] =
    await Promise.all([
      supabase
        .from("exercises")
        .select("id,name,description,type,posture,infographic_key")
        .order("created_at", { ascending: true }),
      supabase.from("exercise_tags").select("exercise_id,tags(name)"),
    ]);

  if (exercisesError) {
    throw new Error(`Failed to load exercises: ${exercisesError.message}`);
  }
  if (tagsError) {
    throw new Error(`Failed to load exercise tags: ${tagsError.message}`);
  }

  const exerciseRows = (exercisesData ?? []) as ExerciseRow[];
  const exerciseTagRows = (exerciseTagsData ?? []) as ExerciseTagRow[];

  const tagsByExerciseId = new Map<string, string[]>();
  for (const row of exerciseTagRows) {
    const existing = tagsByExerciseId.get(row.exercise_id) ?? [];
    if (row.tags?.name) {
      existing.push(row.tags.name.toLowerCase());
    }
    tagsByExerciseId.set(row.exercise_id, existing);
  }

  const warmupIds = new Set<string>();
  const cooldownIds = new Set<string>();

  const exercises: Exercise[] = exerciseRows.map((row) => {
    const stableId = row.infographic_key ?? row.id;
    const tags = tagsByExerciseId.get(row.id) ?? [];
    if (row.type === "warmup" || tags.includes("warm-up")) {
      warmupIds.add(stableId);
    }
    if (row.type === "cooldown" || tags.includes("cooldown")) {
      cooldownIds.add(stableId);
    }

    return {
      id: stableId,
      name: row.name,
      description: row.description,
      steps: [],
      exerciseType: row.type === "bodyweight" ? "bodyweight" : "standing",
      equipment: "none",
      posture: row.posture,
    };
  });

  return { exercises, warmupIds, cooldownIds };
}
