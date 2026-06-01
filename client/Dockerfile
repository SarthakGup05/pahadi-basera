# ─────────────────────────────────────────────────────────────────────────────
# Stage 1: deps — install production node_modules only
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS deps
# Required for native packages (sharp, bcrypt, etc.)
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy lockfile + manifest first so Docker caches this layer
COPY package.json package-lock.json ./

# Install prod deps only — no devDeps in final image
RUN npm ci --omit=dev

# ─────────────────────────────────────────────────────────────────────────────
# Stage 2: builder — compile the Next.js app
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy ALL deps (including dev) for the build step
COPY package.json package-lock.json ./
RUN npm ci

# Copy source
COPY . .

# Build-time env vars (non-sensitive; baked into JS bundles)
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build

# ─────────────────────────────────────────────────────────────────────────────
# Stage 3: runner — minimal production image
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# Port Next.js listens on
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

# Copy only what the standalone server needs:
# 1. The standalone server bundle (includes its own node_modules copy)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

# 2. Static files (_next/static) — served directly by the Node server
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# 3. Public folder (favicons, images, robots.txt, etc.)
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000

# Healthcheck — Docker/orchestrators will restart if this fails
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/ || exit 1

CMD ["node", "server.js"]
