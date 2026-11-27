# Project memory

## Product intent & audience

- Broadcast app built with Next.js
- Integrates with Google Sheets (runtime fetches for data)

## Brand personality & voice

- Not yet inferred

## Visual design & UX direction

- Not yet inferred

## Decisions, constraints & rationale

- Next.js 16 defaults to Turbopack, which lacks required native bindings on this platform; dev server must use `--webpack` flag (`next dev --webpack`)
- pnpm is the package manager; `pnpm-workspace.yaml` must include a valid `packages` field
- Webpack bundler is the working choice for dev server; Turbopack is blocked by platform constraints

## Open questions & assumptions

- Production build bundler choice (Turbopack vs Webpack) not yet decided
- Google Sheets integration details (API, sheet structure, data schema) not yet explored
- App UI/UX direction and visual design not yet established