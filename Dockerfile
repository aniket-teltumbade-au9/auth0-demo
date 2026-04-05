# ─────────────────────────────────────────────────────────
# Stage 1 — deps
#   Install only production node_modules.
#   Re-used by the builder so node_modules aren't rebuilt twice.
# ─────────────────────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app

# Install libc compat layer (required by some native modules on Alpine)
RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# ─────────────────────────────────────────────────────────
# Stage 2 — builder
#   Build the Next.js app in standalone output mode.
#   All env vars that are baked into the client bundle at
#   build time must be supplied here as build args.
# ─────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

# Install ALL deps (including devDependencies) for the build
COPY package.json package-lock.json ./
RUN npm ci

# Copy source
COPY . .

# Next.js standalone output — copies only what is needed to run.
# Set this via an ARG so CI can override it; the next.config.ts
# also sets output: "standalone" (added below).
ENV NEXT_TELEMETRY_DISABLED=1

# Build-time env vars needed by Next.js server components / API
# routes are passed as ARGs and forwarded to the build.
# Secrets (AUTH0_SECRET, MONGODB_URI, etc.) are NOT embedded at
# build time — they are injected at runtime via docker run -e or
# docker-compose env_file.
ARG APP_BASE_URL=http://localhost:3000
ENV APP_BASE_URL=$APP_BASE_URL

RUN npm run build

# ─────────────────────────────────────────────────────────
# Stage 3 — runner  (final image)
#   Copies only the standalone output — no node_modules,
#   no source, no devDeps. Smallest possible image.
# ─────────────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Least-privilege user
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

# Standalone server
COPY --from=builder /app/.next/standalone ./

# Static assets and public folder
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# next start is replaced by the standalone server.js
CMD ["node", "server.js"]
