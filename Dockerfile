FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:24-alpine AS runner

WORKDIR /app

COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

ENV PORT=5176
ENV HOST=0.0.0.0
ENV PUBLIC_API_URL=http://localhost:3000

EXPOSE 5176

CMD ["node", "build"]

