# Builder
FROM node:20-alpine AS builder
WORKDIR /workspace

# Enable corepack and pin pnpm version
RUN npm install -g pnpm@9.1.0

# Copy workspace manifests first for better layer caching
COPY package.json pnpm-workspace.yaml tsconfig.base.json ./
COPY pnpm-lock.yaml ./

# Copy only the target package manifest to leverage cache when package.json changes
COPY services/order/package.json ./services/order/package.json

# Install all workspace dependencies deterministically
RUN pnpm install --frozen-lockfile

# Copy full repository
COPY . .

# Build only the order service using workspace filters
WORKDIR /workspace/services/order
RUN pnpm --filter ./services/order... run build

# Runtime image
FROM node:20-alpine AS runtime
WORKDIR /app/services/order

RUN npm install -g pnpm@9.1.0

# Copy built artifacts and workspace node_modules
COPY --from=builder /workspace/services/order/dist ./dist
COPY --from=builder /workspace/node_modules ./node_modules

EXPOSE 3000
CMD ["node", "dist/main.js"]
