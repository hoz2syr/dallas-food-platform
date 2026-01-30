# Builder
FROM node:20-alpine AS builder
WORKDIR /workspace

RUN npm install -g pnpm@9.15.5

COPY package.json pnpm-workspace.yaml tsconfig.base.json ./
COPY pnpm-lock.yaml ./
COPY services/menu/package.json ./services/menu/package.json
RUN pnpm install --frozen-lockfile
COPY . .

# Install dependencies locally and build
WORKDIR /workspace/services/menu
RUN pnpm install --no-frozen-lockfile
RUN pnpm run build

# Runtime
FROM node:20-alpine AS runtime
WORKDIR /app
RUN npm install -g pnpm@9.15.5
RUN apk add --no-cache curl

COPY --from=builder /workspace/services/menu/dist ./dist
COPY --from=builder /workspace/services/menu/package.json ./package.json

RUN pnpm install --prod --no-frozen-lockfile

EXPOSE 3001
CMD ["node", "dist/main.js"]