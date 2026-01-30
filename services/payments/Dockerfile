FROM node:18-alpine AS builder
WORKDIR /app

# Install pnpm and increase fetch timeouts/retries
RUN npm install -g pnpm@9.15.5
RUN npm config set fetch-timeout 7200000 && npm config set fetch-retries 10
RUN pnpm config set fetch-timeout 7200000 && pnpm config set fetch-retries 10
RUN apk add --no-cache curl

# Copy package files
COPY services/payments/package.json ./
COPY services/payments/package-lock.json* ./
COPY services/payments/tsconfig.json ./

# Install ALL dependencies (including devDependencies needed for build)
RUN npm install

# Copy application source
COPY services/payments/src ./src
COPY services/payments/README.md* ./

# Build the application
RUN npm run build

# ============================================
# Production stage
# ============================================
FROM node:18-alpine AS production

RUN npm install -g pnpm@9.15.5
RUN apk add --no-cache curl

WORKDIR /app

# Copy package files
COPY services/payments/package.json ./
COPY services/payments/package-lock.json* ./

# Install ONLY production dependencies
RUN npm install --omit=dev

# Copy built artifacts from builder stage
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3003

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3003/health || exit 1

# Start the application
CMD ["npm", "run", "start:prod"]