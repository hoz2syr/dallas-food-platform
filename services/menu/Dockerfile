# Builder
FROM node:20-alpine AS builder
WORKDIR /workspace

RUN npm install -g pnpm@9.1.0

COPY package.json pnpm-workspace.yaml tsconfig.base.json ./
COPY pnpm-lock.yaml ./
COPY services/menu/package.json ./services/menu/package.json
RUN pnpm install --frozen-lockfile
COPY . .
WORKDIR /workspace/services/menu
RUN pnpm --filter ./services/menu... run build

# Runtime
FROM node:20-alpine AS runtime
WORKDIR /app/services/menu
RUN npm install -g pnpm@9.1.0
COPY --from=builder /workspace/services/menu/dist ./dist
COPY --from=builder /workspace/node_modules ./node_modules
EXPOSE 3001
CMD ["node", "dist/main.js"]
