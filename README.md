# Foodies Client

Frontend for the **Foodies** app — Vite · React 19 · TypeScript · Redux Toolkit
· react-hook-form · Tailwind CSS v4.

> **Scope.** This is the initial scaffold. It stands up the toolchain and a
> minimal starter screen that exercises the whole stack (Tailwind styling,
> a Redux Toolkit async thunk that pings the backend, and a react-hook-form
> form). Real pages/components come later.

## Tech stack

| Concern       | Choice                                         |
| ------------- | ---------------------------------------------- |
| Build tool    | Vite 6                                         |
| UI            | React 19 + TypeScript                          |
| State         | Redux Toolkit (+ built-in thunk) + react-redux |
| Forms         | react-hook-form                                |
| Styling       | Tailwind CSS v4 (`@tailwindcss/vite`)          |
| Tests         | Vitest + Testing Library (jsdom)               |
| Lint / format | ESLint 9 (flat config) + Prettier              |
| Git hooks     | Husky + lint-staged (pre-commit)               |

## Project structure

```
foodies-client/
├── index.html
├── src/
│   ├── main.tsx                     # App entry (Redux Provider)
│   ├── App.tsx                      # Starter screen (stack demo)
│   ├── index.css                    # Tailwind entry (@import "tailwindcss")
│   ├── store/
│   │   ├── store.ts                 # configureStore
│   │   └── hooks.ts                 # typed useAppDispatch / useAppSelector
│   ├── features/
│   │   └── health/healthSlice.ts    # example slice + async thunk (backend ping)
│   └── test/setup.ts                # jest-dom matchers for Vitest
├── eslint.config.js
├── vite.config.ts                   # Vite + Vitest config
└── .husky/pre-commit                # runs lint-staged
```

## Getting started

Requires Node 22+.

```bash
npm install
cp .env.example .env      # VITE_API_URL points at the Foodies API
npm run dev               # http://localhost:5173
```

Set `VITE_API_URL` (defaults to `http://localhost:3000`) so the "Check backend"
button reaches the API.

## npm scripts

| Script            | What it does                  |
| ----------------- | ----------------------------- |
| `npm run dev`     | Start the Vite dev server     |
| `npm run build`   | Type-check + production build |
| `npm run preview` | Preview the production build  |
| `npm test`        | Run Vitest                    |
| `npm run lint`    | ESLint                        |
| `npm run format`  | Prettier (write)              |

## Git hooks

`husky` installs a `pre-commit` hook that runs `lint-staged` (ESLint `--fix` +
Prettier on staged files). It is set up automatically via the `prepare` script
on `npm install` (in a git repo).

## Docker (local dev)

Runs the Vite dev server in a container (independent of the backend):

```bash
docker compose up --build     # http://localhost:5173
```

## Deployment (production: Vercel)

- **Framework preset:** Vite
- **Build command:** `npm run build` · **Output dir:** `dist`
- **Env var:** `VITE_API_URL` = your deployed Render API URL
