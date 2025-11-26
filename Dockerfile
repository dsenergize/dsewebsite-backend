# --------------------------
# STAGE 1: Build/Install dependencies
# --------------------------
FROM node:22-alpine AS builder
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the app
COPY . .

# --------------------------
# STAGE 2: Production runtime
# --------------------------
FROM node:22-alpine
WORKDIR /app

# Set production environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Copy app from builder stage
COPY --from=builder /app /app

# Expose server port
EXPOSE 5000

# Optional: persist uploads
VOLUME ["/app/Uploads"]

# Start the server
CMD ["node", "server.js"]
