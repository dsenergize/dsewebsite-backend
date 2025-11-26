# --------------------------
# STAGE 1: Build/Install dependencies
# --------------------------
FROM node:22-alpine AS builder
WORKDIR /app

# Copy package files and install dependencies
# Note: You copy package*.json from the current context, which is the BACKEND folder.
COPY package*.json ./
RUN npm ci

# Copy the rest of the app (all files in the BACKEND folder)
COPY . .

# --------------------------
# STAGE 2: Production runtime
# --------------------------
FROM node:22-alpine
WORKDIR /app

# Set production environment variables
ENV NODE_ENV=production
# **CRITICAL CHANGE:** Cloud Run requires the container to listen on $PORT, 
# which is injected by the platform. The default is usually 8080.
ENV PORT=8080 

# Copy app from builder stage
COPY --from=builder /app /app

# Expose server port (Cloud Run automatically handles this if the process listens on $PORT)
EXPOSE 8080

# Optional: persist uploads - Note: Cloud Run is stateless. 
# Persistent storage (like an "Uploads" volume) should be Cloud Storage.
# VOLUME ["/app/Uploads"] 

# Start the server (Assuming your entry point is server.js)
CMD ["node", "server.js"]