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

## Demo credentials

| Username | Password   |
|----------|------------|
| `admin`  | `admin123` |

## API reference

All endpoints are prefixed with `/api`.

| Method   | Path              | Auth | Description              |
|----------|-------------------|------|--------------------------|
| `POST`   | `/auth/login`     | —    | Returns a JWT            |
| `GET`    | `/links`          | —    | List all links           |
| `POST`   | `/links`          | JWT  | Create a link            |
| `PATCH`  | `/links/:id`      | JWT  | Update a link            |
| `DELETE` | `/links/:id`      | JWT  | Delete a link            |

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

Each workflow runs lint → type-check → tests with coverage → build (Docker image for the backend).
