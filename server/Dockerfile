# ─────────────────────────────────────────────────────────────────────────────
# Stage 1: base - shared Alpine base with necessary native libraries
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS base

# Install OpenSSL and libc6-compat for Prisma Engine compatibility on Alpine
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# ─────────────────────────────────────────────────────────────────────────────
# Stage 2: deps - install dependencies for building
# ─────────────────────────────────────────────────────────────────────────────
FROM base AS deps

COPY package*.json ./
RUN npm ci

# ─────────────────────────────────────────────────────────────────────────────
# Stage 3: builder - compile Prisma Client & TypeScript bundle
# ─────────────────────────────────────────────────────────────────────────────
FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Dummy DATABASE_URL for build-time prisma generation if not supplied
ENV DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"

# Generate Prisma client and compile TypeScript to dist/
RUN npx prisma generate
RUN npm run build

# ─────────────────────────────────────────────────────────────────────────────
# Stage 4: development - target for docker-compose development with tsx watch
# ─────────────────────────────────────────────────────────────────────────────
FROM base AS development

ARG PORT=5000
ENV PORT=${PORT}
ENV NODE_ENV=development

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Dummy DATABASE_URL to allow prisma generate in case .env is mounted later
ENV DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"
RUN npx prisma generate

EXPOSE ${PORT}

CMD ["npm", "run", "dev"]

# ─────────────────────────────────────────────────────────────────────────────
# Stage 5: runner - minimal, secure production runtime
# ─────────────────────────────────────────────────────────────────────────────
FROM base AS runner

ARG PORT=5000
ENV PORT=${PORT}
ENV NODE_ENV=production

WORKDIR /app

# Create a non-root system user for security
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 expressjs

# Install production dependencies only
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy compiled JavaScript code and Prisma artifacts from builder
COPY --from=builder --chown=expressjs:nodejs /app/dist ./dist
COPY --from=builder --chown=expressjs:nodejs /app/generated ./generated
COPY --from=builder --chown=expressjs:nodejs /app/prisma ./prisma

USER expressjs

EXPOSE ${PORT}

# Healthcheck checking Express /health endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:${PORT}/health || exit 1

CMD ["node", "dist/index.js"]
