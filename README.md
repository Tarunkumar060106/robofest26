# ROBOFEST 2026 Web Experience

Interactive event landing experience for ROBOFEST 2026, built with Next.js and TypeScript. The current build focuses on preloader choreography, hero reveal transitions, custom scroll behavior, dynamic CTA behavior, and a live countdown module.

## Why This Repo

- Delivers a visually rich, animation-driven event front end.
- Prioritizes motion design and interaction polish (GSAP + custom UI transitions).
- Maintains a clean App Router baseline with clear structure for iterative feature rollout.

## Current Feature Set

- Frame-based preloader with staged loading text, progress indicator, and controlled reveal timing.
- Hero-to-content reveal pipeline with smooth entry transitions.
- Floating CTA bar that collapses/expands based on viewport probe position.
- Custom visual scrollbar synced to document scroll progress.
- Canvas-driven countdown section with live days/hours/minutes/seconds updates.
- Custom cursor assets and branded typography from local font files.

## Tech Stack

- Framework: Next.js 16 (App Router)
- Language: TypeScript + React 19
- Styling: Global CSS + Tailwind CSS 4 utilities
- Motion/interaction: GSAP, Lenis
- 3D dependency present for upcoming visual work: Three.js

## Quickstart

Prerequisites:

- Node.js (LTS)
- npm

Install and run:

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Available Scripts

```bash
npm run dev    # Start development server
npm run build  # Create production build
npm run start  # Start production server
npm run lint   # Run ESLint
```

## Project Structure

```text
app/
	globals.css             # Global styles, preloader, CTA, cursor and scrollbar styles
	layout.tsx              # Root layout and local font registration
	page.tsx                # Main page orchestration (preloader, hero, sections, CTA, scroll logic)
components/
	CountdownTimer.tsx      # Live countdown UI with animated digits + canvas grid background
public/
	fonts/                  # Local font assets
	images/                 # Branding, preloader frames, cursor assets, hero text assets
	video/                  # Media assets for experience sections
```

## Implementation Notes

- Event countdown target is configured in app/page.tsx via EVENT_DATE.
- Preloader frames are sourced from public/images/preloader.
- CTA text and link behavior are currently wired in page-level markup and ready for final registration URL integration.
- Several sections are still placeholder content blocks, indicating active development stage.

## Repository Maturity Snapshot

Recent commits show early-stage but structured progress:

- chore: add gitignore
- feat: add project files

This indicates the current baseline is established and ready for iterative feature hardening.

## Contribution Workflow

1. Create a feature branch from main.
2. Keep commits focused and descriptive.
3. Run lint and verify the app locally before opening a PR.
4. Include screenshots or short clips for UI/animation changes.

## License

No license file is currently present in this repository.
Add a LICENSE file before open-source distribution.
