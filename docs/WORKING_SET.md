# LockIn Workouts - Working Set Baseline

Last updated: 2026-03-02

## App Identity
- Name: LockIn Workouts
- Goal: A smartphone-friendly workout web app focused on guided routines with interval timing, visuals, and voice cues.

## Tech Stack
- Build/tooling: Vite + React + TypeScript
- Styling/UI: Tailwind CSS + Headless UI
- Routing: react-router-dom
- State management: Zustand
- Testing: Vitest + jsdom + React Testing Library + jest-dom + user-event
- PWA: vite-plugin-pwa

## Project Structure
- `src/pages`
- `src/compoents` (existing folder name in repo)
- `src/lib`
- `src/types`
- `docs` (this working set document)

## Pages and Routes
- Home
- Workouts (formerly "Workout List")
- Exercises
- Create Workout (formerly "Workout Create")
- Workout Detail
- Settings

## Navigation and Responsiveness
- Main nav header with active route highlighting.
- Active-nav bug fixed so only the current page is highlighted.
- Smartphone responsive layout improvements across app screens, including iPhone-safe viewport handling.
- Mobile hamburger menu is implemented using current Headless UI components (`DisclosureButton`, `DisclosurePanel`).
- Theme toggle was removed from header and is available in Settings only.
- Content gutters and key layouts were adjusted for small phones.

## Theme and Visual Direction
- Color direction:
  - Primary: purple
  - Secondary: orange
  - Tertiary: white
- Dark mode implemented and set as default.
- UI modernized across pages and workout playback surfaces.

## Workout and Exercise Model
- Standing and bodyweight exercise libraries expanded.
- Bodyweight criteria constrained to floor/hands/prone/supine style movements.
- Additional standing, warm-up/stretch, and cooldown exercises added.
- Workouts reconfigured to include newer exercises while preserving workout theme.
- Workout cards include:
  - description (benefit/outcome)
  - tags (exercise type indicators)
- Three previous workouts removed and replaced with bodyweight-focused workouts.
- Added dedicated short templates:
  - `5-Minute Warm-Up Flow` (5 x 60s warm-up exercises)
  - `5-Minute Cooldown Flow` (5 x 60s cooldown exercises)

## Routine Rules
- Every workout starts with Walking in Place.
- Interval structure:
  - 30 seconds exercise
  - 30 seconds walking in place between exercises
- Workout duration tuned to approximately 30 minutes.
- Each workout includes at least 6 different exercises.
- Added standing-focused routines and additional routine options.
- Routine intervals now support variable durations (`durationSeconds: number`) for short warm-up/cooldown templates.

## Exercise Guidance and Infographics
- Each exercise has textual instructions/how-to guidance.
- Interval entries include how-to description text.
- Infographics were iterated to better represent each specific movement.
- Side-switch visuals updated so "switch" intervals actually show the opposite side.
- Direction adjusted toward more human-like instructional visuals.
- Desktop infographic size increased; Exercises page uses a larger infographic mode.
- Added broad directional arrow overlays to indicate movement directions by limb/body part.
- Arrow rendering tuned for visibility and clarity:
  - black outline
  - triangular heads
  - longer shaft lines
  - pelvis-adjacent arrows shifted to side positions
- Added explicit infographic mappings for newly added warm-up/stretch and cooldown exercises to avoid generic fallback visuals.

## Playback Experience
- Workout detail includes a top-right play control:
  - icon-based play button
  - circular styling
  - does not autoplay on page load
  - scrolls user to routine when started
- Interval playback includes:
  - current interval highlighting
  - larger and then larger current-interval text for prominence
  - auto-scroll keeping current interval near top
  - chime sound on interval transition
- Floating playback box includes:
  - current interval name
  - time left in current interval
  - time left in full workout
  - integrated progress-bar backgrounds for both timers
  - play/pause as circular icon controls
  - control positioned at top-right
  - pause keeps box visible and resumable
- For workouts not tagged warm-up/cooldown, optional toggles can include +5 min warm-up and/or +5 min cooldown in playback.
- Workout Detail exercise display now adjusts with selected toggles.
- Exercises on Workout Detail are split into:
  - Warm-Up
  - Core Workout
  - Cooldown
- Section dividers added between exercise sections.
- Exercises section is now collapsible via an accordion toggle (collapsed by default).

## Voice and Audio
- Workout start voice prompt includes:
  - "Starting workout"
  - workout name
  - estimated workout time
- Interval voice announcements for exercise names.
- Best-available local speech synthesis voice selection wired in.
- Settings option to select male vs female voice preference.
- Chime-based transition cue used where available.

## Create Workout Page
- Exercise pagination added:
  - 5 exercises per page
- Filtering added by exercise/workout type (for example standing vs bodyweight).
- Validation behavior for minimum routine composition preserved.

## Workouts Page
- Search input added (name/description/tags).
- Tag filters grouped by:
  - Types
  - Focus Areas
  - Postures
- Search/filter panel is sticky on scroll.
- Pagination added with 5 workouts per page.
- Workout tags are clickable and deep-link to Exercises page tag filtering.

## Exercises Page
- Dedicated Exercises page added.
- Search, filter chips, and results count implemented.
- Filters include:
  - Type
  - Posture
  - Focus area (`Warm-Up / Stretch`, `Cooldown`)
- Tag deep-link support: `/exercises?tag=...` with clear control.
- Sticky top filter/search panel.
- Pagination added with 10 exercises per page.

## PWA Baseline
- App configured as a Progressive Web App.
- Manifest configured and generated.
- Service worker generation enabled and registered.
- PWA assets/icons and startup metadata included.
- Smartphone installability/offline capability baseline established.
- Custom favicon added:
  - white diagonal barbell on purple background
  - centered and linked from `index.html`

## Quality Gates
- Unit tests implemented across core behavior:
  - routine generation/logic
  - workout store data integrity
  - nav active-state behavior
  - create-workout pagination/filter/validation
  - exercises page pagination/filter/tag behavior
  - workouts page search/tag filtering/pagination
- Current local checks passing:
  - `npm run build`
  - `npm run test:run`
- Current baseline test count: 21 passing tests.

## Git and Repo
- Git initialized and baseline commit created.
- `.gitignore` configured.
- Remote configured to GitHub repository.
- Push workflow switched to HTTPS + PAT path when needed.

## Notes
- Keep folder name `src/compoents` as-is unless intentionally migrating and updating imports everywhere.
- Use this document as the baseline reference for regression checks when adding future features.
