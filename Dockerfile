# syntax=docker/dockerfile:1.7

# ---- Stage: deps ----
# Install full dependency tree (includes devDeps needed for `next build`).
FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# ---- Stage: build ----
# Compile the Next.js production bundle in standalone mode.
FROM node:24-alpine AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# NEXT_PUBLIC_* vars are inlined into the client bundle at build time, so they
# must be present here (not just at runtime).
ARG NEXT_PUBLIC_BETTER_AUTH_URL
ENV NEXT_PUBLIC_BETTER_AUTH_URL=${NEXT_PUBLIC_BETTER_AUTH_URL}

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---- Stage: runner ----
# Minimal runtime image: standalone bundle + static assets + migration runner.
FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# Standalone server + the minimal node_modules Next.js traced.
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
# Static assets — Next traces but does not include these in the standalone bundle.
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=build --chown=nextjs:nodejs /app/public ./public

# Migration runtime: the SQL files + the migrator script. drizzle-orm and
# postgres are copied explicitly because the `drizzle-orm/postgres-js/migrator`
# subpath is only imported by scripts/migrate.mjs and is not reached by Next's
# server tracer, so it would otherwise be missing from the standalone bundle.
COPY --from=build --chown=nextjs:nodejs /app/db/migrations ./db/migrations
COPY --from=build --chown=nextjs:nodejs /app/scripts/migrate.mjs ./scripts/migrate.mjs
COPY --from=deps --chown=nextjs:nodejs /app/node_modules/drizzle-orm ./node_modules/drizzle-orm
COPY --from=deps --chown=nextjs:nodejs /app/node_modules/postgres ./node_modules/postgres

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
