# ── Stage 1: base ─────────────────────────────────────────
FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm" PATH="/pnpm:$PATH"
RUN corepack enable && corepack prepare pnpm@10.23.0 --activate
WORKDIR /app

# ── Stage 2: deps ─────────────────────────────────────────
FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./
COPY apps/portal/package.json                       apps/portal/package.json
COPY packages/db/package.json                       packages/db/package.json
COPY packages/ui/package.json                       packages/ui/package.json
COPY packages/queue/package.json                    packages/queue/package.json
COPY packages/eslint-config/package.json            packages/eslint-config/package.json
COPY packages/typescript-config/package.json        packages/typescript-config/package.json
RUN pnpm install --frozen-lockfile

# ── Stage 3: build ────────────────────────────────────────
FROM deps AS build
COPY packages/typescript-config/ packages/typescript-config/
COPY packages/eslint-config/     packages/eslint-config/
COPY packages/db/                packages/db/
COPY packages/ui/                packages/ui/
COPY packages/queue/             packages/queue/
COPY apps/portal/                apps/portal/

# Build @repo/db (Prisma generate + tsup)
RUN apt-get update -qq && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*
RUN pnpm --filter @repo/db run build

# Build the Next.js portal app
RUN pnpm --filter tenuq-portal run build

# ── Stage 4: runner ──────────────────────────────────────
FROM node:22-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy the standalone output
COPY --from=build /app/apps/portal/.next/standalone ./
COPY --from=build /app/apps/portal/.next/static     apps/portal/.next/static
COPY --from=build /app/apps/portal/public            apps/portal/public

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://localhost:3000/api/health').then(r=>{if(!r.ok)throw 1}).catch(()=>process.exit(1))"

CMD ["node", "apps/portal/server.js"]
