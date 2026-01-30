# Builder
FROM node:20-alpine AS builder
WORKDIR /workspace

RUN npm install -g pnpm@9.15.5

COPY package.json pnpm-workspace.yaml tsconfig.base.json ./
COPY pnpm-lock.yaml ./
COPY services/delivery/package.json ./services/delivery/package.json
RUN pnpm install --frozen-lockfile
COPY . .

# Install dependencies locally and build
WORKDIR /workspace/services/delivery
RUN pnpm install --no-frozen-lockfile
RUN pnpm run build

# Runtime image
FROM node:20-alpine AS runtime
WORKDIR /app
RUN npm install -g pnpm@9.15.5
RUN apk add --no-cache curl

COPY --from=builder /workspace/services/delivery/dist ./dist
COPY --from=builder /workspace/services/delivery/package.json ./package.json

RUN pnpm install --prod --no-frozen-lockfile

EXPOSE 3004
CMD ["node", "dist/main.js"]