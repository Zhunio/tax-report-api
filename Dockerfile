# Simple multi-stage build for a NestJS app
# Stage 1: install deps and build the TypeScript app
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency files first
COPY package.json package-lock.json ./

# Install all dependencies (including dev deps for building)
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma client so TypeScript can resolve Prisma model/types during build
RUN npx prisma generate

# Build app
RUN npm run build

# Stage 2: production runtime image
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy the built app from the builder stage
COPY --from=builder /app ./

# Use non-root user for better security
USER node

EXPOSE 3000

# Run DB migrations before starting the API
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]
