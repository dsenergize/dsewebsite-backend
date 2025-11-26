# --------------------------
# STAGE 1: Build/Install dependencies
# --------------------------
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the code
COPY . .

# --------------------------
# STAGE 2: Production runtime
# --------------------------
FROM node:22-alpine

# Set production environment
ENV NODE_ENV=production
ENV PORT=5000

WORKDIR /app

# Copy app from builder stage
COPY --from=builder /app /app

# Expose the port
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]
