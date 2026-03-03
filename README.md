# LockIn Workouts

LockIn Workouts is a React + TypeScript progressive web app for no-equipment training.  
It includes guided interval playback, warm-up/cooldown support, infographic-based exercise guidance, and smartphone-first UX.

## Tech Stack
- Vite
- React + TypeScript
- Tailwind CSS + Headless UI
- Zustand
- React Router
- Vitest + React Testing Library
- `vite-plugin-pwa`

## Quick Start
## Prerequisites
- Node.js 18+
- npm 9+

## Install
```bash
npm install
```

## Run Dev Server
```bash
npm run dev
```

## Build
```bash
npm run build
```

## Run Tests
```bash
npm run test:run
```

## App Routes
- `/` - Home
- `/workouts` - Workouts list (search, grouped tag filters, pagination)
- `/exercises` - Full exercises library (search, filters, pagination)
- `/workouts/new` - Create Workout
- `/workouts/:workoutId` - Workout Detail + Routine Player
- `/settings` - Theme/voice settings

## Key Features
- Dark mode default UI with responsive/mobile layout.
- PWA support with service worker + manifest.
- Workouts list:
  - sticky search/filter panel
  - grouped tag filters (`Types`, `Focus Areas`, `Postures`)
  - 5 workouts per page pagination
- Exercises list:
  - sticky search/filter panel
  - type/posture/focus filtering (including warm-up and cooldown)
  - 10 exercises per page pagination
  - movement infographics with directional arrows
- Workout Detail:
  - optional +5 min warm-up and/or +5 min cooldown (except standalone warm-up/cooldown workouts)
  - exercise sections separated into Warm-Up / Core Workout / Cooldown
  - collapsible exercises accordion (collapsed by default)
  - interval player with floating playback widget, progress, chime, and TTS announcements
- Included short templates:
  - 5-Minute Warm-Up Flow (5 x 60s)
  - 5-Minute Cooldown Flow (5 x 60s)

## Project Structure
```
src/
  compoents/
  lib/
  pages/
  types/
docs/
```

## License
GPL-3.0-or-later. See [LICENSE](./LICENSE).
