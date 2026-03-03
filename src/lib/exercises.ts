import type { Exercise } from "../types/workout";

const BODYWEIGHT_EXERCISE_IDS = new Set<string>([
  "inchworm-walkouts",
  "plank-shoulder-taps",
  "mountain-climbers",
  "glute-bridges",
  "dead-bugs",
  "bird-dogs",
  "hollow-body-hold",
  "reverse-snow-angels",
  "superman-holds",
  "pike-shoulder-taps",
  "bear-crawls",
  "crab-toe-touches",
  "plank-jacks",
  "push-ups",
  "forearm-plank-hold",
  "side-plank-dips",
  "bicycle-crunches",
  "lying-leg-raises",
  "prone-swimmers",
]);

const HANDS_POSTURE_IDS = new Set<string>([
  "inchworm-walkouts",
  "plank-shoulder-taps",
  "mountain-climbers",
  "bird-dogs",
  "pike-shoulder-taps",
  "bear-crawls",
  "crab-toe-touches",
  "plank-jacks",
  "push-ups",
  "forearm-plank-hold",
  "side-plank-dips",
]);

const BACK_POSTURE_IDS = new Set<string>([
  "glute-bridges",
  "dead-bugs",
  "hollow-body-hold",
  "bicycle-crunches",
  "lying-leg-raises",
]);

const PRONE_POSTURE_IDS = new Set<string>([
  "reverse-snow-angels",
  "superman-holds",
  "prone-swimmers",
]);

export const WARMUP_STRETCH_EXERCISE_IDS = new Set<string>([
  "neck-rolls",
  "shoulder-rolls",
  "standing-torso-rotations",
  "hip-circles",
  "ankle-circles",
  "standing-quad-stretch",
  "dynamic-hamstring-scoops",
  "standing-calf-stretch",
  "overhead-side-reach-stretch",
  "chest-opener-stretch",
  "cat-cow-standing",
  "standing-figure-four-stretch",
  "standing-lat-stretch",
  "wrist-circles",
  "standing-adductor-rocks",
]);

export const COOLDOWN_EXERCISE_IDS = new Set<string>([
  "standing-forward-fold-stretch",
  "cross-body-shoulder-stretch",
  "overhead-triceps-stretch",
  "standing-calf-hold-stretch",
  "standing-quad-hold-stretch",
  "standing-figure-four-hold",
  "standing-hamstring-hold-stretch",
  "side-neck-stretch",
  "chest-clasp-stretch",
  "deep-breathing-arm-sweeps",
]);

function createExercise(
  id: Exercise["id"],
  name: string,
  description: string,
  steps: string[],
): Exercise {
  const posture = HANDS_POSTURE_IDS.has(id)
    ? "hands"
    : BACK_POSTURE_IDS.has(id)
      ? "back"
      : PRONE_POSTURE_IDS.has(id)
        ? "prone"
        : "standing";

  return {
    id,
    name,
    description,
    steps,
    exerciseType: BODYWEIGHT_EXERCISE_IDS.has(id) ? "bodyweight" : "standing",
    equipment: "none",
    posture,
  };
}

export const STANDING_NO_EQUIPMENT_EXERCISES: Exercise[] = [
  createExercise(
    "jumping-jacks",
    "Jumping Jacks",
    "Stand tall, jump feet wide as arms raise overhead, then jump back to start with soft knees.",
    [
      "Stand with feet together and arms by your sides.",
      "Jump feet out while lifting arms overhead.",
      "Jump back to start and repeat rhythmically.",
    ],
  ),
  createExercise(
    "high-knees",
    "High Knees",
    "Run in place and drive knees toward hip height while keeping chest up and core braced.",
    [
      "Stand tall and lightly engage your core.",
      "Drive one knee up toward hip level, then switch quickly.",
      "Pump arms and keep a quick, controlled cadence.",
    ],
  ),
  createExercise(
    "air-squats",
    "Air Squats",
    "Sit hips back and down with heels planted, then stand by pressing through mid-foot.",
    [
      "Stand shoulder-width with toes slightly turned out.",
      "Push hips back and bend knees until thighs lower.",
      "Drive through feet to stand and fully extend hips.",
    ],
  ),
  createExercise(
    "reverse-lunges",
    "Alternating Reverse Lunges",
    "Step one leg back, lower both knees to about 90 degrees, then push through front heel to return.",
    [
      "Stand upright with feet hip-width apart.",
      "Step one leg backward and lower both knees.",
      "Push through the front foot, return, and alternate sides.",
    ],
  ),
  createExercise(
    "standing-calf-raises",
    "Standing Calf Raises",
    "Rise onto the balls of your feet with control, pause briefly at top, then lower slowly.",
    [
      "Stand tall with feet hip-width and knees soft.",
      "Lift heels as high as possible while balancing.",
      "Pause briefly, then lower heels under control.",
    ],
  ),
  createExercise(
    "standing-knee-drives",
    "Standing Knee Drives",
    "Drive one knee up toward chest while balancing on the other leg, then alternate sides.",
    [
      "Stand tall with hands at chest or on hips.",
      "Lift one knee sharply toward chest height.",
      "Lower and switch sides while maintaining balance.",
    ],
  ),
  createExercise(
    "standing-oblique-crunches",
    "Standing Oblique Crunches",
    "Bring elbow and same-side knee toward each other to crunch through your side, then switch.",
    [
      "Place hands behind your head with elbows wide.",
      "Lift one knee and bend sideways to meet elbow.",
      "Return to center and repeat on the opposite side.",
    ],
  ),
  createExercise(
    "bodyweight-good-mornings",
    "Bodyweight Good Mornings",
    "Hinge at hips with a flat back and slight knee bend, then squeeze glutes to return upright.",
    [
      "Stand with feet hip-width and hands behind head or crossed.",
      "Hinge hips back while keeping spine neutral.",
      "Stop when torso is angled, then stand by squeezing glutes.",
    ],
  ),
  createExercise(
    "side-steps",
    "Side Steps",
    "Step laterally right and left with soft knees and an athletic stance, keeping tension in your hips.",
    [
      "Take an athletic stance with knees slightly bent.",
      "Step laterally several times in one direction.",
      "Reverse direction while staying low and controlled.",
    ],
  ),
  createExercise(
    "butt-kicks",
    "Butt Kicks",
    "Jog in place and bring heels toward glutes while keeping your chest tall and core engaged.",
    [
      "Stand tall and begin a light jog in place.",
      "Kick heels toward glutes on each stride.",
      "Keep torso upright and maintain quick, soft landings.",
    ],
  ),
  createExercise(
    "standing-front-kicks",
    "Standing Front Kicks",
    "Kick one leg forward to hip height with control, lower it, then alternate sides.",
    [
      "Stand tall and brace your core.",
      "Kick one leg forward with control to comfortable height.",
      "Lower smoothly and alternate to the other leg.",
    ],
  ),
  createExercise(
    "curtsy-lunges",
    "Curtsy Lunges",
    "Step one leg diagonally behind the other, lower with control, then return and switch sides.",
    [
      "Stand upright with feet hip-width.",
      "Step one leg diagonally behind into a curtsy position.",
      "Lower, drive up through front foot, then switch sides.",
    ],
  ),
  createExercise(
    "standing-hip-abductions",
    "Standing Hip Abductions",
    "Lift one leg out to the side without leaning, pause, and lower slowly before switching legs.",
    [
      "Stand tall and hold core tight.",
      "Lift one leg laterally without tilting torso.",
      "Pause briefly, lower slowly, and switch sides.",
    ],
  ),
  createExercise(
    "standing-toe-touches",
    "Standing Toe Touches",
    "Alternate reaching opposite hand to opposite foot while hinging at hips and keeping movements controlled.",
    [
      "Stand wide with soft knees and neutral spine.",
      "Reach right hand toward left foot with a hinge.",
      "Return to center and alternate to the other side.",
    ],
  ),
  createExercise(
    "skater-steps",
    "Skater Steps",
    "Step or hop side to side, letting the trailing leg move behind you while maintaining balance.",
    [
      "Start in a slight squat with feet under hips.",
      "Step or hop laterally and sweep opposite leg behind.",
      "Land softly and continue alternating sides.",
    ],
  ),
  createExercise(
    "standing-arm-circles",
    "Standing Arm Circles",
    "Extend arms out at shoulder height and draw controlled circles, forward then backward.",
    [
      "Stand tall with arms extended to shoulder height.",
      "Make small controlled circles forward.",
      "Reverse direction and keep shoulders relaxed.",
    ],
  ),
  createExercise(
    "march-and-reach",
    "March and Reach",
    "March in place while reaching one arm overhead at a time, keeping your torso tall.",
    [
      "Stand tall and begin a steady march in place.",
      "Reach one arm overhead as the opposite knee lifts.",
      "Alternate sides and keep a smooth pace.",
    ],
  ),
  createExercise(
    "standing-cross-punches",
    "Standing Cross Punches",
    "Throw alternating cross-body punches with core rotation and stable lower body stance.",
    [
      "Stand in an athletic stance with hands up.",
      "Punch one arm across the body while rotating through torso.",
      "Retract quickly and alternate sides.",
    ],
  ),
  createExercise(
    "standing-hamstring-curls",
    "Standing Hamstring Curls",
    "Curl one heel toward your glutes, lower with control, and alternate legs.",
    [
      "Stand upright with feet hip-width apart.",
      "Bend one knee and pull heel toward glute.",
      "Lower and switch to the other leg.",
    ],
  ),
  createExercise(
    "lateral-lunges",
    "Lateral Lunges",
    "Step wide to one side, sit hips back on that leg, then push back to center and switch.",
    [
      "Start tall with feet under hips.",
      "Step wide to one side and bend that knee while keeping other leg straighter.",
      "Push through working leg to return and alternate sides.",
    ],
  ),
  createExercise(
    "standing-windmills",
    "Standing Windmills",
    "Hinge and rotate to reach one hand toward opposite foot while the other arm points up.",
    [
      "Stand wide with one arm raised overhead.",
      "Hinge at hips and rotate torso to reach opposite hand toward foot.",
      "Return to start and switch sides.",
    ],
  ),
  createExercise(
    "speed-skips",
    "Speed Skips",
    "Perform quick low-impact skipping steps in place with rhythmic arm drive.",
    [
      "Start with a light bounce through the balls of your feet.",
      "Alternate quick skip steps while pumping arms.",
      "Stay light and keep cadence steady.",
    ],
  ),
  createExercise(
    "standing-quad-pulls",
    "Standing Quad Pulls",
    "Pull one ankle toward glute to open the front of the thigh, then alternate dynamically.",
    [
      "Stand tall and shift weight onto one leg.",
      "Grab opposite ankle and pull heel gently toward glute.",
      "Release and switch sides in a controlled rhythm.",
    ],
  ),
  createExercise(
    "standing-side-bends",
    "Standing Side Bends",
    "Reach one arm overhead and bend sideways to lengthen and contract the side body.",
    [
      "Stand tall with one arm overhead.",
      "Bend torso to the opposite side without leaning forward.",
      "Return upright and alternate sides.",
    ],
  ),
  createExercise(
    "neck-rolls",
    "Neck Rolls",
    "Gently roll your head in controlled circles to release neck tension before training.",
    [
      "Stand tall with shoulders relaxed and chin slightly tucked.",
      "Slowly roll your head in one direction through a comfortable range.",
      "Reverse direction and keep movements smooth and pain-free.",
    ],
  ),
  createExercise(
    "shoulder-rolls",
    "Shoulder Rolls",
    "Roll shoulders up, back, and down to warm the upper back and shoulder joints.",
    [
      "Stand upright with arms relaxed by your sides.",
      "Lift shoulders toward ears, then roll them back and down.",
      "Repeat for several reps, then roll in the opposite direction.",
    ],
  ),
  createExercise(
    "standing-torso-rotations",
    "Standing Torso Rotations",
    "Rotate your trunk side to side to prepare your spine and core for movement.",
    [
      "Stand hip-width with soft knees and core lightly braced.",
      "Rotate your torso to one side while keeping hips mostly forward.",
      "Return to center and alternate sides under control.",
    ],
  ),
  createExercise(
    "hip-circles",
    "Hip Circles",
    "Draw smooth circles with your hips to loosen the hips and lower back.",
    [
      "Stand with feet shoulder-width and hands on hips.",
      "Circle your hips in one direction with controlled range.",
      "Switch directions while keeping posture tall.",
    ],
  ),
  createExercise(
    "ankle-circles",
    "Ankle Circles",
    "Lift one foot and rotate the ankle joint to improve ankle mobility and balance.",
    [
      "Shift weight to one leg and lift the other foot slightly.",
      "Circle the lifted ankle slowly in one direction.",
      "Reverse the circle and then switch to the other ankle.",
    ],
  ),
  createExercise(
    "standing-quad-stretch",
    "Standing Quad Stretch",
    "Pull heel to glute to lengthen the front thigh and open the hip flexors.",
    [
      "Stand tall and hold support if needed for balance.",
      "Grab one ankle and gently pull heel toward your glute.",
      "Hold briefly, release, and switch sides.",
    ],
  ),
  createExercise(
    "dynamic-hamstring-scoops",
    "Dynamic Hamstring Scoops",
    "Sweep hands toward toes with a straight leg to warm hamstrings dynamically.",
    [
      "Step one heel forward with toes up and knee soft.",
      "Hinge at hips and sweep both hands toward your toes.",
      "Stand back up and alternate sides.",
    ],
  ),
  createExercise(
    "standing-calf-stretch",
    "Standing Calf Stretch",
    "Step one foot back and press heel down to stretch calf and Achilles.",
    [
      "Step one leg back and keep that heel pressing toward the floor.",
      "Bend the front knee while keeping back leg mostly straight.",
      "Hold briefly, then switch sides.",
    ],
  ),
  createExercise(
    "overhead-side-reach-stretch",
    "Overhead Side Reach Stretch",
    "Reach overhead and arc side to side to lengthen lats and obliques.",
    [
      "Stand tall and raise both arms overhead.",
      "Reach up and bend gently to one side.",
      "Return to center and repeat on the other side.",
    ],
  ),
  createExercise(
    "chest-opener-stretch",
    "Chest Opener Stretch",
    "Open through the chest and shoulders by pulling arms behind your body.",
    [
      "Stand tall and clasp hands behind your back if comfortable.",
      "Draw shoulders back and gently lift arms away from body.",
      "Hold briefly with steady breathing, then release.",
    ],
  ),
  createExercise(
    "cat-cow-standing",
    "Standing Cat-Cow",
    "Alternate rounding and arching the spine in standing to mobilize the back before training.",
    [
      "Stand with hands on thighs and knees slightly bent.",
      "Round upper back and tuck chin gently.",
      "Then lift chest and lengthen spine, alternating smoothly.",
    ],
  ),
  createExercise(
    "standing-figure-four-stretch",
    "Standing Figure-Four Stretch",
    "Cross ankle over opposite thigh and sit back slightly to open glutes and hips.",
    [
      "Stand tall and shift weight onto one leg.",
      "Cross opposite ankle above your standing knee.",
      "Sit hips back gently, then switch sides.",
    ],
  ),
  createExercise(
    "standing-lat-stretch",
    "Standing Lat Stretch",
    "Reach overhead and lean slightly to target the lats and side body.",
    [
      "Raise one arm overhead with shoulder relaxed.",
      "Lean your torso away from the raised arm.",
      "Breathe into the stretch, then switch sides.",
    ],
  ),
  createExercise(
    "wrist-circles",
    "Wrist Circles",
    "Rotate wrists through full range to prepare hands and forearms for pressing and plank work.",
    [
      "Extend arms in front of you at chest height.",
      "Rotate both wrists slowly in one direction.",
      "Reverse direction and keep circles controlled.",
    ],
  ),
  createExercise(
    "standing-adductor-rocks",
    "Standing Adductor Rocks",
    "Shift side to side into a lateral stance to open inner thighs and hips dynamically.",
    [
      "Take a wide stance with toes mostly forward.",
      "Shift weight to one side while keeping the other leg long.",
      "Rock to the opposite side in a controlled rhythm.",
    ],
  ),
  createExercise(
    "standing-forward-fold-stretch",
    "Standing Forward Fold Stretch",
    "Hinge at the hips and relax into a gentle hamstring and lower-back stretch.",
    [
      "Stand with feet hip-width and soften your knees.",
      "Hinge at your hips and fold your torso toward your legs.",
      "Breathe slowly and gradually deepen the stretch.",
    ],
  ),
  createExercise(
    "cross-body-shoulder-stretch",
    "Cross-Body Shoulder Stretch",
    "Pull one arm across your chest to release rear shoulder tension.",
    [
      "Stand tall and extend one arm across your chest.",
      "Use the opposite arm to gently pull it closer.",
      "Hold, release, and switch sides.",
    ],
  ),
  createExercise(
    "overhead-triceps-stretch",
    "Overhead Triceps Stretch",
    "Reach one elbow overhead and gently press for triceps and lat flexibility.",
    [
      "Raise one arm overhead and bend the elbow behind your head.",
      "Use your opposite hand to gently guide the elbow.",
      "Hold and switch arms.",
    ],
  ),
  createExercise(
    "standing-calf-hold-stretch",
    "Standing Calf Hold Stretch",
    "Step one leg back and press the heel down to lengthen calf muscles.",
    [
      "Step one foot back and keep the back heel grounded.",
      "Bend the front knee until you feel a calf stretch.",
      "Hold and switch sides.",
    ],
  ),
  createExercise(
    "standing-quad-hold-stretch",
    "Standing Quad Hold Stretch",
    "Pull one ankle toward your glute to stretch the front thigh.",
    [
      "Stand tall and grab one ankle behind you.",
      "Gently pull heel toward glute while keeping knees close.",
      "Hold and switch sides.",
    ],
  ),
  createExercise(
    "standing-figure-four-hold",
    "Standing Figure-Four Hold",
    "Cross one ankle over opposite thigh and sit back to stretch glutes.",
    [
      "Balance on one leg and cross the opposite ankle above your knee.",
      "Sit hips back slightly while keeping chest lifted.",
      "Hold and switch legs.",
    ],
  ),
  createExercise(
    "standing-hamstring-hold-stretch",
    "Standing Hamstring Hold Stretch",
    "Extend one heel forward and hinge gently to stretch the hamstring.",
    [
      "Place one heel slightly in front with toes up.",
      "Hinge your hips back and keep your spine long.",
      "Hold and switch sides.",
    ],
  ),
  createExercise(
    "side-neck-stretch",
    "Side Neck Stretch",
    "Tilt your head to one side with gentle hand pressure to release neck tightness.",
    [
      "Stand tall with relaxed shoulders.",
      "Tilt your ear toward one shoulder.",
      "Apply light pressure with your hand, then switch sides.",
    ],
  ),
  createExercise(
    "chest-clasp-stretch",
    "Chest Clasp Stretch",
    "Clasp hands behind your back and open your chest to ease shoulder tension.",
    [
      "Interlace fingers behind your back.",
      "Draw shoulder blades together and gently lift your hands.",
      "Hold with steady breathing, then release.",
    ],
  ),
  createExercise(
    "deep-breathing-arm-sweeps",
    "Deep Breathing Arm Sweeps",
    "Slow arm sweeps coordinated with breathing to lower heart rate post-workout.",
    [
      "Inhale as you sweep both arms overhead.",
      "Exhale slowly as you lower arms back down.",
      "Repeat with long, controlled breaths.",
    ],
  ),
  createExercise(
    "inchworm-walkouts",
    "Inchworm Walkouts",
    "Hinge down, walk your hands forward to a plank, then walk back and stand.",
    [
      "Stand tall and hinge to place hands near feet.",
      "Walk hands forward until you reach a strong plank.",
      "Walk hands back to feet and stand up tall.",
    ],
  ),
  createExercise(
    "plank-shoulder-taps",
    "Plank Shoulder Taps",
    "From a plank, tap opposite shoulders while resisting hip sway.",
    [
      "Set up in a high plank with feet slightly wider.",
      "Tap one shoulder with opposite hand without rocking hips.",
      "Alternate taps in a controlled rhythm.",
    ],
  ),
  createExercise(
    "mountain-climbers",
    "Mountain Climbers",
    "Drive knees toward chest from plank position at a steady or fast pace.",
    [
      "Start in a high plank with hands under shoulders.",
      "Pull one knee toward chest, then switch quickly.",
      "Keep back flat and core braced throughout.",
    ],
  ),
  createExercise(
    "bodyweight-split-squats",
    "Bodyweight Split Squats",
    "Use a staggered stance and lower straight down, then rise and repeat each side.",
    [
      "Step into a split stance with torso upright.",
      "Lower both knees by bending front and back leg.",
      "Push through front foot to stand and repeat.",
    ],
  ),
  createExercise(
    "glute-bridges",
    "Glute Bridges",
    "Lift hips from the floor by squeezing glutes, then lower with control.",
    [
      "Lie on your back with knees bent and feet flat.",
      "Drive through heels and lift hips to a straight line.",
      "Pause at top, then lower slowly.",
    ],
  ),
  createExercise(
    "dead-bugs",
    "Dead Bugs",
    "Alternate opposite arm and leg extensions while keeping your low back stable.",
    [
      "Lie on your back with arms up and knees bent 90 degrees.",
      "Extend opposite arm and leg toward floor without arching back.",
      "Return to center and switch sides.",
    ],
  ),
  createExercise(
    "bird-dogs",
    "Bird Dogs",
    "From all-fours, extend opposite arm and leg while staying balanced.",
    [
      "Start on hands and knees with neutral spine.",
      "Extend one arm forward and opposite leg back.",
      "Hold briefly, return, and alternate sides.",
    ],
  ),
  createExercise(
    "hollow-body-hold",
    "Hollow Body Hold",
    "Hold a curved core position with lower back pressed into the floor.",
    [
      "Lie on your back and press lower back into the floor.",
      "Lift shoulders and legs slightly off ground.",
      "Hold tension while breathing steadily.",
    ],
  ),
  createExercise(
    "wall-sits",
    "Wall Sits",
    "Sit against a wall with knees bent and hold the position.",
    [
      "Lean back against a wall and slide down.",
      "Stop when knees are about 90 degrees.",
      "Hold position with core tight and heels down.",
    ],
  ),
  createExercise(
    "reverse-snow-angels",
    "Reverse Snow Angels",
    "Lying face down, sweep arms from overhead to hips to train upper back.",
    [
      "Lie face down with arms extended overhead.",
      "Lift arms slightly and sweep them toward your hips.",
      "Return arms overhead and repeat slowly.",
    ],
  ),
  createExercise(
    "superman-holds",
    "Superman Holds",
    "Lift chest, arms, and legs off the floor to engage posterior chain.",
    [
      "Lie face down with arms extended forward.",
      "Lift chest, arms, and legs slightly off floor.",
      "Hold briefly, lower, and repeat.",
    ],
  ),
  createExercise(
    "pike-shoulder-taps",
    "Pike Shoulder Taps",
    "From a pike position, alternate shoulder taps while maintaining stability.",
    [
      "Start in a pike with hips high and hands grounded.",
      "Tap one shoulder with opposite hand.",
      "Return and alternate without excessive sway.",
    ],
  ),
  createExercise(
    "lateral-bounds",
    "Lateral Bounds",
    "Explosively bound side to side, landing softly and under control.",
    [
      "Begin in an athletic stance.",
      "Jump laterally to one side and land softly.",
      "Rebound to the other side with control.",
    ],
  ),
  createExercise(
    "tuck-jumps",
    "Tuck Jumps",
    "Jump vertically and bring knees upward before landing softly.",
    [
      "Stand with feet shoulder-width and arms ready.",
      "Jump upward and drive knees toward chest.",
      "Land softly and reset before next rep.",
    ],
  ),
  createExercise(
    "jump-squats",
    "Jump Squats",
    "Perform a squat and explode upward into a jump.",
    [
      "Lower into a strong squat position.",
      "Explode upward through hips, knees, and ankles.",
      "Land softly and flow into next squat.",
    ],
  ),
  createExercise(
    "bear-crawls",
    "Bear Crawls",
    "Crawl forward and back with knees hovering just off the floor.",
    [
      "Start on hands and feet with knees slightly lifted.",
      "Move opposite hand and foot forward together.",
      "Continue with short controlled steps.",
    ],
  ),
  createExercise(
    "crab-toe-touches",
    "Crab Toe Touches",
    "From crab position, reach one hand to opposite foot and alternate.",
    [
      "Sit in a crab setup with hips lifted.",
      "Reach one hand to opposite foot by rotating torso.",
      "Return and alternate sides.",
    ],
  ),
  createExercise(
    "plank-jacks",
    "Plank Jacks",
    "In plank, jump feet out and in while maintaining a strong core.",
    [
      "Set up in a high plank.",
      "Jump feet out wide then back together.",
      "Keep hips level and shoulders stacked.",
    ],
  ),
  createExercise(
    "walking-lunges",
    "Walking Lunges",
    "Step forward into lunges continuously with upright posture.",
    [
      "Step forward and lower into a lunge.",
      "Push off rear foot and bring it forward.",
      "Repeat continuously, alternating legs.",
    ],
  ),
  createExercise(
    "single-leg-romanian-deadlifts",
    "Single-Leg Romanian Deadlifts",
    "Hinge on one leg while extending the other back, then return to stand.",
    [
      "Balance on one leg with slight knee bend.",
      "Hinge hips back as rear leg extends behind.",
      "Return upright and switch legs after reps.",
    ],
  ),
  createExercise(
    "push-ups",
    "Push-Ups",
    "Lower chest toward the floor from plank, then press back up with a rigid body line.",
    [
      "Start in a high plank with hands just outside shoulder width.",
      "Lower your body as one unit until chest nears the floor.",
      "Press back up while keeping core and glutes tight.",
    ],
  ),
  createExercise(
    "forearm-plank-hold",
    "Forearm Plank Hold",
    "Hold a straight-body plank on forearms while breathing and bracing your core.",
    [
      "Set forearms on floor with elbows under shoulders.",
      "Extend legs and maintain a straight line head to heels.",
      "Brace core and hold without hips sagging or piking.",
    ],
  ),
  createExercise(
    "side-plank-dips",
    "Side Plank Dips",
    "In a side plank, lower hips slightly then lift using obliques.",
    [
      "Set up in a side plank on one forearm.",
      "Lower hips toward floor with control.",
      "Lift hips back up and repeat before switching sides.",
    ],
  ),
  createExercise(
    "bicycle-crunches",
    "Bicycle Crunches",
    "Alternate elbow-to-opposite-knee while extending the other leg.",
    [
      "Lie on your back with hands by head and knees lifted.",
      "Rotate torso to bring one elbow toward opposite knee.",
      "Switch sides while extending the other leg.",
    ],
  ),
  createExercise(
    "lying-leg-raises",
    "Lying Leg Raises",
    "Raise straight legs from the floor and lower with core control.",
    [
      "Lie on your back with legs extended and low back pressed down.",
      "Lift legs upward while keeping knees mostly straight.",
      "Lower slowly without arching your lower back.",
    ],
  ),
  createExercise(
    "prone-swimmers",
    "Prone Swimmers",
    "Lying face down, move arms in a swimming pattern while lifting chest slightly.",
    [
      "Lie prone with arms extended overhead.",
      "Lift chest slightly and sweep arms out and back.",
      "Return arms forward in a smooth controlled motion.",
    ],
  ),
];
