# Stage 1: Build the application
FROM node:16 as builder

WORKDIR /app

# Copy the application code and package.json
COPY package.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm i

# Copy the rest of the application code
COPY src ./src
COPY .env ./

# Build the application
RUN npm run build

# Stage 2: Package the application for production
FROM node:16-alpine

WORKDIR /app

# Copy the built application from the previous stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.env ./

# Expose port
EXPOSE 3000

# Start application
CMD ["node", "dist/main"]