# Production Dockerfile for Next.js
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Install dependencies (including dev deps for build)
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Remove dev dependencies after build
RUN npm ci --only=production && npm cache clean --force

# Expose port
EXPOSE 3000

# Start production server
CMD ["npm", "start"]