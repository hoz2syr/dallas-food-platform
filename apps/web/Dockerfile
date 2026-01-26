# Builder
FROM node:20-alpine AS builder
WORKDIR /workspace

RUN npm install -g pnpm@9.1.0

COPY package.json pnpm-workspace.yaml tsconfig.base.json ./
COPY pnpm-lock.yaml ./
COPY apps/web/package.json ./apps/web/package.json
RUN pnpm install --frozen-lockfile
COPY . .
WORKDIR /workspace/apps/web
RUN pnpm --filter ./apps/web... run build

# Runtime
FROM node:20-alpine AS runtime
WORKDIR /app/apps/web
RUN npm install -g pnpm@9.1.0
COPY --from=builder /workspace/apps/web/.next ./.next
COPY --from=builder /workspace/apps/web/public ./public
COPY --from=builder /workspace/apps/web/package.json ./package.json
COPY --from=builder /workspace/node_modules ./node_modules
EXPOSE 3000
CMD ["pnpm", "start"]
