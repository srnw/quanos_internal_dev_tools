# DevTools Hub

An internal engineering tool directory. Engineers can browse, search, and filter links to internal services. An admin area allows authorised users to manage entries.

## Architecture

```
Browser
  └─► Frontend (Vue 3 SPA)
        └─► REST API  /api/*
              └─► Backend (NestJS)
                    └─► MongoDB
```

| Layer    | Technology                        | Location      |
|----------|-----------------------------------|---------------|
| Frontend | Vue 3 · Vite · Pinia · Tailwind 4 | `frontend/`   |
| Backend  | NestJS · Passport JWT             | `backend/`    |
| Database | MongoDB 7 (Mongoose ODM)          | Docker volume |

### Backend design patterns

- **Repository pattern** — `LinksRepository` isolates all Mongoose I/O so the service layer is database-agnostic and easy to unit-test.
- **Global validation** — `ValidationPipe` with `class-validator` DTOs rejects malformed input before it reaches the service.
- **Global exception filter** — `HttpExceptionFilter` produces a consistent JSON error envelope for all error responses.
- **Config module** — `@nestjs/config` loads environment variables and exposes them as a typed config object throughout the app.
- **OpenAPI / Swagger** — `@nestjs/swagger` generates interactive API documentation at `/api/docs`.

## Quick start (Docker)

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) ≥ 26
- `docker compose` plugin (bundled with Docker Desktop)

### 1. Copy and configure the environment file

```bash
cp .env.example .env
```

Edit `.env` if you want to change the admin credentials or JWT secret.

### 2. Start all services

```bash
docker compose up --build
```

The frontend is available at **http://localhost** (port 80).  
The backend API is available at **http://localhost/api** (proxied by nginx).  
Swagger UI is available at **http://localhost/api/docs** (proxied by nginx).

### Stop

```bash
docker compose down
```

To also remove the database volume:

```bash
docker compose down -v
```

## Local development (without Docker)

### Prerequisites

- Node.js ≥ 24 (see `.nvmrc`)
- pnpm ≥ 10
- A running MongoDB instance (or use `docker compose up mongo` to start only the DB)

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure the backend

```bash
cp backend/.env.example backend/.env
# Edit backend/.env — set MONGODB_URI to your local instance
```

### 3. Start the backend

```bash
pnpm --filter backend start:dev
```

The API server starts at **http://localhost:3000**.  
Swagger UI is available at **http://localhost:3000/api/docs**.

### 4. Start the frontend

```bash
pnpm --filter frontend dev
```

The dev server starts at **http://localhost:5173**. Requests to `/api/*` are proxied to `localhost:3000`.

## Environment variables

Copy `.env.example` to `.env` at the repo root for Docker Compose, and `backend/.env.example` to `backend/.env` for local development.

| Variable             | Default                        | Description                                      |
|----------------------|--------------------------------|--------------------------------------------------|
| `MONGO_ROOT_USERNAME`| `root`                         | MongoDB root user (Docker only)                  |
| `MONGO_ROOT_PASSWORD`| `example`                      | MongoDB root password (Docker only)              |
| `MONGODB_URI`        | `mongodb://…`                  | Full connection URI used by the backend          |
| `JWT_SECRET`         | `change-me-in-production`      | Secret used to sign access tokens                |
| `JWT_EXPIRES_IN`     | `1h`                           | Token lifetime (e.g. `1h`, `7d`)                |
| `ADMIN_USERNAME`     | `admin`                        | Admin login username                             |
| `ADMIN_PASSWORD`     | `admin123`                     | Admin login password                             |
| `FRONTEND_PORT`      | `80`                           | Host port mapped to the frontend container       |
| `FRONTEND_URL`       | `http://localhost`             | CORS origin the backend accepts (Docker only)    |

## Demo credentials

| Username | Password   |
|----------|------------|
| `admin`  | `admin123` |

## API reference

Interactive Swagger UI: **`/api/docs`** (served alongside the API).

All endpoints are prefixed with `/api`.

| Method   | Path              | Auth | Description              |
|----------|-------------------|------|--------------------------|
| `POST`   | `/auth/login`     | —    | Returns a JWT            |
| `GET`    | `/links`          | —    | List all links           |
| `POST`   | `/links`          | JWT  | Create a link            |
| `PATCH`  | `/links/:id`      | JWT  | Update a link            |
| `DELETE` | `/links/:id`      | JWT  | Delete a link            |

To authorise in Swagger UI, click **Authorize**, paste the `access_token` value returned by `POST /api/auth/login`, and all protected endpoints will include the `Authorization: Bearer …` header.

## Running tests

```bash
# Frontend (unit + component)
pnpm --filter frontend test

# Backend (unit)
pnpm --filter backend test

# Both with coverage
pnpm --filter frontend test:coverage
pnpm --filter backend test:coverage
```

## CI

Two GitHub Actions workflows run on every push and pull request to `main`:

| Workflow | File | Trigger path |
|----------|------|--------------|
| Frontend CI | `.github/workflows/frontend.yml` | `frontend/**` |
| Backend CI  | `.github/workflows/backend.yml`  | `backend/**`  |

Each workflow runs lint → type-check → tests with coverage → build. The backend workflow builds a Docker image; the frontend workflow runs `vite build`.

## Security considerations

The following items are conscious trade-offs made for demo/internal-tool simplicity. Each entry notes what a production deployment would require.

### Plain-text password comparison

`AuthService` compares the submitted password against the configured `ADMIN_PASSWORD` using `===`. This is intentional for a single-admin demo: there is no user store, no hashing round-trip, and no persistent state to manage.

**Production guidance:** store credentials in a proper user store, hash passwords at rest with bcrypt or argon2, and use `crypto.timingSafeEqual` (or the hashing library's constant-time compare) when validating to prevent timing-based enumeration attacks.

### JWT stored in `localStorage`

The frontend persists the access token in `localStorage`, which is readable by any JavaScript running on the page. This is an acceptable risk for an internal engineering tool served to a small trusted audience on a controlled network.

**Production guidance:** store the token in an `httpOnly` `Secure` cookie (inaccessible to JS) and pair it with a CSRF token or `SameSite=Strict` policy to prevent cross-site request forgery.

### Rate-limiting on write endpoints (resolved)

`ThrottlerGuard` was previously applied only to `POST /auth/login`, leaving the authenticated write endpoints (`POST /links`, `PATCH /links/:id`, `DELETE /links/:id`) unthrottled despite the global `ThrottlerModule` configuration. `ThrottlerGuard` is now applied to all three write endpoints, making throttle coverage consistent across the API.

### Seed race condition (resolved)

`LinksService.onModuleInit` used a non-atomic `count() → insertMany()` sequence. With concurrent container starts both observing an empty collection, both could attempt seeding and produce duplicate documents. This is now addressed by three layered changes:

1. A `unique` index on the `url` field (enforced at the MongoDB level).
2. `insertMany` called with `{ ordered: false }` so a partial batch does not abort on the first duplicate.
3. A `try/catch` in `onModuleInit` that swallows duplicate-key errors (`code 11000`) and logs a skip message, while re-throwing any other error.
