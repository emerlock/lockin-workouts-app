export type Exercise = {
  id: string;
  name: string;
  description: string;
  steps: string[];
  exerciseType: "standing" | "bodyweight";
  equipment: "none";
  posture: "standing" | "hands" | "back" | "prone";
};

export type RoutineInterval = {
  id: string;
  label: string;
  description: string;
  type: "exercise" | "walk";
  durationSeconds: 30;
};

export type WorkoutRoutine = {
  name: string;
  intervals: RoutineInterval[];
};

export type Workout = {
  id: string;
  name: string;
  description: string;
  tags: string[];
  sets: number;
  reps: number;
  exercises: Exercise[];
  routine: WorkoutRoutine;
};
