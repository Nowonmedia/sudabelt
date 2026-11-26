# =============================================================================
# Sudabelt Medical Backend API - Minimal-Footprint Production Dockerfile
# Targets Hostinger VPS (Docker / Docker Compose) & Fly.io
# =============================================================================

# Stage 1: Build TypeScript to JavaScript
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src

RUN npm run build && npm prune --omit=dev

# Stage 2: Minimal Production Runtime
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000
ENV NODE_OPTIONS="--max-old-space-size=384"

COPY --from=builder --chown=node:node /app/package.json ./package.json
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/dist ./dist

RUN mkdir -p /app/uploads /app/data && chown -R node:node /app/uploads /app/data

USER node

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:5000/api/v1/health || exit 1

CMD ["node", "dist/server.js"]
