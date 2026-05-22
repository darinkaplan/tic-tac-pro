# Tic-Tac-Pro

**Play live: [tic-tac-pro-psi.vercel.app](https://tic-tac-pro-psi.vercel.app)**

Ultimate Tic-Tac-Toe — a 3×3 grid of 3×3 boards. Win a small board to claim that cell on the big board; win the big board to win the game. Your opponent's move dictates which small board you play in next.

Built by [Advantage Testing South Florida](https://www.advantagetesting.com).

## Modes

- **Local 2-Player** — hot-seat play
- **You vs Easy AI** — heuristic opponent that wins/blocks immediate threats and prefers center cells
- **You vs Medium AI** — alpha-beta minimax (depth 4)
- **Easy vs Easy / Medium vs Medium** — watch two AIs play. The teaching panel explains every move.

## Run locally

```bash
npm install
npm run dev
```

## Test

```bash
npm test
```

## Stack

TypeScript · React · Vite · Tailwind CSS · Vitest · Vercel
