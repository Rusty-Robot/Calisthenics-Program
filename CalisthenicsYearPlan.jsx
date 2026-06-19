const { useState, useEffect, useRef } = React;

// ─── Program Data ─────────────────────────────────────────────────────────────
const phases = [
  {
    id: 1, label: "PHASE 01", name: "Foundation", months: "Months 1–3",
    color: "#A3E635", dimColor: "#2a3a0a",
    focus: "Build structural strength, learn the hollow body, frog stand, and pulling basics.",
    unlocking: ["Hollow Body Hang", "Hollow Body Hold", "Frog Stand", "German Hang (passive)"],
    days: [
      {
        id: "A", label: "DAY A", name: "Push", muscles: "Chest · Shoulders · Triceps", duration: "~35 min",
        warmup: "5 min: arm circles, wrist prep (10 circles each direction), 10 cat-cows",
        exercises: [
          { name: "Push-Up (Incline → Floor)", sets: "4", reps: "6–12", rest: "90s", type: "reps", note: "Start incline on bed/wall if 12 reps is near your max. Move to flat floor when you can hit 12 clean.", skill: null },
          { name: "Pseudo Planche Lean Hold", sets: "4", reps: "10–20s", rest: "60s", type: "hold", note: "Hands turned out (~45°), fingers pointing back. Lean forward until you feel shoulder loading.", skill: "→ Pseudo Planche" },
          { name: "Diamond Push-Up", sets: "3", reps: "5–8", rest: "90s", type: "reps", note: "Hands form a diamond under chest. Tricep & inner chest focus.", skill: null },
          { name: "Pike Push-Up", sets: "3", reps: "5–8", rest: "90s", type: "reps", note: "High hips, head tracks straight down. Teaches the shoulder pressing pattern for HSPU.", skill: "→ Handstand Push-Up" },
          { name: "Hollow Body Hold", sets: "3", reps: "20–30s", rest: "45s", type: "hold", note: "Lower back pressed FLAT into floor. Arms overhead or by ears.", skill: "→ Hollow Body" },
        ],
      },
      {
        id: "B", label: "DAY B", name: "Pull + Core", muscles: "Back · Biceps · Core", duration: "~40 min",
        warmup: "5 min: dead hang 20s, scapular shrugs ×10, shoulder CARs ×5 each arm",
        exercises: [
          { name: "Dead Hang", sets: "3", reps: "20–30s", rest: "60s", type: "hold", note: "Full passive hang. Builds grip & decompresses the spine.", skill: null },
          { name: "Scapular Pull-Up", sets: "3", reps: "8–10", rest: "60s", type: "reps", note: "Arms stay straight. Only shoulder blades move — depress and retract.", skill: "→ Pull-Up" },
          { name: "Hollow Body Hang", sets: "3", reps: "15–25s", rest: "60s", type: "hold", note: "On the bar: posterior pelvic tilt, body in a slight hollow, legs together.", skill: "→ Hollow Body Hang" },
          { name: "Negative Pull-Up", sets: "4", reps: "3–5 (5s descent)", rest: "2 min", type: "reps", note: "Jump to the top, lower as SLOWLY as possible. Builds pull-up strength fast.", skill: "→ Pull-Up / Muscle-Up" },
          { name: "Hanging Knee Tuck", sets: "3", reps: "8–12", rest: "60s", type: "reps", note: "From dead hang, tuck both knees to chest with control. No swinging.", skill: "→ L-Sit" },
          { name: "Hollow Body Hold", sets: "3", reps: "20–30s", rest: "45s", type: "hold", note: "Floor version — reinforce the position daily.", skill: null },
        ],
      },
      {
        id: "C", label: "DAY C", name: "Legs + Core", muscles: "Quads · Hamstrings · Glutes · Core", duration: "~35 min",
        warmup: "5 min: leg swings, hip circles, ankle rolls",
        exercises: [
          { name: "Bodyweight Squat", sets: "4", reps: "15–20", rest: "60s", type: "reps", note: "Full depth — thighs past parallel. Builds the base for pistol squats.", skill: "→ Pistol Squat" },
          { name: "Reverse Lunge", sets: "3", reps: "10 each leg", rest: "60s", type: "reps", note: "Step back, not forward. Better balance demand.", skill: null },
          { name: "Glute Bridge", sets: "3", reps: "15", rest: "45s", type: "reps", note: "Drive through heels, squeeze glutes hard at the top.", skill: null },
          { name: "Nordic Curl Negative", sets: "3", reps: "3–5", rest: "90s", type: "reps", note: "Feet under pull-up bar or sofa. Lower body forward slowly, catch with hands.", skill: "→ Reverse Nordic" },
          { name: "Dead Bug", sets: "3", reps: "8 each side", rest: "45s", type: "reps", note: "Opposite arm & leg extend while lower back stays completely flat.", skill: "→ Hollow Body" },
          { name: "Straddle Sit Stretch", sets: "3", reps: "30–45s", rest: "30s", type: "hold", note: "Seated wide legs, lean forward from the hips.", skill: "→ Straddle Sit" },
        ],
      },
      {
        id: "D", label: "DAY D", name: "Skill Day", muscles: "Practice · Balance · Mobility", duration: "~40 min",
        warmup: "5 min: wrist prep, shoulder CARs, hip flexor stretch",
        exercises: [
          { name: "Frog Stand", sets: "5", reps: "5–20s", rest: "60s", type: "hold", note: "Squat down, place hands on floor, elbows inside knees, lean forward onto hands. Goal: 20s hold.", skill: "→ Frog Stand" },
          { name: "German Hang (passive)", sets: "3", reps: "10–20s", rest: "90s", type: "hold", note: "Palms facing backward, hang behind body. PASSIVE ONLY — no forcing range.", skill: "→ German Hang" },
          { name: "Dead Hang", sets: "3", reps: "30–45s", rest: "60s", type: "hold", note: "Grip endurance work.", skill: null },
          { name: "Push-Up (quality)", sets: "3", reps: "max −2", rest: "90s", type: "reps", note: "Leave 2 reps in the tank. Perfect scapular movement every rep.", skill: null },
          { name: "Hip Flexor + Wrist Circuit", sets: "2", reps: "30s each", rest: "15s", type: "hold", note: "Kneeling hip flexor, wrist extension, wrist flexion.", skill: null },
        ],
      },
    ],
  },
  {
    id: 2, label: "PHASE 02", name: "Skill Building", months: "Months 4–6",
    color: "#38BDF8", dimColor: "#071a28",
    focus: "Introduce pulling skills on the bar, build pseudo planche push-ups, learn elbow lever and front lever tuck.",
    unlocking: ["Pseudo Planche Push-Up", "Front Lever Tuck", "Elbow Lever", "Butcher's Block", "L-Sit (floor)"],
    days: [
      {
        id: "A", label: "DAY A", name: "Push + Planche Prep", muscles: "Chest · Shoulders · Triceps", duration: "~40 min",
        warmup: "5 min: wrist prep, arm circles, 10 scapular push-ups",
        exercises: [
          { name: "Push-Up (volume)", sets: "4", reps: "12–18", rest: "90s", type: "reps", note: "Focus on scapular protraction at the top of every rep.", skill: null },
          { name: "Pseudo Planche Push-Up", sets: "4", reps: "5–8", rest: "2 min", type: "reps", note: "Hands turned out, lean forward before every rep, maintain lean throughout. Hardest exercise of the week.", skill: "→ Pseudo Planche" },
          { name: "Pike Push-Up (feet elevated)", sets: "3", reps: "8–12", rest: "90s", type: "reps", note: "Feet on bed or chair. Increases the overhead pressing angle.", skill: "→ Handstand Push-Up" },
          { name: "Close-Grip Push-Up", sets: "3", reps: "8–12", rest: "90s", type: "reps", note: "Hands shoulder-width or narrower. Heavy tricep and chest work.", skill: null },
          { name: "Hollow Body Hold", sets: "3", reps: "35–45s", rest: "45s", type: "hold", note: "Extended holds. Arms overhead for max difficulty.", skill: null },
        ],
      },
      {
        id: "B", label: "DAY B", name: "Pull + Lever Skills", muscles: "Back · Core · Lever Work", duration: "~45 min",
        warmup: "5 min: dead hang 30s, scapular pulls ×10, hollow body hang 20s",
        exercises: [
          { name: "Pull-Up", sets: "4", reps: "3–6", rest: "2 min", type: "reps", note: "Goal: 6 clean pull-ups by end of Phase 2. Full dead hang at bottom, chin over bar at top.", skill: "→ Muscle-Up" },
          { name: "Front Lever Tuck Hold", sets: "4", reps: "5–10s", rest: "90s", type: "hold", note: "Arms straight, knees tucked, hips level with shoulders. Body is horizontal. Don't let hips drop.", skill: "→ Front Lever Tuck" },
          { name: "Compact Leg Lift", sets: "3", reps: "12–15", rest: "60s", type: "reps", note: "Knee tucks from hang, controlled. Build to straight-leg lifts over this phase.", skill: "→ L-Sit" },
          { name: "German Hang (straighter arms)", sets: "3", reps: "15–25s", rest: "90s", type: "hold", note: "Progress toward straighter arms gradually across Phase 2. Never force it.", skill: "→ German Hang" },
          { name: "Hollow Body Hang", sets: "3", reps: "30s", rest: "60s", type: "hold", note: "Dialed in by now. Focus on keeping the position effortless.", skill: null },
        ],
      },
      {
        id: "C", label: "DAY C", name: "Legs + Compression", muscles: "Unilateral Strength · Hamstrings · L-Sit Prep", duration: "~38 min",
        warmup: "5 min: leg swings, hip circles, wrist & ankle prep",
        exercises: [
          { name: "Bulgarian Split Squat", sets: "3", reps: "8–10 each leg", rest: "90s", type: "reps", note: "Rear foot elevated on bed/chair. Deep range of motion. Pistol squat stepping stone.", skill: "→ Pistol Squat" },
          { name: "Reverse Nordic Negative", sets: "3", reps: "5 (slow)", rest: "90s", type: "reps", note: "Feet under bar or sofa. Lower body backward, catch with hands. Purely eccentric.", skill: "→ Reverse Nordic" },
          { name: "L-Sit Tuck Hold (floor fists)", sets: "4", reps: "5–10s", rest: "60s", type: "hold", note: "Hands on fists, tuck knees, LIFT hips off floor. A second off the floor counts.", skill: "→ L-Sit" },
          { name: "Straddle Sit Compression", sets: "3", reps: "30–45s", rest: "30s", type: "hold", note: "Wide legs, lean chest toward floor. Actively press down.", skill: "→ Straddle Sit" },
          { name: "Hollow Body Hold", sets: "3", reps: "35–40s", rest: "45s", type: "hold", note: null, skill: null },
        ],
      },
      {
        id: "D", label: "DAY D", name: "Skill Day", muscles: "Elbow Lever · Butcher's Block · Frog Stand", duration: "~40 min",
        warmup: "5 min: wrist prep, elbow circles, shoulder CARs",
        exercises: [
          { name: "Frog Stand (extended)", sets: "4", reps: "20–35s", rest: "60s", type: "hold", note: "Should be confident. Work toward less wall support.", skill: "→ Frog Stand" },
          { name: "Elbow Lever (floor)", sets: "5", reps: "5–15s", rest: "90s", type: "hold", note: "Place one elbow into your hip, lean forward until body is parallel to floor.", skill: "→ Elbow Lever" },
          { name: "Butcher's Block", sets: "3", reps: "10–20s", rest: "90s", type: "hold", note: "On pull-up bar: overhand grip, rotate body until face-up and horizontal. Start 5–10s.", skill: "→ Butcher's Block" },
          { name: "Dead Hang", sets: "3", reps: "50–60s", rest: "60s", type: "hold", note: "Grip endurance.", skill: null },
          { name: "Shoulder & Wrist Mobility", sets: "2", reps: "5 min total", rest: "-", type: "hold", note: "Wrist extension/flexion, door frame shoulder stretch, towel dislocates.", skill: null },
        ],
      },
    ],
  },
  {
    id: 3, label: "PHASE 03", name: "Skill Development", months: "Months 7–9",
    color: "#FB923C", dimColor: "#281508",
    focus: "Archer push-ups, tuck planche, tuck back lever, pistol squats, reverse nordic, shoulder stand.",
    unlocking: ["Archer Push-Up", "Tuck Planche", "Tuck Back Lever", "Pistol Squat", "Reverse Nordic", "Shoulder Stand"],
    days: [
      {
        id: "A", label: "DAY A", name: "Push + Planche", muscles: "Chest · Shoulders · Planche", duration: "~42 min",
        warmup: "5 min: wrist circles, pseudo planche lean 2×15s, scapular push-ups ×10",
        exercises: [
          { name: "Archer Push-Up", sets: "4", reps: "5–8 each side", rest: "90s", type: "reps", note: "One arm bent (working), one arm fully extended to the side. Major chest and tricep demand.", skill: "→ Archer Push-Up" },
          { name: "Tuck Planche Hold", sets: "4", reps: "8–20s", rest: "90s", type: "hold", note: "Hands turned out, knees tucked, lean forward until feet lift. Harder than a frog stand.", skill: "→ Tuck Planche" },
          { name: "Elevated Pike Push-Up (narrow)", sets: "3", reps: "10–12", rest: "90s", type: "reps", note: "Feet on chair, hands closer together. Approaching HSPU range of motion.", skill: "→ Handstand Push-Up" },
          { name: "Pseudo Planche Push-Up", sets: "3", reps: "10–12", rest: "90s", type: "reps", note: "Maintenance. Increase lean angle slightly each month.", skill: null },
          { name: "Wall Handstand Hold", sets: "4", reps: "20–40s", rest: "90s", type: "hold", note: "Chest facing wall. Body perfectly rigid. Do not let hips sag.", skill: "→ Handstand" },
        ],
      },
      {
        id: "B", label: "DAY B", name: "Pull + Back Lever", muscles: "Back · Lever Skills · Core", duration: "~45 min",
        warmup: "5 min: dead hang 30s, shoulder CARs, scapular pull-ups ×10",
        exercises: [
          { name: "Pull-Up (weighted if easy)", sets: "5", reps: "5–8", rest: "2 min", type: "reps", note: "Add 5–10 kg in backpack if 8+ reps is easy.", skill: "→ Muscle-Up" },
          { name: "Tuck Back Lever", sets: "4", reps: "5–10s", rest: "90s", type: "hold", note: "On bar: arms straight, rotate backward into a pike. Body HORIZONTAL.", skill: "→ Tuck Back Lever" },
          { name: "Front Lever Tuck (extended)", sets: "4", reps: "10–15s", rest: "90s", type: "hold", note: "Increase hold time. Aim for 15s clean and steady by end of Phase 3.", skill: "→ Front Lever Tuck" },
          { name: "L-Sit (legs extended)", sets: "4", reps: "5–10s", rest: "60s", type: "hold", note: "Full L-sit: legs STRAIGHT, toes pointed, hips slightly forward of hands.", skill: "→ L-Sit" },
          { name: "Hollow Body Hang", sets: "3", reps: "40s", rest: "60s", type: "hold", note: null, skill: null },
        ],
      },
      {
        id: "C", label: "DAY C", name: "Legs + Flexibility", muscles: "Pistol Squat · Reverse Nordic · Shoulder Stand", duration: "~40 min",
        warmup: "5 min: hip circles, leg swings, ankle mobility",
        exercises: [
          { name: "Pistol Squat Progression", sets: "4", reps: "5 each leg", rest: "90s", type: "reps", note: "Use pull-up bar upright for balance if needed. Box → assisted → freestanding.", skill: "→ Pistol Squat" },
          { name: "Reverse Nordic Curl", sets: "3", reps: "5–8", rest: "90s", type: "reps", note: "Feet anchored. Lower backward, return under control. Full ROM.", skill: "→ Reverse Nordic" },
          { name: "Shoulder Stand", sets: "3", reps: "20–30s", rest: "60s", type: "hold", note: "On your back: hips up, weight on shoulders. Builds inversion comfort.", skill: "→ Shoulder Stand" },
          { name: "Straddle Sit (active)", sets: "3", reps: "30–45s", rest: "30s", type: "hold", note: "Actively try to close the angle. Engage your hip flexors.", skill: "→ Straddle Sit" },
          { name: "Single-Leg RDL", sets: "3", reps: "10 each leg", rest: "60s", type: "reps", note: "Balance + hamstring. Keep hips square.", skill: null },
        ],
      },
      {
        id: "D", label: "DAY D", name: "Skill Integration", muscles: "Handstand · Muscle-Up Prep · Flow", duration: "~45 min",
        warmup: "5 min: wrist prep, shoulder CARs, dead hang 30s",
        exercises: [
          { name: "Wall Handstand (kick-up)", sets: "5", reps: "3–5 attempts + 20–30s hold", rest: "90s", type: "hold", note: "Learn to kick up confidently and find the balance point.", skill: "→ Handstand" },
          { name: "Tuck Planche Hold", sets: "5", reps: "8–20s", rest: "90s", type: "hold", note: "Goal: 15s clean hold by end of Phase 3.", skill: "→ Tuck Planche" },
          { name: "Muscle-Up Transition Negative", sets: "3", reps: "3–5", rest: "2 min", type: "reps", note: "Jump above the bar, slowly lower through the transition. Teaches the movement pattern.", skill: "→ Muscle-Up" },
          { name: "Elbow Lever (both sides)", sets: "3", reps: "15–20s", rest: "60s", type: "hold", note: "Should feel controlled now.", skill: null },
          { name: "Full Mobility Cool-Down", sets: "1", reps: "8 min", rest: "-", type: "hold", note: "Straddle, pigeon, shoulder dislocates, wrist stretches.", skill: null },
        ],
      },
    ],
  },
  {
    id: 4, label: "PHASE 04", name: "Putting It Together", months: "Months 10–12",
    color: "#F472B6", dimColor: "#280a1a",
    focus: "Muscle-up, freestanding handstand, wall HSPU, tuck planche push-up. The year's payoff.",
    unlocking: ["Muscle-Up", "Handstand (freestanding)", "Handstand Push-Up", "Tuck Planche Push-Up"],
    days: [
      {
        id: "A", label: "DAY A", name: "Push + HSPU", muscles: "Handstand Push-Up · Advanced Push", duration: "~45 min",
        warmup: "5 min: wrist prep, pseudo planche lean 2×20s, wall handstand 20s",
        exercises: [
          { name: "Wall HSPU Negative", sets: "4", reps: "3–5 (5s descent)", rest: "2–3 min", type: "reps", note: "Kick into handstand, lower head toward floor as SLOWLY as possible. Celebrate every inch.", skill: "→ Handstand Push-Up" },
          { name: "Archer Push-Up", sets: "3", reps: "8–12 each side", rest: "90s", type: "reps", note: "Maintenance + volume increase.", skill: null },
          { name: "Tuck Planche Push-Up Attempt", sets: "3", reps: "1–3", rest: "2 min", type: "reps", note: "From tuck planche hold: attempt to lower and press. Even a partial rep is a win.", skill: "→ Tuck Planche" },
          { name: "Pseudo Planche Push-Up (max lean)", sets: "3", reps: "8–10", rest: "90s", type: "reps", note: "Maximum forward lean. Approaching advanced tuck planche territory.", skill: null },
          { name: "Hollow Body Hold", sets: "3", reps: "50–60s", rest: "45s", type: "hold", note: null, skill: null },
        ],
      },
      {
        id: "B", label: "DAY B", name: "Pull + Muscle-Up", muscles: "Muscle-Up · Front Lever · Strength", duration: "~45 min",
        warmup: "5 min: dead hang 40s, scapular pull-ups ×10, hollow body hang 30s",
        exercises: [
          { name: "Weighted Pull-Up (backpack)", sets: "4", reps: "4–6", rest: "2–3 min", type: "reps", note: "Load 5–15 kg. Builds explosive pulling strength the muscle-up demands.", skill: "→ Muscle-Up" },
          { name: "Muscle-Up (full attempt)", sets: "4", reps: "1–3", rest: "3 min", type: "reps", note: "Pull FAST and HIGH, lean forward, push through the transition. Jump-assisted first, then unassisted.", skill: "→ Muscle-Up" },
          { name: "Front Lever Tuck → Advanced Tuck", sets: "3", reps: "12–20s", rest: "90s", type: "hold", note: "Try extending one leg while in the tuck — advanced tuck front lever.", skill: "→ Front Lever" },
          { name: "L-Sit Hanging", sets: "3", reps: "5–10s", rest: "60s", type: "hold", note: "From pull-up bar hang, raise legs to parallel. Arms straight, body in hollow.", skill: "→ L-Sit" },
          { name: "Toes to Bar", sets: "3", reps: "8–12", rest: "60s", type: "reps", note: "From dead hang, straight legs all the way to the bar. No kipping.", skill: null },
        ],
      },
      {
        id: "C", label: "DAY C", name: "Legs + Advanced Core", muscles: "Pistol Squat · Reverse Nordic · Straddle", duration: "~40 min",
        warmup: "5 min: hip circles, leg swings, ankle prep",
        exercises: [
          { name: "Pistol Squat (unassisted)", sets: "4", reps: "5–8 each leg", rest: "90s", type: "reps", note: "Should be clean and confident. Add 3s descent for extra difficulty.", skill: "→ Pistol Squat" },
          { name: "Reverse Nordic Curl (full ROM)", sets: "4", reps: "6–10", rest: "90s", type: "reps", note: "Full controlled lowering AND return. A true strength exercise now.", skill: "→ Reverse Nordic" },
          { name: "Straddle Sit (active, 5-min)", sets: "3", reps: "45–60s active", rest: "30s", type: "hold", note: "Engage and release in pulses. Work toward chest touching the floor.", skill: "→ Straddle Sit" },
          { name: "Shoulder Stand (controlled)", sets: "3", reps: "30–45s", rest: "60s", type: "hold", note: "Focus on controlled entry and exit, not just the hold.", skill: "→ Shoulder Stand" },
          { name: "Single-Leg RDL (slow tempo)", sets: "3", reps: "10 each leg", rest: "60s", type: "reps", note: "3s descent. Balance and hamstring.", skill: null },
        ],
      },
      {
        id: "D", label: "DAY D", name: "Skill Flow", muscles: "Handstand · Muscle-Up · Planche · Review", duration: "~45 min",
        warmup: "5 min: full body shake-out, wrist prep, hollow body hang 30s",
        exercises: [
          { name: "Freestanding Handstand", sets: "5", reps: "target: 10s+ hold", rest: "90s", type: "hold", note: "Away from the wall. Find your balance point. Bail safely. Every second is a win.", skill: "→ Handstand" },
          { name: "Muscle-Up (clean attempts)", sets: "4", reps: "1–3", rest: "3 min", type: "reps", note: "Everything you've built comes together here. Be explosive.", skill: "→ Muscle-Up" },
          { name: "Tuck Planche Hold", sets: "3", reps: "15–25s", rest: "90s", type: "hold", note: null, skill: "→ Tuck Planche" },
          { name: "Elbow Lever (fluid, both sides)", sets: "3", reps: "15–25s", rest: "60s", type: "hold", note: null, skill: null },
          { name: "Full Year Cool-Down", sets: "1", reps: "10 min", rest: "-", type: "hold", note: "Straddle, pigeon, shoulder dislocates, wrist stretches, spine decompression hang.", skill: null },
        ],
      },
    ],
  },
];

const milestones = [
  { month: "Month 1–2", color: "#A3E635", milestone: "20s hollow body hang · 15s frog stand · 5 clean pull-ups" },
  { month: "Month 3",   color: "#A3E635", milestone: "20s frog stand · negative pull-ups smooth · pseudo planche lean solid" },
  { month: "Month 4–5", color: "#38BDF8", milestone: "Pseudo planche push-ups ×5 · front lever tuck 5s · L-sit tuck 5s" },
  { month: "Month 6",   color: "#38BDF8", milestone: "Elbow lever held · 6+ pull-ups · butcher's block attempted" },
  { month: "Month 7–8", color: "#FB923C", milestone: "Archer push-ups ×6 each side · tuck planche 10s · pistol squat assisted" },
  { month: "Month 9",   color: "#FB923C", milestone: "Tuck back lever 8s · reverse nordic return · shoulder stand 20s" },
  { month: "Month 10–11", color: "#F472B6", milestone: "Wall HSPU negative smooth · jump muscle-up · freestanding handstand kick-up" },
  { month: "Month 12",  color: "#F472B6", milestone: "Muscle-up attempt · freestanding handstand 5s+ · tuck planche 20s" },
];

// ─── Storage helpers ──────────────────────────────────────────────────────────
const STORAGE_KEY = "cali_workout_log_v1";

function loadLog() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
  catch { return []; }
}

function saveLog(log) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(log)); }
  catch {}
}

function getSessionKey(phaseId, dayId) {
  return `p${phaseId}_d${dayId}`;
}

function getLastSession(log, phaseId, dayId) {
  const key = getSessionKey(phaseId, dayId);
  const sessions = log.filter(s => s.key === key);
  return sessions.length ? sessions[sessions.length - 1] : null;
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

function formatDuration(ms) {
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${m}m ${s}s`;
}

// ─── Colours & theme ─────────────────────────────────────────────────────────
const C = {
  bg: "#0A0A0A", surface: "#0f0f0f", border: "#1e1e1e",
  text: "#E8E8E8", muted: "#555", dim: "#333",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function SetRow({ set, idx, onUpdate, onRemove, type, accent }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
      <span style={{ fontSize: 11, color: C.muted, minWidth: 22, textAlign: "right" }}>
        {idx + 1}
      </span>
      <input
        type={type === "hold" ? "text" : "number"}
        min={0}
        placeholder={type === "hold" ? "hold (s)" : "reps"}
        value={set.value}
        onChange={e => onUpdate(idx, e.target.value)}
        style={{
          flex: 1,
          background: "#141414",
          border: `1px solid ${set.value ? accent + "66" : C.border}`,
          borderRadius: 8,
          color: C.text,
          fontSize: 15,
          fontWeight: 700,
          padding: "9px 12px",
          outline: "none",
          WebkitAppearance: "none",
        }}
      />
      <span style={{ fontSize: 11, color: C.muted }}>{type === "hold" ? "s" : "reps"}</span>
      <button
        onClick={() => onRemove(idx)}
        style={{
          background: "transparent", border: "none",
          color: C.dim, fontSize: 18, cursor: "pointer", lineHeight: 1, padding: "0 4px",
        }}
      >×</button>
    </div>
  );
}

function ExerciseTracker({ exercise, exIdx, data, onChange, accent }) {
  const sets = data || [];

  function addSet() {
    onChange(exIdx, [...sets, { value: "" }]);
  }

  function updateSet(si, val) {
    const next = sets.map((s, i) => i === si ? { value: val } : s);
    onChange(exIdx, next);
  }

  function removeSet(si) {
    onChange(exIdx, sets.filter((_, i) => i !== si));
  }

  return (
    <div style={{ marginTop: 10 }}>
      {sets.map((s, i) => (
        <SetRow
          key={i} idx={i} set={s} type={exercise.type}
          accent={accent} onUpdate={updateSet} onRemove={removeSet}
        />
      ))}
      <button
        onClick={addSet}
        style={{
          marginTop: 8,
          background: accent + "18",
          border: `1px solid ${accent}44`,
          borderRadius: 8,
          color: accent,
          fontSize: 12,
          fontWeight: 700,
          padding: "7px 14px",
          cursor: "pointer",
          width: "100%",
        }}
      >
        + Add {exercise.type === "hold" ? "Hold" : "Set"}
      </button>
    </div>
  );
}

function PreviousBadge({ lastSession, exIdx, type }) {
  if (!lastSession) return null;
  const prev = lastSession.exercises[exIdx];
  if (!prev || !prev.sets || !prev.sets.length) return null;

  const summary = prev.sets
    .map(s => s.value ? `${s.value}${type === "hold" ? "s" : ""}` : "–")
    .join(", ");

  return (
    <div style={{
      fontSize: 11, color: C.muted,
      marginTop: 4,
      display: "flex", gap: 4, alignItems: "center",
    }}>
      <span style={{ opacity: 0.5 }}>Last:</span>
      <span style={{ color: "#888" }}>{summary}</span>
    </div>
  );
}

// ─── Timer ───────────────────────────────────────────────────────────────────
function useElapsed(active, startTime) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setElapsed(Date.now() - startTime), 1000);
    return () => clearInterval(id);
  }, [active, startTime]);
  return elapsed;
}

// ─── History view ─────────────────────────────────────────────────────────────
function HistoryView({ log, onClear }) {
  if (!log.length) return (
    <div style={{ textAlign: "center", padding: "60px 20px", color: C.muted }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>📋</div>
      <div style={{ fontSize: 14 }}>No workouts logged yet.</div>
      <div style={{ fontSize: 12, marginTop: 6 }}>Start a session from any day to track your performance.</div>
    </div>
  );

  const sorted = [...log].reverse();

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800 }}>Workout History</div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{log.length} session{log.length !== 1 ? "s" : ""} logged</div>
        </div>
        <button
          onClick={() => { if (window.confirm("Delete ALL workout history? This cannot be undone.")) onClear(); }}
          style={{
            background: "transparent", border: "1px solid #2a1010",
            borderRadius: 8, color: "#c0392b", fontSize: 11,
            padding: "6px 12px", cursor: "pointer",
          }}
        >
          Clear all
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {sorted.map((session, i) => {
          const phase = phases.find(p => p.id === session.phaseId);
          const day = phase?.days.find(d => d.id === session.dayId);
          if (!phase || !day) return null;
          const totalSets = session.exercises.reduce((acc, e) => acc + (e.sets?.filter(s => s.value).length || 0), 0);

          return (
            <div key={session.id} style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              overflow: "hidden",
            }}>
              {/* Session header */}
              <div style={{
                padding: "12px 16px",
                borderBottom: `1px solid ${C.border}`,
                display: "flex", justifyContent: "space-between", alignItems: "flex-start",
              }}>
                <div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, letterSpacing: 1,
                      padding: "2px 8px", borderRadius: 4,
                      background: phase.color + "22", color: phase.color,
                      textTransform: "uppercase",
                    }}>
                      {phase.label}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>
                      {day.label} — {day.name}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>
                    {formatDate(session.date)} · {totalSets} set{totalSets !== 1 ? "s" : ""} logged
                    {session.duration ? ` · ${formatDuration(session.duration)}` : ""}
                  </div>
                </div>
              </div>

              {/* Exercise breakdown */}
              <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
                {session.exercises.map((exData, ei) => {
                  const ex = day.exercises[ei];
                  if (!ex) return null;
                  const filledSets = exData.sets?.filter(s => s.value) || [];
                  if (!filledSets.length) return null;

                  return (
                    <div key={ei}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#aaa" }}>{ex.name}</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 5 }}>
                        {filledSets.map((s, si) => (
                          <span key={si} style={{
                            fontSize: 12, fontWeight: 700,
                            background: "#141414",
                            border: `1px solid ${phase.color}33`,
                            borderRadius: 6,
                            padding: "3px 10px",
                            color: phase.color,
                          }}>
                            {s.value}{ex.type === "hold" ? "s" : ""}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
function CalisthenicsProgram() {
  const [activePhase, setActivePhase] = useState(0);
  const [activeDay, setActiveDay] = useState(0);
  const [view, setView] = useState("program"); // "program" | "history" | "milestones"

  // Workout tracking state
  const [workoutActive, setWorkoutActive] = useState(false);
  const [workoutStartTime, setWorkoutStartTime] = useState(null);
  const [workoutData, setWorkoutData] = useState([]); // array of {sets:[{value}]} per exercise

  // Persisted log
  const [log, setLog] = useState(() => loadLog());

  const elapsed = useElapsed(workoutActive, workoutStartTime);
  const phase = phases[activePhase];
  const day = phase.days[activeDay];
  const lastSession = getLastSession(log, phase.id, day.id);

  function startWorkout() {
    setWorkoutData(day.exercises.map(() => ({ sets: [] })));
    setWorkoutStartTime(Date.now());
    setWorkoutActive(true);
  }

  function cancelWorkout() {
    if (window.confirm("Cancel this workout? Progress will be lost.")) {
      setWorkoutActive(false);
      setWorkoutData([]);
    }
  }

  function updateExercise(exIdx, sets) {
    setWorkoutData(prev => prev.map((d, i) => i === exIdx ? { sets } : d));
  }

  function finishWorkout() {
    const session = {
      id: Date.now().toString(),
      key: getSessionKey(phase.id, day.id),
      phaseId: phase.id,
      dayId: day.id,
      date: new Date().toISOString(),
      duration: Date.now() - workoutStartTime,
      exercises: workoutData,
    };
    const newLog = [...log, session];
    saveLog(newLog);
    setLog(newLog);
    setWorkoutActive(false);
    setWorkoutData([]);
    setView("history");
  }

  // ── Render ──

  const navTabs = [
    { id: "program", label: "Program" },
    { id: "history", label: `History${log.length ? ` (${log.length})` : ""}` },
    { id: "milestones", label: "Milestones" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Inter','Helvetica Neue',Arial,sans-serif", color: C.text }}>

      {/* ── Top bar ── */}
      <div style={{
        borderBottom: `1px solid ${C.border}`,
        padding: "16px 16px 0",
        background: C.bg,
        position: "sticky", top: 0, zIndex: 10,
      }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 10, letterSpacing: 3, color: C.muted, textTransform: "uppercase", marginBottom: 3 }}>
                STRIQfit · Pull-Up Bar Only
              </div>
              <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, letterSpacing: -0.5, lineHeight: 1.2 }}>
                Year 1 Calisthenics
              </h1>
            </div>
            {workoutActive && (
              <div style={{
                fontSize: 13, fontWeight: 700, color: phase.color,
                background: phase.color + "18",
                border: `1px solid ${phase.color}44`,
                borderRadius: 8, padding: "6px 14px",
              }}>
                ● {formatDuration(elapsed)}
              </div>
            )}
          </div>

          {/* Nav tabs */}
          <div style={{ display: "flex", gap: 0, borderBottom: "none" }}>
            {navTabs.map(t => (
              <button
                key={t.id}
                onClick={() => setView(t.id)}
                style={{
                  background: "transparent",
                  border: "none",
                  borderBottom: `2px solid ${view === t.id ? phase.color : "transparent"}`,
                  color: view === t.id ? phase.color : C.muted,
                  fontSize: 12, fontWeight: 700,
                  padding: "6px 14px 10px",
                  cursor: "pointer",
                  letterSpacing: 0.3,
                  transition: "all 0.15s",
                  whiteSpace: "nowrap",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "20px 14px 40px" }}>

        {/* ── History ── */}
        {view === "history" && (
          <HistoryView log={log} onClear={() => { saveLog([]); setLog([]); }} />
        )}

        {/* ── Milestones ── */}
        {view === "milestones" && (
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>Monthly Milestones</div>
            <div style={{ fontSize: 12, color: C.muted, marginBottom: 20 }}>
              If you're behind on a checkpoint, repeat the phase — don't rush skills.
            </div>
            {milestones.map((m, i) => (
              <div key={i} style={{ display: "flex", gap: 14, padding: "14px 0", borderBottom: `1px solid ${C.border}` }}>
                <div style={{ width: 3, borderRadius: 2, background: m.color, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 10, color: C.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>{m.month}</div>
                  <div style={{ fontSize: 13, color: "#ccc", lineHeight: 1.6 }}>{m.milestone}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Program ── */}
        {view === "program" && (
          <>
            {/* Phase selector */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6, marginBottom: 18 }}>
              {phases.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => { if (!workoutActive) { setActivePhase(i); setActiveDay(0); } }}
                  disabled={workoutActive}
                  style={{
                    background: activePhase === i ? "#141414" : "transparent",
                    border: `1px solid ${activePhase === i ? p.color : C.border}`,
                    borderRadius: 10, padding: "8px 4px",
                    cursor: workoutActive ? "default" : "pointer",
                    textAlign: "center", opacity: workoutActive && activePhase !== i ? 0.4 : 1,
                    transition: "all 0.15s",
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 800, color: activePhase === i ? p.color : C.muted, letterSpacing: 0.5 }}>
                    {p.label.replace("PHASE ", "P")}
                  </div>
                  <div style={{ fontSize: 10, color: activePhase === i ? "#888" : "#383838", marginTop: 2 }}>
                    {p.months.replace("Months ", "")}
                  </div>
                </button>
              ))}
            </div>

            {/* Phase focus banner */}
            <div style={{
              background: phase.dimColor,
              border: `1px solid ${phase.color}22`,
              borderRadius: 10, padding: "12px 14px", marginBottom: 18,
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: phase.color, textTransform: "uppercase", marginBottom: 5 }}>
                {phase.name} · {phase.months}
              </div>
              <p style={{ margin: "0 0 10px", fontSize: 13, color: "#bbb", lineHeight: 1.5 }}>{phase.focus}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {phase.unlocking.map(skill => (
                  <span key={skill} style={{
                    fontSize: 10, padding: "2px 9px",
                    background: phase.color + "18", border: `1px solid ${phase.color}40`,
                    borderRadius: 20, color: phase.color,
                  }}>{skill}</span>
                ))}
              </div>
            </div>

            {/* Day tabs */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6, marginBottom: 20 }}>
              {phase.days.map((d, i) => (
                <button
                  key={d.id}
                  onClick={() => { if (!workoutActive) setActiveDay(i); }}
                  disabled={workoutActive}
                  style={{
                    background: activeDay === i ? "#1a1a1a" : "transparent",
                    border: `1px solid ${activeDay === i ? phase.color : C.border}`,
                    borderRadius: 10, padding: "9px 6px",
                    cursor: workoutActive ? "default" : "pointer",
                    textAlign: "center",
                    opacity: workoutActive && activeDay !== i ? 0.4 : 1,
                    transition: "all 0.15s",
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 800, color: activeDay === i ? phase.color : C.muted }}>
                    {d.label}
                  </div>
                  <div style={{ fontSize: 10, color: activeDay === i ? "#888" : "#333", marginTop: 2 }}>
                    {d.name}
                  </div>
                </button>
              ))}
            </div>

            {/* Day header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 19, fontWeight: 800 }}>{day.name}</h2>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>{day.muscles} · {day.duration}</div>
              </div>
              {lastSession && !workoutActive && (
                <div style={{
                  fontSize: 11, color: "#888",
                  background: "#111", border: `1px solid ${C.border}`,
                  borderRadius: 6, padding: "5px 10px",
                }}>
                  Last: {formatDate(lastSession.date)}
                </div>
              )}
            </div>

            {/* Warm-up */}
            <div style={{
              background: "#0d0d0d", border: `1px solid ${C.border}`,
              borderRadius: 10, padding: "11px 14px", marginBottom: 14,
            }}>
              <div style={{ fontSize: 10, letterSpacing: 2, color: "#3a3a3a", textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>
                Warm-Up
              </div>
              <div style={{ fontSize: 12, color: "#666", lineHeight: 1.5 }}>{day.warmup}</div>
            </div>

            {/* Exercises */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
              {day.exercises.map((ex, i) => {
                const currentSets = workoutActive ? (workoutData[i]?.sets || []) : null;

                return (
                  <div key={i} style={{
                    background: C.surface,
                    border: `1px solid ${workoutActive ? phase.color + "33" : C.border}`,
                    borderRadius: 12, padding: 14,
                  }}>
                    {/* Name + skill tag */}
                    <div style={{ display: "flex", gap: 10, alignItems: "flex-start", justifyContent: "space-between" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                          <span style={{
                            width: 22, height: 22, borderRadius: "50%",
                            background: "#1a1a1a", display: "inline-flex",
                            alignItems: "center", justifyContent: "center",
                            fontSize: 10, fontWeight: 700, color: C.muted,
                            flexShrink: 0,
                          }}>{i + 1}</span>
                          <span style={{ fontSize: 14, fontWeight: 700, color: "#ddd", lineHeight: 1.3 }}>
                            {ex.name}
                          </span>
                        </div>
                        {ex.skill && (
                          <div style={{ fontSize: 10, color: phase.color, marginTop: 3, marginLeft: 30, fontWeight: 600 }}>
                            {ex.skill}
                          </div>
                        )}
                        <PreviousBadge lastSession={lastSession} exIdx={i} type={ex.type} />
                      </div>

                      {/* Sets / Reps badges */}
                      {!workoutActive && (
                        <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                          {[["sets", ex.sets], ["reps", ex.reps], ["rest", ex.rest]].map(([lbl, val]) => (
                            <div key={lbl} style={{
                              background: "#141414", border: `1px solid #222`,
                              borderRadius: 6, padding: "3px 7px", textAlign: "center",
                            }}>
                              <div style={{ fontSize: 9, color: C.muted }}>{lbl}</div>
                              <div style={{ fontSize: 10, fontWeight: 700, color: "#bbb", whiteSpace: "nowrap" }}>{val}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Target in workout mode */}
                    {workoutActive && (
                      <div style={{
                        fontSize: 11, color: C.muted,
                        marginLeft: 30, marginTop: 2,
                        display: "flex", gap: 8,
                      }}>
                        <span>Target: <b style={{ color: "#888" }}>{ex.sets} sets</b></span>
                        <span>·</span>
                        <span><b style={{ color: "#888" }}>{ex.reps}</b></span>
                        <span>·</span>
                        <span>Rest: <b style={{ color: "#888" }}>{ex.rest}</b></span>
                      </div>
                    )}

                    {/* Note (collapsed in workout mode) */}
                    {ex.note && !workoutActive && (
                      <div style={{
                        marginTop: 10, marginLeft: 30,
                        fontSize: 11, color: "#555", lineHeight: 1.6,
                        borderLeft: `2px solid ${C.border}`, paddingLeft: 10,
                      }}>
                        {ex.note}
                      </div>
                    )}

                    {/* Set tracker (workout mode) */}
                    {workoutActive && (
                      <ExerciseTracker
                        exercise={ex}
                        exIdx={i}
                        data={currentSets}
                        onChange={updateExercise}
                        accent={phase.color}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Start / Finish / Cancel workout buttons */}
            {!workoutActive ? (
              <button
                onClick={startWorkout}
                style={{
                  width: "100%",
                  background: phase.color,
                  border: "none",
                  borderRadius: 12,
                  color: "#000",
                  fontSize: 15,
                  fontWeight: 800,
                  padding: "16px",
                  cursor: "pointer",
                  letterSpacing: 0.5,
                }}
              >
                Start Workout — {day.label} {day.name}
              </button>
            ) : (
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={cancelWorkout}
                  style={{
                    flex: 1,
                    background: "transparent",
                    border: `1px solid ${C.dim}`,
                    borderRadius: 12, color: C.muted,
                    fontSize: 14, fontWeight: 700,
                    padding: "14px", cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={finishWorkout}
                  style={{
                    flex: 3,
                    background: phase.color,
                    border: "none", borderRadius: 12,
                    color: "#000", fontSize: 15, fontWeight: 800,
                    padding: "14px", cursor: "pointer",
                  }}
                >
                  Finish & Save Workout ✓
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
