# Builder
FROM node:20-alpine AS builder
WORKDIR /workspace

RUN npm install -g pnpm@9.15.5

# Copy workspace config
COPY package.json pnpm-workspace.yaml tsconfig.base.json pnpm-lock.yaml ./

# Copy app package.json
COPY apps/web/package.json apps/web/

# Install all workspace dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Install dependencies directly in the app folder (bypass workspace issues)
WORKDIR /workspace/apps/web
RUN pnpm install --no-frozen-lockfile

# Build the app
RUN pnpm build

# Verify build
RUN ls -l .next

# Runtime
FROM node:20-alpine AS runtime
WORKDIR /app
RUN npm install -g pnpm@9.15.5
RUN apk add --no-cache curl

# Copy built app
COPY --from=builder /workspace/apps/web/.next ./.next
COPY --from=builder /workspace/apps/web/public ./public
COPY --from=builder /workspace/apps/web/package.json ./package.json

# Install production dependencies only
RUN pnpm install --prod --no-frozen-lockfile

EXPOSE 3000
CMD ["pnpm", "start"]