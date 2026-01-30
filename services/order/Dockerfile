# Builder
FROM node:20-alpine AS builder
WORKDIR /workspace

RUN npm install -g pnpm@9.15.5

COPY package.json pnpm-workspace.yaml tsconfig.base.json ./
COPY pnpm-lock.yaml ./
COPY services/order/package.json ./services/order/package.json
RUN pnpm install --frozen-lockfile
COPY . .

# Install dependencies locally and build
WORKDIR /workspace/services/order
RUN pnpm install --no-frozen-lockfile
RUN pnpm run build

# Runtime image
FROM node:20-alpine AS runtime
WORKDIR /app
RUN npm install -g pnpm@9.15.5
RUN apk add --no-cache curl

COPY --from=builder /workspace/services/order/dist ./dist
COPY --from=builder /workspace/services/order/package.json ./package.json

RUN pnpm install --prod --no-frozen-lockfile

EXPOSE 3000
CMD ["node", "dist/main.js"]