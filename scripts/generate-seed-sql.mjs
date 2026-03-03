import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const root = process.cwd();
const exPath = path.join(root, "src/lib/exercises.ts");
const workoutsPath = path.join(root, "src/lib/workoutStore.ts");
const outDir = path.join(root, "supabase");
const outPath = path.join(outDir, "seed.sql");

const exSrc = fs.readFileSync(exPath, "utf8");
const workoutSrc = fs.readFileSync(workoutsPath, "utf8");

const exFile = ts.createSourceFile(exPath, exSrc, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
const workoutFile = ts.createSourceFile(workoutsPath, workoutSrc, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);

function fail(message) {
  throw new Error(message);
}

function getVarInitializer(sf, varName) {
  for (const stmt of sf.statements) {
    if (!ts.isVariableStatement(stmt)) continue;
    for (const decl of stmt.declarationList.declarations) {
      if (ts.isIdentifier(decl.name) && decl.name.text === varName) {
        return decl.initializer;
      }
    }
  }
  return undefined;
}

function getStringLiteral(node, context) {
  if (!node) fail(`Missing node for ${context}`);
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  fail(`Expected string literal for ${context}`);
}

function getNumberLiteral(node, context) {
  if (!node) fail(`Missing node for ${context}`);
  if (ts.isNumericLiteral(node)) return Number(node.text);
  fail(`Expected numeric literal for ${context}`);
}

function getArrayStrings(node, context) {
  if (!node || !ts.isArrayLiteralExpression(node)) fail(`Expected array for ${context}`);
  return node.elements.map((el, idx) => getStringLiteral(el, `${context}[${idx}]`));
}

function parseSet(varName) {
  const init = getVarInitializer(exFile, varName);
  if (!init || !ts.isNewExpression(init)) fail(`Set ${varName} missing`);
  if (!init.arguments || init.arguments.length !== 1) fail(`Set ${varName} malformed`);
  return new Set(getArrayStrings(init.arguments[0], varName));
}

const bodyweightIds = parseSet("BODYWEIGHT_EXERCISE_IDS");
const handsIds = parseSet("HANDS_POSTURE_IDS");
const backIds = parseSet("BACK_POSTURE_IDS");
const proneIds = parseSet("PRONE_POSTURE_IDS");
const warmupIds = parseSet("WARMUP_STRETCH_EXERCISE_IDS");
const cooldownIds = parseSet("COOLDOWN_EXERCISE_IDS");

const exercisesInit = getVarInitializer(exFile, "STANDING_NO_EQUIPMENT_EXERCISES");
if (!exercisesInit || !ts.isArrayLiteralExpression(exercisesInit)) fail("STANDING_NO_EQUIPMENT_EXERCISES missing");

const exercises = exercisesInit.elements.map((el, idx) => {
  if (!ts.isCallExpression(el) || !ts.isIdentifier(el.expression) || el.expression.text !== "createExercise") {
    fail(`Exercise entry ${idx} is not createExercise()`);
  }
  const args = el.arguments;
  if (args.length < 4) fail(`Exercise entry ${idx} has insufficient args`);
  const id = getStringLiteral(args[0], `exercise[${idx}].id`);
  const name = getStringLiteral(args[1], `exercise[${idx}].name`);
  const description = getStringLiteral(args[2], `exercise[${idx}].description`);
  const steps = getArrayStrings(args[3], `exercise[${idx}].steps`);

  let posture = "standing";
  if (handsIds.has(id)) posture = "hands";
  else if (backIds.has(id)) posture = "back";
  else if (proneIds.has(id)) posture = "prone";

  const exerciseType = bodyweightIds.has(id) ? "bodyweight" : "standing";

  return {
    id,
    name,
    description,
    steps,
    posture,
    exerciseType,
    isWarmup: warmupIds.has(id),
    isCooldown: cooldownIds.has(id),
  };
});

const exerciseById = new Map(exercises.map((x) => [x.id, x]));

const workouts = [];

function findBuildSeedWorkoutCalls(node) {
  if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === "buildSeedWorkout") {
    workouts.push(node);
  }
  ts.forEachChild(node, findBuildSeedWorkoutCalls);
}
findBuildSeedWorkoutCalls(workoutFile);

const parsedWorkouts = workouts.map((call, idx) => {
  const arg = call.arguments[0];
  if (!arg || !ts.isObjectLiteralExpression(arg)) fail(`Workout call ${idx} missing object arg`);
  const props = new Map();
  for (const prop of arg.properties) {
    if (ts.isPropertyAssignment(prop) && ts.isIdentifier(prop.name)) {
      props.set(prop.name.text, prop.initializer);
    }
  }

  const id = getStringLiteral(props.get("id"), `workout[${idx}].id`);
  const name = getStringLiteral(props.get("name"), `workout[${idx}].name`);
  const description = getStringLiteral(props.get("description"), `workout[${idx}].description`);
  const tags = getArrayStrings(props.get("tags"), `workout[${idx}].tags`);
  const sets = getNumberLiteral(props.get("sets"), `workout[${idx}].sets`);
  const reps = getNumberLiteral(props.get("reps"), `workout[${idx}].reps`);
  const exerciseIds = getArrayStrings(props.get("exerciseIds"), `workout[${idx}].exerciseIds`);

  return { id, name, description, tags, sets, reps, exerciseIds };
});

const TARGET_DURATION_SECONDS = 30 * 60;
const INTERVAL_SECONDS = 30;
const WARMUP_INTERVAL_SECONDS = 60;

function buildStandingIntervals(exerciseIds) {
  if (exerciseIds.length === 0) return [];

  let bestRounds = 1;
  let smallestDiff = Number.POSITIVE_INFINITY;

  for (let rounds = 1; rounds <= 200; rounds += 1) {
    const workBlocks = rounds * exerciseIds.length;
    const totalSeconds = (2 * workBlocks - 1) * INTERVAL_SECONDS;
    const diff = Math.abs(TARGET_DURATION_SECONDS - totalSeconds);
    if (diff < smallestDiff) {
      smallestDiff = diff;
      bestRounds = rounds;
    }
  }

  const ordered = [];
  for (let r = 0; r < bestRounds; r += 1) ordered.push(...exerciseIds);

  const intervals = [];
  intervals.push({
    intervalId: "warmup-walk",
    label: "Walking in Place",
    description: "Walk in place with tall posture, steady breathing, and relaxed arm swing.",
    type: "walk",
    durationSeconds: INTERVAL_SECONDS,
    exerciseId: null,
  });

  ordered.forEach((exerciseId, index) => {
    const ex = exerciseById.get(exerciseId);
    if (!ex) fail(`Missing exercise ${exerciseId} in routine build`);

    intervals.push({
      intervalId: `${exerciseId}-work-${index + 1}`,
      label: ex.name,
      description: ex.description,
      type: "exercise",
      durationSeconds: INTERVAL_SECONDS,
      exerciseId,
    });

    if (index < ordered.length - 1) {
      intervals.push({
        intervalId: `${exerciseId}-walk-${index + 1}`,
        label: "Walking in Place",
        description: "Recover by walking in place and preparing for the next movement.",
        type: "walk",
        durationSeconds: INTERVAL_SECONDS,
        exerciseId: null,
      });
    }
  });

  return intervals;
}

function buildMinuteRoutineIntervals(exerciseIds, suffix) {
  return exerciseIds.map((exerciseId, index) => {
    const ex = exerciseById.get(exerciseId);
    if (!ex) fail(`Missing exercise ${exerciseId} in minute routine`);
    return {
      intervalId: `${exerciseId}-${suffix}-${index + 1}`,
      label: ex.name,
      description: ex.description,
      type: "exercise",
      durationSeconds: WARMUP_INTERVAL_SECONDS,
      exerciseId,
    };
  });
}

const workoutsWithIntervals = parsedWorkouts.map((w) => {
  let intervals;
  if (w.id === "0") {
    intervals = buildMinuteRoutineIntervals(w.exerciseIds.slice(0, 5), "warmup");
  } else if (w.id === "0b") {
    intervals = buildMinuteRoutineIntervals(w.exerciseIds.slice(0, 5), "cooldown");
  } else {
    intervals = buildStandingIntervals(w.exerciseIds);
  }

  const totalSeconds = intervals.reduce((sum, item) => sum + item.durationSeconds, 0);
  const estimatedMinutes = Math.max(1, Math.round(totalSeconds / 60));

  return {
    ...w,
    intervals,
    estimatedMinutes,
    isWarmup: w.tags.includes("warm-up"),
    isCooldown: w.tags.includes("cooldown"),
  };
});

const typeTags = new Set(["standing", "bodyweight", "warm-up", "cooldown"]);
const postureTags = new Set(["hands", "back", "prone"]);

const allTagNames = new Set();
for (const ex of exercises) {
  allTagNames.add(ex.exerciseType);
  allTagNames.add(ex.posture);
  if (ex.isWarmup) allTagNames.add("warm-up");
  if (ex.isCooldown) allTagNames.add("cooldown");
}
for (const w of workoutsWithIntervals) {
  for (const tag of w.tags) allTagNames.add(tag);
}

function tagCategory(tag) {
  if (postureTags.has(tag)) return "posture";
  if (typeTags.has(tag)) return "type";
  return "focus";
}

function sqlString(v) {
  return `'${String(v).replace(/'/g, "''")}'`;
}

function slugExpr(prefix, value) {
  return `slug_uuid(${sqlString(`${prefix}:${value}`)})`;
}

const lines = [];
lines.push("-- Seed script for LockIn Workouts");
lines.push("-- Generated from src/lib/exercises.ts and src/lib/workoutStore.ts");
lines.push("begin;");
lines.push("");
lines.push("create extension if not exists \"pgcrypto\";");
lines.push("");
lines.push("create or replace function slug_uuid(input text)");
lines.push("returns uuid");
lines.push("language sql");
lines.push("immutable");
lines.push("as $$");
lines.push("  select (");
lines.push("    substr(md5(input),1,8) || '-' ||");
lines.push("    substr(md5(input),9,4) || '-' ||");
lines.push("    substr(md5(input),13,4) || '-' ||");
lines.push("    substr(md5(input),17,4) || '-' ||");
lines.push("    substr(md5(input),21,12)");
lines.push("  )::uuid;");
lines.push("$$;");
lines.push("");
lines.push("truncate table workout_tags, exercise_tags, workout_intervals, workouts, exercises, tags restart identity cascade;");
lines.push("");

lines.push("insert into tags (id, name, category)");
lines.push("values");
const sortedTags = Array.from(allTagNames).sort((a, b) => a.localeCompare(b));
sortedTags.forEach((tag, i) => {
  const comma = i === sortedTags.length - 1 ? ";" : ",";
  lines.push(`  (${slugExpr("tag", tag)}, ${sqlString(tag)}, ${sqlString(tagCategory(tag))}::tag_category)${comma}`);
});
lines.push("");

lines.push("insert into exercises (id, name, description, type, posture, infographic_key)");
lines.push("values");
exercises.forEach((ex, i) => {
  const comma = i === exercises.length - 1 ? ";" : ",";
  lines.push(
    `  (${slugExpr("exercise", ex.id)}, ${sqlString(ex.name)}, ${sqlString(ex.description)}, ${sqlString(ex.exerciseType)}::exercise_type, ${sqlString(ex.posture)}::posture_type, ${sqlString(ex.id)})${comma}`,
  );
});
lines.push("");

lines.push("insert into exercise_tags (exercise_id, tag_id)");
lines.push("values");
const exerciseTagRows = [];
for (const ex of exercises) {
  const exTags = new Set([ex.exerciseType, ex.posture]);
  if (ex.isWarmup) exTags.add("warm-up");
  if (ex.isCooldown) exTags.add("cooldown");
  for (const tag of exTags) {
    exerciseTagRows.push([ex.id, tag]);
  }
}
exerciseTagRows.forEach(([exerciseId, tag], i) => {
  const comma = i === exerciseTagRows.length - 1 ? ";" : ",";
  lines.push(`  (${slugExpr("exercise", exerciseId)}, ${slugExpr("tag", tag)})${comma}`);
});
lines.push("");

lines.push("insert into workouts (id, name, description, estimated_minutes, is_warmup, is_cooldown)");
lines.push("values");
workoutsWithIntervals.forEach((w, i) => {
  const comma = i === workoutsWithIntervals.length - 1 ? ";" : ",";
  lines.push(
    `  (${slugExpr("workout", w.id)}, ${sqlString(w.name)}, ${sqlString(w.description)}, ${w.estimatedMinutes}, ${w.isWarmup ? "true" : "false"}, ${w.isCooldown ? "true" : "false"})${comma}`,
  );
});
lines.push("");

lines.push("insert into workout_tags (workout_id, tag_id)");
lines.push("values");
const workoutTagRows = [];
for (const w of workoutsWithIntervals) {
  for (const tag of w.tags) {
    workoutTagRows.push([w.id, tag]);
  }
}
workoutTagRows.forEach(([workoutId, tag], i) => {
  const comma = i === workoutTagRows.length - 1 ? ";" : ",";
  lines.push(`  (${slugExpr("workout", workoutId)}, ${slugExpr("tag", tag)})${comma}`);
});
lines.push("");

lines.push(
  "insert into workout_intervals (id, workout_id, exercise_id, label, description, kind, duration_seconds, position)",
);
lines.push("values");
const intervalRows = [];
for (const w of workoutsWithIntervals) {
  w.intervals.forEach((interval, idx) => {
    intervalRows.push({
      id: `${w.id}:${interval.intervalId}`,
      workoutId: w.id,
      exerciseId: interval.exerciseId,
      label: interval.label,
      description: interval.description,
      kind: interval.type === "walk" ? "walk" : "exercise",
      durationSeconds: interval.durationSeconds,
      position: idx + 1,
    });
  });
}
intervalRows.forEach((row, i) => {
  const comma = i === intervalRows.length - 1 ? ";" : ",";
  const exerciseIdExpr = row.exerciseId ? slugExpr("exercise", row.exerciseId) : "null";
  lines.push(
    `  (${slugExpr("interval", row.id)}, ${slugExpr("workout", row.workoutId)}, ${exerciseIdExpr}, ${sqlString(row.label)}, ${sqlString(row.description)}, ${sqlString(row.kind)}::interval_kind, ${row.durationSeconds}, ${row.position})${comma}`,
  );
});
lines.push("");
lines.push("commit;");

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outPath, `${lines.join("\n")}\n`, "utf8");
console.log(`Wrote ${outPath}`);
console.log(`Exercises: ${exercises.length}, Workouts: ${workoutsWithIntervals.length}, Intervals: ${intervalRows.length}`);
