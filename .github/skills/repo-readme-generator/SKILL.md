---
name: repo-readme-generator
description: "Create a professional README.md for any GitHub repository by analyzing project file structure, technology stack, scripts, and git commit history. Use when writing or refreshing repository documentation, onboarding docs, open-source project pages, portfolio repos, or handoff documentation."
argument-hint: "Optional: target audience, repo purpose, tone, sections to include/exclude, badge preferences"
user-invocable: true
---

# Repository README Generator

Generate a complete, professional `README.md` by inspecting repository structure and commit history before writing.

## When To Use

- A repository has no README or a weak README.
- Project documentation is outdated after major feature work.
- You need consistent, high-quality docs across many repos.
- You want onboarding-ready docs for teammates or open-source users.

## Inputs

- Optional audience: `maintainers`, `contributors`, `users`, `recruiters`, `judges`.
- Optional tone: `concise`, `formal`, `developer-friendly`, `marketing-light`.
- Optional section overrides: include/remove sections (for example: roadmap, architecture, demo).

## Procedure

1. Confirm scope and intent.

- Determine whether to update existing `README.md` or create a new one.
- Identify audience and expected outcomes (run app, contribute, evaluate project).

2. Inspect repository structure and metadata.

- Read top-level files (`package.json`, `pyproject.toml`, `requirements.txt`, `Cargo.toml`, etc.) to infer stack.
- Inspect source folders to identify app boundaries and key modules.
- Capture executable scripts or commands from manifest files.

3. Analyze commit history for project narrative.

- Inspect recent commits (`git log --oneline --decorate -n 30` at minimum).
- Extract milestones: setup, core features, refactors, breaking changes, deployment work.
- Identify active areas to infer current focus and maturity.

4. Derive README content model.

- Must include: project overview, feature highlights, tech stack, setup, usage, project structure, contribution, license.
- Add optional sections when evidence exists: architecture notes, deployment, troubleshooting, FAQ, acknowledgments, roadmap.
- If repository has frontend/backend split or monorepo packages, document each runnable unit separately.

5. Draft README with evidence-based details only.

- Use commands that are actually available in scripts or common conventions for detected stack.
- Prefer copy-paste-ready setup blocks.
- Keep descriptions concrete and avoid generic filler.

6. Validate quality before finalizing.

- Verify every command references a real tool or script.
- Ensure section order flows from discovery to action (what it is -> how to run -> how to contribute).
- Confirm links/paths are accurate and formatted correctly.

## Decision Rules

- If no commit history exists: rely on structure and manifests; mark uncertain areas as TODO notes.
- If README exists and is strong: produce targeted patch-style improvements instead of full rewrite.
- If project is early-stage: keep roadmap and assumptions explicit.
- If production-oriented: prioritize deployment, environment variables, and operational notes.

## Output Standard

A professional README should include:

- Clear title and one-paragraph value proposition.
- Quickstart with minimal commands.
- Feature list tied to real implementation.
- Tech stack and dependency assumptions.
- Project structure map for navigation.
- Contribution and license guidance.

## Completion Checklist

- Commands were validated against actual scripts/files.
- No invented features or tooling.
- Setup instructions are reproducible.
- Tone matches intended audience.
- README is concise but complete for first-time users.

## Suggested Prompt Starters

- `/repo-readme-generator Write a README for contributors and new users. Keep it practical and concise.`
- `/repo-readme-generator Refresh README using recent commits and add architecture + deployment sections.`
- `/repo-readme-generator Create a portfolio-friendly README with clear quickstart and feature highlights.`
