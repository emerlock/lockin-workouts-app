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
- Create Workout (formerly "Workout Create")
- Workout Detail
- Settings

## Navigation and Responsiveness
- Main nav header with active route highlighting.
- Active-nav bug fixed so only the current page is highlighted.
- Smartphone responsive layout improvements across app screens.
- Mobile hamburger menu added in nav (`Disclosure`), with:
  - open/close icon button
  - mobile link panel
  - close-on-link-tap behavior
  - mobile theme toggle

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
- Additional standing exercises added.
- Workouts reconfigured to include newer exercises while preserving workout theme.
- Workout cards include:
  - description (benefit/outcome)
  - tags (exercise type indicators)
- Three previous workouts removed and replaced with bodyweight-focused workouts.

## Routine Rules
- Every workout starts with Walking in Place.
- Interval structure:
  - 30 seconds exercise
  - 30 seconds walking in place between exercises
- Workout duration tuned to approximately 30 minutes.
- Each workout includes at least 6 different exercises.
- Added standing-focused routines and additional routine options.

## Exercise Guidance and Infographics
- Each exercise has textual instructions/how-to guidance.
- Interval entries include how-to description text.
- Infographics were iterated to better represent each specific movement.
- Side-switch visuals updated so "switch" intervals actually show the opposite side.
- Direction adjusted toward more human-like instructional visuals.

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

## PWA Baseline
- App configured as a Progressive Web App.
- Manifest configured and generated.
- Service worker generation enabled and registered.
- PWA assets/icons and startup metadata included.
- Smartphone installability/offline capability baseline established.

## Quality Gates
- Unit tests implemented across core behavior:
  - routine generation/logic
  - workout store data integrity
  - nav active-state behavior
  - create-workout pagination/filter/validation
- Current local checks passing:
  - `npm run build`
  - `npm run test:run`

## Git and Repo
- Git initialized and baseline commit created.
- `.gitignore` configured.
- Remote configured to GitHub repository.
- Push workflow switched to HTTPS + PAT path when needed.

## Notes
- Keep folder name `src/compoents` as-is unless intentionally migrating and updating imports everywhere.
- Use this document as the baseline reference for regression checks when adding future features.
