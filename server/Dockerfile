# ---------- BUILD STAGE ----------
FROM node:20-alpine AS builder

# Create app directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the app
RUN npm run build

# ---------- PRODUCTION STAGE ----------
FROM node:20-alpine AS production

WORKDIR /app

# Copy only what’s needed for production
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy built files from the builder stage
COPY --from=builder /app/dist ./dist

# Expose NestJS default port
EXPOSE 3000

# Set environment variable
ENV NODE_ENV=production

# Run the app
CMD ["node", "dist/main.js"]