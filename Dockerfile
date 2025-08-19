# Development Dockerfile for Next.js with hot reloading
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start development server with hot reloading
CMD ["npm", "run", "dev"]