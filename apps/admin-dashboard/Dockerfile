# Builder
FROM node:20-alpine AS builder
WORKDIR /workspace

RUN npm install -g pnpm@9.15.5

COPY package.json pnpm-workspace.yaml tsconfig.base.json ./
COPY pnpm-lock.yaml ./
COPY apps/admin-dashboard/package.json ./apps/admin-dashboard/package.json
RUN pnpm install --frozen-lockfile
COPY . .

# Install dependencies locally and build
WORKDIR /workspace/apps/admin-dashboard
RUN pnpm install --no-frozen-lockfile
RUN pnpm build

# Runtime
FROM node:20-alpine AS runtime
WORKDIR /app
RUN npm install -g pnpm@9.15.5
RUN apk add --no-cache curl

COPY --from=builder /workspace/apps/admin-dashboard/.next ./.next
COPY --from=builder /workspace/apps/admin-dashboard/public ./public
COPY --from=builder /workspace/apps/admin-dashboard/package.json ./package.json

RUN pnpm install --prod --no-frozen-lockfile

EXPOSE 3000
CMD ["pnpm", "start"]