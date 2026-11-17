# AGENTS.md (nexora-admin)

> Read fully before any task. Claude Code: `cp AGENTS.md CLAUDE.md`.
> Next.js can change between versions. If unsure about an API (App Router, middleware/proxy, caching), check `node_modules/next/dist/docs/` or the installed version's docs before writing code.
> Existing UI works with mock data. **Match existing patterns; do not restyle or restructure unless the task says so.**

## Project

Admin Dashboard for the Nexora multi-site CMS. Backend: `../nexora-api`. Docs: `../docs/` (`SPEC.md`, `SPEC-addendum.md`, `TASKS.md`, `04-lld.md` for API list).

## Stack (actual)

Next.js (App Router), TypeScript, Tailwind, shadcn/ui (`src/components/ui`, `components.json`), pnpm, ESLint.
Planned additions (ask before adding): TanStack Query, React Hook Form + Zod, Puck.

## Existing structure

```
src/app/auth/{login,forgot-password,reset-password,verify-otp}/page.tsx
src/app/dashboard/{layout.tsx, home/page.tsx}
src/components/{layouts (app-header, app-sidebar), providers, ui}
src/lib/{mock/*, store.ts, navigation.ts, format.ts, utils.ts}
src/hooks/use-mobile.ts
```

- New pages: `src/app/dashboard/<feature>/page.tsx`. Add the menu item in `src/lib/navigation.ts`.
- Reuse components from `src/components/ui`. Do not hand-write what shadcn already provides. Add new shadcn components via the CLI, not by hand.
- `src/lib/mock/*` is temporary. When a module is connected to the real API, stop importing its mock file (delete it only when nothing uses it).

## API integration rules

- One API client file (`src/lib/api/client.ts`): base URL from `NEXT_PUBLIC_API_URL`, `credentials: 'include'`, CSRF header if the backend requires it, maps backend error format to a typed error.
- Types for API data live in `src/lib/api/types.ts`, matching `../docs/04-lld.md` and actual backend DTOs. If backend and docs differ, the backend code wins; report the difference.
- Never store tokens/session data in localStorage. Auth is cookie-based.
- UI permission checks only hide/show UI. The backend is the real security.
- Every data page handles: loading (skeleton), empty (`empty.tsx`), and error states.

## Commands

Check `package.json`. Typical: `pnpm dev`, `pnpm lint`, `pnpm build`. Task U0.1 adds `pnpm check` (lint + typecheck + build). It **must pass before a task is done**.

## Rules

- TypeScript strict, no `any`.
- Server Components by default; add `'use client'` only when needed (state, effects, browser APIs).
- Forms: validate with Zod; show field errors from backend responses.
- Accessible: labels, keyboard navigation, aria where needed.
- Keep components small; extract only when reused or when a file passes ~250 lines.

## DO NOT

- Add dependencies without asking.
- Change the visual theme, layout shell, or existing pages unrelated to the task.
- Edit `components/ui/*` files for one-off tweaks (wrap them instead).
- Hardcode URLs, secrets, or fake data in connected pages.

## Workflow

1. Read `../docs/SPEC.md`, `SPEC-addendum.md`, your task, and the needed API section of `../docs/04-lld.md`.
2. Look at an existing similar page and copy its structure.
3. Short plan (files, components, API calls), then implement.
4. Run `pnpm check` (or lint + build). Fix until green.
5. Tick the task in `../docs/TASKS.md`; summarize files changed.
6. Commit: `feat(admin-ui): ...`, `fix: ...`.
