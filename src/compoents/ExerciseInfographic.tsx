import type { Exercise } from "../types/workout";

type ExerciseInfographicProps = {
  exercise: Exercise;
  compact?: boolean;
};

type FigurePose =
  | "neutral"
  | "jack-open"
  | "knee-drive"
  | "squat-down"
  | "lunge-back"
  | "calf-raise"
  | "oblique-crunch"
  | "hip-hinge"
  | "side-step"
  | "butt-kick"
  | "front-kick"
  | "curtsy"
  | "hip-abduction"
  | "toe-touch"
  | "skater"
  | "arm-circle"
  | "march"
  | "punch"
  | "split-squat"
  | "quad-pull"
  | "side-bend"
  | "skip"
  | "bound"
  | "wall-sit"
  | "plank"
  | "pushup-down"
  | "crawl"
  | "bridge-up"
  | "dead-bug"
  | "supine-legs-up"
  | "prone-lift"
  | "side-plank"
  | "crab";

type FigureSide = "center" | "left" | "right";

type VisualFrame = {
  label: string;
  pose: FigurePose;
  cue: string;
  side?: FigureSide;
};

type ExerciseVisual = {
  title: string;
  frames: [VisualFrame, VisualFrame, VisualFrame];
};

const EXERCISE_VISUALS: Record<string, ExerciseVisual> = {
  "jumping-jacks": {
    title: "Arms and legs move out then in",
    frames: [
      { label: "Start", pose: "neutral", cue: "Feet together, arms down" },
      { label: "Out", pose: "jack-open", cue: "Jump wide, arms overhead" },
      { label: "Return", pose: "neutral", cue: "Jump back to base" },
    ],
  },
  "high-knees": {
    title: "Alternate quick knee drives",
    frames: [
      { label: "Tall", pose: "neutral", cue: "Stay upright" },
      { label: "Drive", pose: "knee-drive", cue: "Knee to hip height", side: "right" },
      { label: "Switch", pose: "knee-drive", cue: "Alternate sides quickly", side: "left" },
    ],
  },
  "air-squats": {
    title: "Sit down then stand up",
    frames: [
      { label: "Stand", pose: "neutral", cue: "Feet shoulder-width" },
      { label: "Lower", pose: "squat-down", cue: "Hips back, chest up" },
      { label: "Stand", pose: "neutral", cue: "Drive through feet" },
    ],
  },
  "reverse-lunges": {
    title: "Step back into lunge and return",
    frames: [
      { label: "Start", pose: "neutral", cue: "Tall posture" },
      { label: "Back", pose: "lunge-back", cue: "Rear step, both knees bend" },
      { label: "Return", pose: "neutral", cue: "Push through front heel" },
    ],
  },
  "standing-calf-raises": {
    title: "Lift heels up and lower",
    frames: [
      { label: "Flat", pose: "neutral", cue: "Full foot contact" },
      { label: "Rise", pose: "calf-raise", cue: "Heels high" },
      { label: "Lower", pose: "neutral", cue: "Controlled descent" },
    ],
  },
  "standing-knee-drives": {
    title: "Drive one knee up, then switch",
    frames: [
      { label: "Start", pose: "neutral", cue: "Brace core" },
      { label: "Drive", pose: "knee-drive", cue: "Explosive knee up", side: "right" },
      { label: "Switch", pose: "knee-drive", cue: "Alternate legs", side: "left" },
    ],
  },
  "standing-oblique-crunches": {
    title: "Elbow and knee meet at side",
    frames: [
      { label: "Setup", pose: "neutral", cue: "Hands behind head" },
      { label: "Crunch", pose: "oblique-crunch", cue: "Elbow to knee", side: "right" },
      { label: "Switch", pose: "oblique-crunch", cue: "Repeat opposite side", side: "left" },
    ],
  },
  "bodyweight-good-mornings": {
    title: "Hip hinge with flat back",
    frames: [
      { label: "Tall", pose: "neutral", cue: "Soft knees" },
      { label: "Hinge", pose: "hip-hinge", cue: "Push hips back" },
      { label: "Up", pose: "neutral", cue: "Squeeze glutes" },
    ],
  },
  "side-steps": {
    title: "Step laterally both directions",
    frames: [
      { label: "Athletic", pose: "neutral", cue: "Soft knees" },
      { label: "Step Out", pose: "side-step", cue: "Move to the side" },
      { label: "Step In", pose: "neutral", cue: "Control return" },
    ],
  },
  "butt-kicks": {
    title: "Jog and kick heels up",
    frames: [
      { label: "Jog", pose: "neutral", cue: "Light bounce" },
      { label: "Kick", pose: "butt-kick", cue: "Heel toward glute", side: "right" },
      { label: "Switch", pose: "butt-kick", cue: "Alternate quickly", side: "left" },
    ],
  },
  "standing-front-kicks": {
    title: "Controlled forward kicks",
    frames: [
      { label: "Base", pose: "neutral", cue: "Stand tall" },
      { label: "Kick", pose: "front-kick", cue: "Leg forward to comfort" },
      { label: "Reset", pose: "neutral", cue: "Lower with control" },
    ],
  },
  "curtsy-lunges": {
    title: "Diagonal back step and lower",
    frames: [
      { label: "Start", pose: "neutral", cue: "Feet hip-width" },
      { label: "Curtsy", pose: "curtsy", cue: "Cross back diagonally" },
      { label: "Return", pose: "neutral", cue: "Drive up and switch" },
    ],
  },
  "standing-hip-abductions": {
    title: "Lift leg out to the side",
    frames: [
      { label: "Balance", pose: "neutral", cue: "Tall torso" },
      { label: "Lift", pose: "hip-abduction", cue: "Leg moves sideways" },
      { label: "Lower", pose: "neutral", cue: "Slow return" },
    ],
  },
  "standing-toe-touches": {
    title: "Reach opposite hand to foot",
    frames: [
      { label: "Setup", pose: "neutral", cue: "Wide stance" },
      { label: "Reach", pose: "toe-touch", cue: "Opposite hand to foot", side: "right" },
      { label: "Switch", pose: "toe-touch", cue: "Alternate sides", side: "left" },
    ],
  },
  "skater-steps": {
    title: "Side-to-side skater motion",
    frames: [
      { label: "Load", pose: "neutral", cue: "Athletic stance" },
      { label: "Bound", pose: "skater", cue: "Step or hop sideways" },
      { label: "Land", pose: "neutral", cue: "Control balance" },
    ],
  },
  "standing-arm-circles": {
    title: "Arms extended, circle directions",
    frames: [
      { label: "Setup", pose: "neutral", cue: "Arms at shoulder height" },
      { label: "Forward", pose: "arm-circle", cue: "Small forward circles" },
      { label: "Reverse", pose: "arm-circle", cue: "Then backward circles" },
    ],
  },
};

const FALLBACK_VISUAL: ExerciseVisual = {
  title: "Exercise movement flow",
  frames: [
    { label: "Start", pose: "neutral", cue: "Stable stance" },
    { label: "Move", pose: "march", cue: "Perform target movement" },
    { label: "Return", pose: "neutral", cue: "Reset posture" },
  ],
};

type Point = { x: number; y: number };

function Segment({ from, to, color }: { from: Point; to: Point; color: string }) {
  return (
    <line
      x1={from.x}
      y1={from.y}
      x2={to.x}
      y2={to.y}
      stroke={color}
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

function Joint({ at, color }: { at: Point; color: string }) {
  return <circle cx={at.x} cy={at.y} r={2.8} fill={color} opacity="0.95" />;
}

function inferVisual(exercise: Exercise): ExerciseVisual {
  const id = exercise.id;

  if (id.includes("march")) {
    return {
      title: "March pattern with alternating reach",
      frames: [
        { label: "Start", pose: "neutral", cue: "Stand tall" },
        { label: "March", pose: "march", cue: "Lift one knee and opposite arm" },
        { label: "Switch", pose: "march", cue: "Alternate sides", side: "left" },
      ],
    };
  }

  if (id.includes("punch")) {
    return {
      title: "Cross-body punching pattern",
      frames: [
        { label: "Guard", pose: "neutral", cue: "Hands up, core braced" },
        { label: "Cross", pose: "punch", cue: "Rotate and punch across", side: "right" },
        { label: "Switch", pose: "punch", cue: "Punch opposite side", side: "left" },
      ],
    };
  }

  if (id.includes("hamstring-curls") || id.includes("quad-pulls")) {
    return {
      title: "Single-leg curl and switch",
      frames: [
        { label: "Tall", pose: "neutral", cue: "Balance and brace" },
        { label: "Curl", pose: "quad-pull", cue: "Heel toward glute", side: "right" },
        { label: "Switch", pose: "quad-pull", cue: "Alternate leg", side: "left" },
      ],
    };
  }

  if (id.includes("side-bends")) {
    return {
      title: "Side bend with controlled return",
      frames: [
        { label: "Setup", pose: "neutral", cue: "One arm overhead" },
        { label: "Bend", pose: "side-bend", cue: "Bend laterally", side: "right" },
        { label: "Switch", pose: "side-bend", cue: "Alternate sides", side: "left" },
      ],
    };
  }

  if (id.includes("windmills")) {
    return {
      title: "Hinge and rotate to opposite foot",
      frames: [
        { label: "Reach Up", pose: "neutral", cue: "One arm overhead" },
        { label: "Hinge", pose: "toe-touch", cue: "Reach opposite foot", side: "right" },
        { label: "Switch", pose: "toe-touch", cue: "Alternate side", side: "left" },
      ],
    };
  }

  if (id.includes("lateral-lunges")) {
    return {
      title: "Lateral step and load",
      frames: [
        { label: "Start", pose: "neutral", cue: "Feet under hips" },
        { label: "Step", pose: "side-step", cue: "Step wide to side" },
        { label: "Load", pose: "split-squat", cue: "Sit hips back on working leg" },
      ],
    };
  }

  if (id.includes("split-squats")) {
    return {
      title: "Split stance lower and rise",
      frames: [
        { label: "Setup", pose: "lunge-back", cue: "Find split stance" },
        { label: "Lower", pose: "split-squat", cue: "Bend both knees" },
        { label: "Stand", pose: "lunge-back", cue: "Drive through front foot" },
      ],
    };
  }

  if (id.includes("walking-lunges")) {
    return {
      title: "Forward lunge stepping pattern",
      frames: [
        { label: "Step", pose: "neutral", cue: "Take a long step forward" },
        { label: "Lower", pose: "lunge-back", cue: "Lower under control" },
        { label: "Next", pose: "neutral", cue: "Bring rear leg through" },
      ],
    };
  }

  if (id.includes("single-leg-romanian")) {
    return {
      title: "Single-leg hinge and return",
      frames: [
        { label: "Balance", pose: "neutral", cue: "Stand on one leg" },
        { label: "Hinge", pose: "hip-hinge", cue: "Hips back, rear leg extends" },
        { label: "Return", pose: "neutral", cue: "Stand tall with control" },
      ],
    };
  }

  if (id.includes("speed-skips")) {
    return {
      title: "Fast skip rhythm",
      frames: [
        { label: "Bounce", pose: "neutral", cue: "Light feet" },
        { label: "Skip", pose: "skip", cue: "Quick skip with arm drive", side: "right" },
        { label: "Switch", pose: "skip", cue: "Alternate rhythm", side: "left" },
      ],
    };
  }

  if (id.includes("lateral-bounds")) {
    return {
      title: "Explosive side-to-side bounds",
      frames: [
        { label: "Load", pose: "neutral", cue: "Athletic setup" },
        { label: "Bound", pose: "bound", cue: "Explode laterally" },
        { label: "Land", pose: "skater", cue: "Soft controlled landing" },
      ],
    };
  }

  if (id.includes("tuck-jumps") || id.includes("jump-squats")) {
    return {
      title: "Jump and soft landing mechanics",
      frames: [
        { label: "Load", pose: "squat-down", cue: "Prepare to jump" },
        { label: "Jump", pose: "skip", cue: "Explode upward" },
        { label: "Land", pose: "squat-down", cue: "Absorb with soft knees" },
      ],
    };
  }

  if (id.includes("push-ups")) {
    return {
      title: "Plank line push-up",
      frames: [
        { label: "Plank", pose: "plank", cue: "Body in straight line" },
        { label: "Lower", pose: "pushup-down", cue: "Chest lowers as one unit" },
        { label: "Press", pose: "plank", cue: "Push back to top" },
      ],
    };
  }

  if (id.includes("plank-hold")) {
    return {
      title: "Forearm plank hold position",
      frames: [
        { label: "Set", pose: "plank", cue: "Forearms under shoulders" },
        { label: "Hold", pose: "plank", cue: "Brace core and glutes" },
        { label: "Breathe", pose: "plank", cue: "Maintain steady tension" },
      ],
    };
  }

  if (id.includes("side-plank")) {
    return {
      title: "Side plank hip dip pattern",
      frames: [
        { label: "Side Plank", pose: "side-plank", cue: "Stack shoulders and hips" },
        { label: "Dip", pose: "side-plank", cue: "Lower hips with control" },
        { label: "Lift", pose: "side-plank", cue: "Drive hips back up" },
      ],
    };
  }

  if (id.includes("plank-jacks") || id.includes("plank-shoulder") || id.includes("mountain-climbers")) {
    return {
      title: "Dynamic plank control",
      frames: [
        { label: "Plank", pose: "plank", cue: "Strong base position" },
        { label: "Move", pose: "crawl", cue: "Alternate dynamic action" },
        { label: "Reset", pose: "plank", cue: "Re-stabilize core" },
      ],
    };
  }

  if (id.includes("inchworm")) {
    return {
      title: "Hinge to plank walkout",
      frames: [
        { label: "Hinge", pose: "toe-touch", cue: "Hands toward floor" },
        { label: "Walk Out", pose: "plank", cue: "Hands walk forward to plank" },
        { label: "Walk Back", pose: "neutral", cue: "Return to standing" },
      ],
    };
  }

  if (id.includes("bear-crawls")) {
    return {
      title: "Bear crawl locomotion",
      frames: [
        { label: "Hover", pose: "crawl", cue: "Knees off floor" },
        { label: "Step", pose: "crawl", cue: "Opposite hand and foot move" },
        { label: "Continue", pose: "crawl", cue: "Short controlled steps" },
      ],
    };
  }

  if (id.includes("crab-toe")) {
    return {
      title: "Crab reach and rotate",
      frames: [
        { label: "Crab", pose: "crab", cue: "Hips lifted" },
        { label: "Reach", pose: "crab", cue: "Hand reaches opposite foot", side: "right" },
        { label: "Switch", pose: "crab", cue: "Alternate side", side: "left" },
      ],
    };
  }

  if (id.includes("glute-bridges")) {
    return {
      title: "Bridge lift pattern",
      frames: [
        { label: "Setup", pose: "supine-legs-up", cue: "Feet planted, back on floor" },
        { label: "Lift", pose: "bridge-up", cue: "Drive hips upward" },
        { label: "Lower", pose: "supine-legs-up", cue: "Lower with control" },
      ],
    };
  }

  if (id.includes("dead-bugs") || id.includes("bicycle-crunches")) {
    return {
      title: "Alternating core pattern on back",
      frames: [
        { label: "Set", pose: "supine-legs-up", cue: "Core braced to floor" },
        { label: "Right", pose: "dead-bug", cue: "Opposite limbs extend", side: "right" },
        { label: "Switch", pose: "dead-bug", cue: "Alternate sides", side: "left" },
      ],
    };
  }

  if (id.includes("leg-raises")) {
    return {
      title: "Leg raise with controlled lowering",
      frames: [
        { label: "Start", pose: "supine-legs-up", cue: "Legs extended" },
        { label: "Raise", pose: "supine-legs-up", cue: "Lift with core control" },
        { label: "Lower", pose: "dead-bug", cue: "Slow controlled descent" },
      ],
    };
  }

  if (id.includes("hollow-body")) {
    return {
      title: "Hollow hold core tension",
      frames: [
        { label: "Set", pose: "supine-legs-up", cue: "Press low back down" },
        { label: "Hold", pose: "dead-bug", cue: "Shoulders and legs elevated" },
        { label: "Maintain", pose: "dead-bug", cue: "Breathe under tension" },
      ],
    };
  }

  if (id.includes("snow-angels") || id.includes("superman") || id.includes("prone-swimmers")) {
    return {
      title: "Prone posterior-chain pattern",
      frames: [
        { label: "Prone Set", pose: "prone-lift", cue: "Face down, long spine" },
        { label: "Lift", pose: "prone-lift", cue: "Lift chest/arms/legs" },
        { label: "Sweep", pose: "prone-lift", cue: "Controlled arm movement" },
      ],
    };
  }

  if (id.includes("bird-dogs")) {
    return {
      title: "Quadruped opposite limb extension",
      frames: [
        { label: "All Fours", pose: "crawl", cue: "Neutral spine" },
        { label: "Reach", pose: "crawl", cue: "Opposite arm and leg extend", side: "right" },
        { label: "Switch", pose: "crawl", cue: "Alternate sides", side: "left" },
      ],
    };
  }

  if (id.includes("wall-sits")) {
    return {
      title: "Static wall sit hold",
      frames: [
        { label: "Slide", pose: "neutral", cue: "Back against wall" },
        { label: "Hold", pose: "wall-sit", cue: "Knees near 90 degrees" },
        { label: "Maintain", pose: "wall-sit", cue: "Core tight, heels down" },
      ],
    };
  }

  return FALLBACK_VISUAL;
}

function Figure({
  x,
  color,
  pose,
  side = "center",
}: {
  x: number;
  color: string;
  pose: FigurePose;
  side?: FigureSide;
}) {
  const sideDir = side === "left" ? -1 : 1;
  const isFloorPose =
    pose === "plank" ||
    pose === "pushup-down" ||
    pose === "crawl" ||
    pose === "bridge-up" ||
    pose === "dead-bug" ||
    pose === "supine-legs-up" ||
    pose === "prone-lift" ||
    pose === "side-plank" ||
    pose === "crab";

  if (isFloorPose) {
    const groundY = 94;
    if (pose === "plank" || pose === "pushup-down") {
      const bodyY = pose === "pushup-down" ? 78 : 68;
      return (
        <g>
          <line x1={x - 26} y1={groundY} x2={x + 18} y2={groundY} stroke="#D8B4FE" strokeWidth="2" />
          <circle cx={x + 25} cy={bodyY - 4} r={6.5} fill={color} />
          <ellipse cx={x + 6} cy={bodyY} rx="7" ry="4.2" fill={color} opacity="0.95" />
          <Segment from={{ x: x + 18, y: bodyY }} to={{ x: x - 12, y: bodyY }} color={color} />
          <Segment from={{ x: x - 4, y: bodyY }} to={{ x: x - 10, y: groundY }} color={color} />
          <Segment from={{ x: x - 12, y: bodyY }} to={{ x: x - 24, y: groundY }} color={color} />
          <Segment from={{ x: x + 8, y: bodyY }} to={{ x: x + 2, y: groundY }} color={color} />
        </g>
      );
    }

    if (pose === "crawl") {
      const dir = side === "left" ? -1 : 1;
      return (
        <g>
          <line x1={x - 26} y1={groundY} x2={x + 20} y2={groundY} stroke="#D8B4FE" strokeWidth="2" />
          <circle cx={x + 10 * dir} cy={58} r={6.5} fill={color} />
          <ellipse cx={x - 1 * dir} cy={67} rx="7" ry="4.3" fill={color} opacity="0.95" />
          <Segment from={{ x: x + 6 * dir, y: 64 }} to={{ x: x - 8 * dir, y: 70 }} color={color} />
          <Segment from={{ x: x - 2 * dir, y: 67 }} to={{ x: x - 14 * dir, y: groundY }} color={color} />
          <Segment from={{ x: x - 10 * dir, y: 71 }} to={{ x: x - 22 * dir, y: groundY }} color={color} />
          <Segment from={{ x: x + 2 * dir, y: 66 }} to={{ x: x + 12 * dir, y: groundY }} color={color} />
        </g>
      );
    }

    if (pose === "bridge-up") {
      return (
        <g>
          <line x1={x - 26} y1={groundY} x2={x + 24} y2={groundY} stroke="#D8B4FE" strokeWidth="2" />
          <circle cx={x + 24} cy={82} r={6.5} fill={color} />
          <path
            d={`M ${x + 18} 82 Q ${x + 8} 73 ${x - 8} 70 Q ${x - 18} 74 ${x - 20} 82`}
            fill="none"
            stroke={color}
            strokeWidth="5"
            strokeLinecap="round"
          />
          <Segment from={{ x: x - 20, y: 82 }} to={{ x: x - 24, y: groundY }} color={color} />
          <Segment from={{ x: x - 6, y: 72 }} to={{ x: x - 2, y: groundY }} color={color} />
        </g>
      );
    }

    if (pose === "supine-legs-up" || pose === "dead-bug") {
      const dir = side === "left" ? -1 : 1;
      const armX = pose === "dead-bug" ? x + 20 * dir : x + 8;
      const legX = pose === "dead-bug" ? x - 18 * dir : x - 8;
      return (
        <g>
          <line x1={x - 28} y1={groundY} x2={x + 28} y2={groundY} stroke="#D8B4FE" strokeWidth="2" />
          <circle cx={x + 26} cy={82} r={6.5} fill={color} />
          <ellipse cx={x + 9} cy={82} rx="7" ry="4.2" fill={color} opacity="0.95" />
          <Segment from={{ x: x + 20, y: 82 }} to={{ x: x - 2, y: 82 }} color={color} />
          <Segment from={{ x: x + 6, y: 82 }} to={{ x: armX, y: 66 }} color={color} />
          <Segment from={{ x: x - 2, y: 82 }} to={{ x: legX, y: 60 }} color={color} />
          <Segment from={{ x: x - 8, y: 82 }} to={{ x: x - 12, y: 60 }} color={color} />
        </g>
      );
    }

    if (pose === "prone-lift") {
      return (
        <g>
          <line x1={x - 26} y1={groundY} x2={x + 28} y2={groundY} stroke="#D8B4FE" strokeWidth="2" />
          <circle cx={x + 24} cy={74} r={6.5} fill={color} />
          <ellipse cx={x + 8} cy={77} rx="7" ry="4.2" fill={color} opacity="0.95" />
          <Segment from={{ x: x + 18, y: 76 }} to={{ x: x - 2, y: 78 }} color={color} />
          <Segment from={{ x: x + 6, y: 77 }} to={{ x: x - 14, y: 68 }} color={color} />
          <Segment from={{ x: x, y: 78 }} to={{ x: x - 16, y: 86 }} color={color} />
        </g>
      );
    }

    if (pose === "side-plank") {
      return (
        <g>
          <line x1={x - 26} y1={groundY} x2={x + 24} y2={groundY} stroke="#D8B4FE" strokeWidth="2" />
          <circle cx={x - 10} cy={56} r={6.5} fill={color} />
          <Segment from={{ x: x - 4, y: 60 }} to={{ x: x + 14, y: 84 }} color={color} />
          <Segment from={{ x: x + 14, y: 84 }} to={{ x: x + 20, y: groundY }} color={color} />
          <Segment from={{ x: x + 2, y: 68 }} to={{ x: x - 8, y: groundY }} color={color} />
        </g>
      );
    }

    if (pose === "crab") {
      const dir = side === "left" ? -1 : 1;
      return (
        <g>
          <line x1={x - 26} y1={groundY} x2={x + 28} y2={groundY} stroke="#D8B4FE" strokeWidth="2" />
          <circle cx={x - 18} cy={66} r={6.5} fill={color} />
          <ellipse cx={x - 4} cy={72} rx="7" ry="4.2" fill={color} opacity="0.95" />
          <Segment from={{ x: x - 12, y: 70 }} to={{ x: x + 4, y: 72 }} color={color} />
          <Segment from={{ x: x - 4, y: 71 }} to={{ x: x + 14, y: 56 + 8 * dir }} color={color} />
          <Segment from={{ x: x + 2, y: 72 }} to={{ x: x - 6, y: groundY }} color={color} />
          <Segment from={{ x: x + 8, y: 73 }} to={{ x: x + 18, y: groundY }} color={color} />
        </g>
      );
    }
  }

  const head = { x, y: 18 };
  const hip = { x, y: 52 };
  let shoulderLeft = { x: x - 11, y: 35 };
  let shoulderRight = { x: x + 11, y: 35 };
  let handLeft = { x: x - 20, y: 47 };
  let handRight = { x: x + 20, y: 47 };
  let kneeLeft = { x: x - 8, y: 72 };
  let kneeRight = { x: x + 8, y: 72 };
  let footLeft = { x: x - 10, y: 94 };
  let footRight = { x: x + 10, y: 94 };

  if (pose === "jack-open") {
    handLeft = { x: x - 22, y: 20 };
    handRight = { x: x + 22, y: 20 };
    footLeft = { x: x - 20, y: 94 };
    footRight = { x: x + 20, y: 94 };
  } else if (pose === "knee-drive") {
    kneeRight = { x: x + 14 * sideDir, y: 60 };
    footRight = { x: x + 20 * sideDir, y: 56 };
    handLeft = { x: x - 16 * sideDir, y: 40 };
    handRight = { x: x + 24 * sideDir, y: 36 };
  } else if (pose === "squat-down") {
    shoulderLeft = { x: x - 13, y: 41 };
    shoulderRight = { x: x + 13, y: 41 };
    kneeLeft = { x: x - 16, y: 76 };
    kneeRight = { x: x + 16, y: 76 };
    footLeft = { x: x - 18, y: 94 };
    footRight = { x: x + 18, y: 94 };
    handLeft = { x: x - 20, y: 50 };
    handRight = { x: x + 20, y: 50 };
  } else if (pose === "lunge-back") {
    kneeLeft = { x: x - 6, y: 74 };
    footLeft = { x: x - 2, y: 94 };
    kneeRight = { x: x + 20, y: 75 };
    footRight = { x: x + 28, y: 94 };
  } else if (pose === "calf-raise") {
    footLeft = { x: x - 10, y: 88 };
    footRight = { x: x + 10, y: 88 };
  } else if (pose === "oblique-crunch") {
    shoulderRight = { x: x + 8 * sideDir, y: 40 };
    handRight = { x: x + 4 * sideDir, y: 31 };
    kneeRight = { x: x + 12 * sideDir, y: 62 };
    footRight = { x: x + 16 * sideDir, y: 58 };
    handLeft = { x: x - 13 * sideDir, y: 31 };
  } else if (pose === "hip-hinge") {
    shoulderLeft = { x: x - 18, y: 43 };
    shoulderRight = { x: x + 2, y: 43 };
    handLeft = { x: x - 26, y: 45 };
    handRight = { x: x + 7, y: 45 };
  } else if (pose === "side-step") {
    footLeft = { x: x - 22, y: 94 };
    footRight = { x: x + 8, y: 94 };
  } else if (pose === "butt-kick") {
    kneeRight = { x: x + 10 * sideDir, y: 71 };
    footRight = { x: x + 3 * sideDir, y: 64 };
  } else if (pose === "front-kick") {
    kneeRight = { x: x + 16, y: 62 };
    footRight = { x: x + 26, y: 62 };
  } else if (pose === "curtsy") {
    kneeRight = { x: x - 2, y: 76 };
    footRight = { x: x - 8, y: 94 };
    kneeLeft = { x: x - 12, y: 74 };
    footLeft = { x: x + 8, y: 94 };
  } else if (pose === "hip-abduction") {
    footRight = { x: x + 24, y: 88 };
    kneeRight = { x: x + 16, y: 74 };
  } else if (pose === "toe-touch") {
    shoulderLeft = { x: x - 17 * sideDir, y: 44 };
    shoulderRight = { x: x + 2 * sideDir, y: 44 };
    handLeft = { x: x - 24 * sideDir, y: 58 };
    handRight = { x: x + 6 * sideDir, y: 44 };
    footLeft = { x: x - 18 * sideDir, y: 94 };
    footRight = { x: x + 14 * sideDir, y: 94 };
  } else if (pose === "skater") {
    footLeft = { x: x - 16, y: 94 };
    kneeLeft = { x: x - 10, y: 74 };
    footRight = { x: x + 18, y: 88 };
    kneeRight = { x: x + 10, y: 74 };
  } else if (pose === "arm-circle") {
    handLeft = { x: x - 26, y: 35 };
    handRight = { x: x + 26, y: 35 };
  } else if (pose === "march") {
    kneeRight = { x: x + 12 * sideDir, y: 60 };
    footRight = { x: x + 18 * sideDir, y: 58 };
    handLeft = { x: x - 14 * sideDir, y: 38 };
    handRight = { x: x + 18 * sideDir, y: 30 };
  } else if (pose === "punch") {
    handRight = { x: x + 28 * sideDir, y: 40 };
    handLeft = { x: x - 12 * sideDir, y: 42 };
    shoulderRight = { x: x + 12 * sideDir, y: 36 };
  } else if (pose === "split-squat") {
    kneeLeft = { x: x - 4, y: 76 };
    footLeft = { x: x, y: 94 };
    kneeRight = { x: x + 18, y: 78 };
    footRight = { x: x + 24, y: 94 };
  } else if (pose === "quad-pull") {
    kneeRight = { x: x + 10 * sideDir, y: 72 };
    footRight = { x: x + 2 * sideDir, y: 62 };
    handRight = { x: x + 4 * sideDir, y: 56 };
  } else if (pose === "side-bend") {
    shoulderRight = { x: x + 8 * sideDir, y: 40 };
    handRight = { x: x + 14 * sideDir, y: 22 };
    shoulderLeft = { x: x - 8 * sideDir, y: 42 };
    handLeft = { x: x - 18 * sideDir, y: 52 };
  } else if (pose === "skip") {
    kneeRight = { x: x + 14 * sideDir, y: 60 };
    footRight = { x: x + 20 * sideDir, y: 56 };
    kneeLeft = { x: x - 8 * sideDir, y: 76 };
    footLeft = { x: x - 14 * sideDir, y: 94 };
    handLeft = { x: x - 16 * sideDir, y: 35 };
    handRight = { x: x + 18 * sideDir, y: 44 };
  } else if (pose === "bound") {
    footLeft = { x: x - 22, y: 92 };
    kneeLeft = { x: x - 14, y: 74 };
    footRight = { x: x + 20, y: 88 };
    kneeRight = { x: x + 8, y: 74 };
    handLeft = { x: x - 18, y: 42 };
    handRight = { x: x + 20, y: 36 };
  } else if (pose === "wall-sit") {
    shoulderLeft = { x: x - 12, y: 40 };
    shoulderRight = { x: x + 8, y: 40 };
    kneeLeft = { x: x - 14, y: 76 };
    kneeRight = { x: x + 12, y: 76 };
    footLeft = { x: x - 2, y: 94 };
    footRight = { x: x + 22, y: 94 };
    handLeft = { x: x - 20, y: 48 };
    handRight = { x: x + 14, y: 48 };
  }

  return (
    <g>
      <circle cx={head.x} cy={head.y} r={7.2} fill={color} />
      <ellipse cx={x} cy={39} rx="7.2" ry="9.6" fill={color} opacity="0.95" />
      <ellipse cx={hip.x} cy={hip.y} rx="7.8" ry="4.8" fill={color} opacity="0.95" />
      <Segment from={{ x, y: 25 }} to={hip} color={color} />
      <Segment from={shoulderLeft} to={handLeft} color={color} />
      <Segment from={shoulderRight} to={handRight} color={color} />
      <Segment from={hip} to={kneeLeft} color={color} />
      <Segment from={kneeLeft} to={footLeft} color={color} />
      <Segment from={hip} to={kneeRight} color={color} />
      <Segment from={kneeRight} to={footRight} color={color} />
      <Joint at={shoulderLeft} color={color} />
      <Joint at={shoulderRight} color={color} />
      <Joint at={hip} color={color} />
      <Joint at={kneeLeft} color={color} />
      <Joint at={kneeRight} color={color} />
    </g>
  );
}

export default function ExerciseInfographic({ exercise, compact = false }: ExerciseInfographicProps) {
  const visual = EXERCISE_VISUALS[exercise.id] ?? inferVisual(exercise);

  return (
    <div className="mt-2 rounded-lg border border-purple-200 bg-white p-3 dark:border-purple-700 dark:bg-slate-900">
      <p className="text-xs font-semibold text-purple-800 dark:text-purple-200">{visual.title}</p>
      <svg
        viewBox="0 0 360 132"
        role="img"
        aria-label={`${exercise.name} movement infographic`}
        className="mt-2 h-28 w-full rounded-md bg-gradient-to-r from-purple-100 via-orange-50 to-purple-100 dark:from-purple-900/50 dark:via-slate-800 dark:to-purple-900/50"
      >
        <rect x="4" y="4" width="112" height="124" rx="8" fill="transparent" stroke="#C4B5FD" strokeDasharray="4 3" />
        <rect x="124" y="4" width="112" height="124" rx="8" fill="transparent" stroke="#FDBA74" strokeDasharray="4 3" />
        <rect x="244" y="4" width="112" height="124" rx="8" fill="transparent" stroke="#C4B5FD" strokeDasharray="4 3" />

        <Figure x={60} color="#6D28D9" pose={visual.frames[0].pose} side={visual.frames[0].side} />
        <Figure x={180} color="#F97316" pose={visual.frames[1].pose} side={visual.frames[1].side} />
        <Figure x={300} color="#6D28D9" pose={visual.frames[2].pose} side={visual.frames[2].side} />

        <line x1="92" y1="35" x2="148" y2="35" stroke="#A855F7" strokeWidth="3" strokeDasharray="5 4" />
        <polygon points="148,35 140,30 140,40" fill="#A855F7" />
        <line x1="212" y1="35" x2="268" y2="35" stroke="#FB923C" strokeWidth="3" strokeDasharray="5 4" />
        <polygon points="268,35 260,30 260,40" fill="#FB923C" />

        <text x="18" y="118" fill="#4C1D95" fontSize="11" fontWeight="700">
          {visual.frames[0].label}
        </text>
        <text x="136" y="118" fill="#9A3412" fontSize="11" fontWeight="700">
          {visual.frames[1].label}
        </text>
        <text x="257" y="118" fill="#4C1D95" fontSize="11" fontWeight="700">
          {visual.frames[2].label}
        </text>
      </svg>

      <ol className={`mt-2 grid gap-1 text-xs ${compact ? "" : "sm:grid-cols-3"}`}>
        {visual.frames.map((frame, index) => (
          <li
            key={`${exercise.id}-cue-${index + 1}`}
            className="rounded-md bg-orange-50 px-2 py-1 text-orange-900 dark:bg-orange-950/40 dark:text-orange-200"
          >
            <span className="font-semibold">{frame.label}:</span> {frame.cue}
          </li>
        ))}
      </ol>

      <ol className={`mt-2 grid gap-1 text-xs ${compact ? "" : "sm:grid-cols-3"}`}>
        {exercise.steps.map((step, index) => (
          <li
            key={`${exercise.id}-step-${index + 1}`}
            className="rounded-md bg-purple-50 px-2 py-1 text-purple-800 dark:bg-purple-950 dark:text-purple-200"
          >
            <span className="font-semibold">Step {index + 1}:</span> {step}
          </li>
        ))}
      </ol>
    </div>
  );
}
