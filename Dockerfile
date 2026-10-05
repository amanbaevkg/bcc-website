# Two uses, one file:
#   Local development (hot reload): docker compose up --build   → target "dev", see docker-compose.yml
#   Production server:              docker build -t bcc-web .   → the last stage, "run"
#     (live: docker build --build-arg SITE_ENV=production --build-arg SITE_URL=https://… -t bcc-web .)
#     docker run -p 3000:3000 -v bcc-data:/data --env-file .env.production bcc-web
# Secrets are passed at run time only; none are baked into any image.
# /data holds the admin's database and uploads: keep it on a persistent volume and back it up.

FROM node:22-alpine AS base
RUN corepack enable
WORKDIR /repo

# ---- Development: all workspace dependencies; the source is mounted from your machine at run time ----
FROM base AS dev
# Polling lets file changes made on macOS/Windows reach the container reliably.
ENV NODE_ENV=development NEXT_TELEMETRY_DISABLED=1 WATCHPACK_POLLING=true CHOKIDAR_USEPOLLING=true
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/web/package.json apps/web/
RUN pnpm install --frozen-lockfile
COPY . .
EXPOSE 3000
CMD ["pnpm", "--filter", "web", "exec", "next", "dev", "--hostname", "0.0.0.0", "--port", "3000"]

# ---- Production build ----
FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/web/package.json apps/web/
RUN pnpm install --frozen-lockfile --filter web...

FROM base AS build
COPY --from=deps /repo/node_modules ./node_modules
COPY --from=deps /repo/apps/web/node_modules ./apps/web/node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# Defaults for the build; the running server reads its own SITE_ENV / SITE_URL. Not secrets.
ARG SITE_ENV=staging
ARG SITE_URL=http://localhost:3000
ENV SITE_ENV=$SITE_ENV SITE_URL=$SITE_URL
# Fits in 2 GB of memory (see BUILD_LOW_MEMORY in next.config.ts).
ENV BUILD_LOW_MEMORY=1 NODE_OPTIONS=--max-old-space-size=1280
RUN pnpm --filter web build

FROM node:22-alpine AS run
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0 \
    DATABASE_URL=file:/data/payload.db PAYLOAD_MEDIA_DIR=/data/media
RUN addgroup -S app && adduser -S app -G app && mkdir -p /data/media && chown -R app:app /data
COPY --from=build --chown=app:app /repo/apps/web/.next/standalone ./
COPY --from=build --chown=app:app /repo/apps/web/.next/static ./apps/web/.next/static
COPY --from=build --chown=app:app /repo/apps/web/public ./apps/web/public
USER app
VOLUME /data
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s CMD wget -qO- http://127.0.0.1:3000/en >/dev/null || exit 1
CMD ["node", "apps/web/server.js"]
