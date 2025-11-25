# --------------------------
# STAGE 1: Install deps
# --------------------------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# --------------------------
# STAGE 2: PROD RUNTIME
# --------------------------
FROM node:20-alpine

ENV NODE_ENV=production
ENV PORT=5000

WORKDIR /app

COPY --from=builder /app /app

EXPOSE 5000
CMD ["node", "server.js"]
