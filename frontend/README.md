# DevTools Hub — Frontend

A Vue 3 single-page application that serves as an internal tool directory. Engineers can browse, search, and filter links to services by category. An admin area (protected by mock authentication) lets authorised users create, edit, and delete entries.

## Features

- Public landing page with a searchable, filterable grid of tool links
- Category filters: Monitoring, CI/CD, Source Control, Infrastructure, Communication, Documentation, Other
- Admin dashboard: full CRUD for links (state is in-memory and resets on page reload)
- Mock authentication — no backend required
- Seed data pre-populated on startup so the app is immediately usable

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Vue 3 (Composition API) |
| Build tool | Vite |
| State management | Pinia |
| Routing | Vue Router |
| Styling | Tailwind CSS v4 |
| Icons | Heroicons v2 |
| Language | TypeScript |
| Package manager | pnpm |

## Prerequisites

- Node.js >= 24
- pnpm >= 10

## Project Setup

All commands below should be run from the `frontend/` directory.

### Install dependencies

```sh
pnpm install
```

### Development

Start the dev server with hot-module replacement:

```sh
pnpm dev
```

### Production build

Type-check and compile in one step:

```sh
pnpm build
```

Compile without type-checking (faster, useful in CI when type-checking runs separately):

```sh
pnpm build-only
```

Preview the production build locally:

```sh
pnpm preview
```

### Code quality

The project uses ESLint (with auto-fix) and Prettier for consistent formatting.

| Command | What it does |
|---|---|
| `pnpm type-check` | Run `vue-tsc` without emitting — pure type validation |
| `pnpm lint` | Lint all `.ts` / `.vue` files and auto-fix where possible |
| `pnpm format` | Reformat `src/` with Prettier |
| `pnpm test` | Run unit tests in watch mode (Vitest + jsdom) |
| `pnpm test:coverage` | Run tests once and generate a V8 coverage report |

## Demo credentials

The admin area at `/admin` is protected by mock login. Use:

| Field | Value |
|---|---|
| Username | `admin` |
| Password | `admin123` |

> These credentials are hard-coded in `src/stores/auth.ts` and are only suitable for local development / demo purposes.

## Project Structure

```
src/
├── assets/         # Global CSS (Tailwind entry point)
├── components/     # Reusable UI components
│   ├── AdminLinkForm.vue   # Create / edit link modal
│   ├── AppIcon.vue         # Heroicons wrapper
│   ├── ConfirmModal.vue    # Generic confirmation dialog
│   ├── LinkCard.vue        # Tool card on the landing page
│   └── NavBar.vue          # Top navigation bar
├── router/         # Vue Router configuration and navigation guards
├── stores/         # Pinia stores (auth, links)
├── types/          # Shared TypeScript interfaces and constants
└── views/          # Route-level page components
    ├── AdminDashboard.vue  # Link management table (requires auth)
    ├── AdminLogin.vue      # Mock admin login form
    └── LandingPage.vue     # Public tool grid with search and filters
```
