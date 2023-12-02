# Build stage
FROM node:20.10.0 AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Production stage
FROM node:20.10.0
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm install --production
ENV SECRET=${SECRET} \
    PORT=${PORT} \
    MONGO_DB_URL=${MONGO_DB_URL}
EXPOSE ${PORT}
CMD ["node", "dist/src/main/index.js"]
