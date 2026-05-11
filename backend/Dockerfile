# ── Stage 1: build ────────────────────────────────────────────────────────────
FROM node:24-alpine AS builder

RUN corepack enable && corepack prepare pnpm@11.0.9 --activate

WORKDIR /app

# Copy workspace root manifests so pnpm can resolve the lockfile
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
RUN pnpm install --frozen-lockfile --filter backend

COPY backend ./backend
RUN pnpm --filter backend build

# ── Stage 2: runtime ──────────────────────────────────────────────────────────
FROM node:24-alpine AS runner

RUN corepack enable && corepack prepare pnpm@11.0.9 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
RUN pnpm install --frozen-lockfile --filter backend --prod

COPY --from=builder /app/backend/dist ./backend/dist

EXPOSE 3000

CMD ["node", "backend/dist/main"]
