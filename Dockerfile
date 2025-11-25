# ------------------------------------
# STAGE 1: Dependency & Frontend Build
# ------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy backend package files
COPY package*.json ./

RUN npm install

# Copy backend source
COPY . .

# ---- NEW: Copy the frontend folder from root project ----
# Cloud Build context must include both Backend and Frontend
COPY ../Frontend ./frontend

# Build frontend (dist will be inside /app/frontend/dist)
RUN cd frontend && npm install && npm run build

# ------------------------------------
# STAGE 2: Production Runtime
# ------------------------------------
FROM node:20-alpine AS production

ENV NODE_ENV=production
ENV PORT=5000

WORKDIR /app

# Copy production node_modules
COPY --from=builder /app/node_modules ./node_modules

# ---- NEW: Copy built frontend dist into /app/Frontend/dist ----
COPY --from=builder /app/frontend/dist ./Frontend/dist

# Copy backend code
COPY . .

EXPOSE ${PORT}

CMD ["node", "server.js"]
