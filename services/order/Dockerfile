# Builder
FROM node:20-alpine AS builder
WORKDIR /app

# Enable corepack and pnpm
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

# Copy root tsconfig for tsc project references if build context is repo root
COPY tsconfig.base.json ./

# Copy package files for the service
COPY services/order/package.json ./services/order/package.json

WORKDIR /app/services/order

# Install dependencies for the order service only
RUN pnpm install --offline || pnpm install --shamefully-hoist --no-frozen-lockfile || pnpm install

# Copy service source
COPY services/order .

# Build
RUN pnpm run build

# Runtime
FROM node:20-alpine AS runtime
WORKDIR /app/services/order

# Enable corepack and pnpm in runtime
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

# Copy built files and node_modules from builder
COPY --from=builder /app/services/order/dist ./dist
COPY --from=builder /app/services/order/node_modules ./node_modules

EXPOSE 3000
CMD ["node", "dist/main.js"]
