# ------------------------------------
# STAGE 1: Dependency & Frontend Build
# This stage installs all dependencies (including dev) and builds the frontend assets.
# We use a full Node image for this stage.
# ------------------------------------
FROM node:20-alpine AS builder

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) first.
# This step is often cached, speeding up subsequent builds if dependencies haven't changed.
COPY package*.json ./

# Install dependencies.
# Assuming 'npm run build' is defined in package.json and generates the 'dist' folder.
# Install both production and development dependencies needed for the build.
RUN npm install

# Copy the rest of the application source code
COPY . .

# Run the frontend build process (if applicable)
# The output (e.g., index.html, JS/CSS bundles) will be in the 'dist' folder, which server.js expects.
# If your project doesn't have a separate build step (e.g., if it's purely a backend API), you can comment this line out.
RUN npm run build

# ------------------------------------
# STAGE 2: Production Runtime
# This stage creates the final, lean production image.
# It only includes production dependencies and the built files.
# ------------------------------------
FROM node:20-alpine AS production

# Set environment variable
ENV NODE_ENV=production

# Set the port defined in server.js (5000 is the default/fallback)
ENV PORT=5000

# Set working directory
WORKDIR /app

# Copy only the necessary runtime files from the builder stage
# 1. Copy production node_modules
# The builder stage installed *all* modules, but often, the final app only needs production modules.
# We copy all /app/node_modules from builder to avoid re-installing just production dependencies,
# which simplifies the Dockerfile and ensures consistency.
COPY --from=builder /app/node_modules ./node_modules

# 2. Copy the built frontend assets
COPY --from=builder /app/dist ./dist

# 3. Copy the backend source code (including your server.js, routes, config, etc.)
# We use a .dockerignore file to exclude unnecessary files like node_modules and test folders.
COPY . .

# Expose the port where the Express server will listen
EXPOSE ${PORT}

# Run the application using server.js
# The application will listen on the port defined by the PORT environment variable.
CMD ["node", "server.js"]