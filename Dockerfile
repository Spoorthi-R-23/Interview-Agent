# Multi-stage Docker build for Interview Agent

# Stage 1: Build Frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Backend
FROM node:18-alpine
WORKDIR /app

# Copy backend files
COPY backend/package*.json ./
RUN npm ci --production

COPY backend/ ./

# Copy built frontend files
COPY --from=frontend-builder /app/frontend/dist ./public

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 5000

# Set environment
ENV NODE_ENV=production

# Start the server
CMD ["node", "src/server.js"]
