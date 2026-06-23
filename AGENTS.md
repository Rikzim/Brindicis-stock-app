# Brindicis Stock App

SvelteKit + Svelte 5 + TypeScript + Tailwind v4 stock management frontend.

## Commands

- `npm run dev` — start Vite dev server
- `npm run build` — production build
- `npm run preview` — preview the production build
- `npm run check` — run `svelte-check` (type-check `.ts` and `<script lang="ts">` blocks)
- `npm run check:watch` — same, in watch mode
- `npm run lint` — run ESLint
- `npm run format` — run Prettier in write mode

Run all three (check, lint, build) before opening a PR.

## Conventions

- All new components use `<script lang="ts">` with explicit `Props` types.
- API calls go through `src/lib/utils/stock-api.ts` and `src/lib/utils/auth-api.ts` (do not call `apiClient` directly outside `api-client.ts`).
- Backend route paths are defined in `src/lib/utils/routes.ts`.
- Domain types live in `src/lib/utils/stock-types.ts`.
- Reactive state for CRUD modals: `createCrudModal<T>()` from `src/lib/state/crud-modal.svelte.ts`.
- Async data fetching: `createAsyncStore(fetcher)` from `src/lib/state/async-store.svelte.ts`.
- Icons: import directly from `lucide-svelte`.
- Routes use SvelteKit's file-based routing in `src/routes/`. Auth guards run in `src/routes/+layout.svelte` (client-side, via `route-guard.ts`).

## Environment

- `PUBLIC_API_URL` — base URL of the backend API (SvelteKit, defaults to `http://localhost:3000`).
- `VITE_API_URL` — legacy alias still honored for compatibility.

Copy `.env.example` to `.env` to override defaults.
