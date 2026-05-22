# Tic-Tac-Pro

## What this is
Web implementation of Ultimate Tic-Tac-Toe. Personal/learning project for ATSF.

## Architecture — three strict layers
- `src/game/` — Pure game logic. **No React. No DOM. No randomness.** Fully pure functions of state → state.
- `src/ai/` — AI engines. Pure functions of `GameState → Move`. **No React.** May use deterministic RNG (seeded).
- `src/ui/` — React components. Imports from `game/` and `ai/`. The only layer with side effects.

Game logic must be testable in isolation. AI must be testable without rendering.

## Conventions
- TypeScript strict mode. Avoid `any`.
- TDD: failing test first, then minimal implementation.
- Pure functions wherever possible. Mutation only at React state boundaries (`useReducer`).
- One responsibility per file. Files that change together live together.
- Conventional commit prefixes: `feat:`, `fix:`, `test:`, `chore:`, `refactor:`, `docs:`, `style:`.
- Commit per task.

## Move encoding
`{ boardIdx: 0-8, cellIdx: 0-8 }` — both row-major. `boardIdx = row * 3 + col` on the big board; `cellIdx = row * 3 + col` within the small board.

## Brand
ATSF: navy `#103B73` primary, gold `#D4A017` accent. Formal, professional, premium feel. Brand tokens live in `tailwind.config.js` under `theme.extend.colors.atsf`.

## Commands
- `npm run dev` — dev server
- `npm test` — run all tests once
- `npm run test:watch` — watch mode
- `npm run typecheck` — strict-mode type check (Vitest does NOT type-check)
- `npm run lint` — ESLint
- `npm run build` — production build (typecheck + vite build)
- `npm run preview` — preview production build locally

## Tests
Co-located as `*.test.ts(x)` next to source files. Vitest runs them.
