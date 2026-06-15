FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Copy shared api-client package
COPY packages/api-client/dist ./node_modules/@brindicis/api-client

EXPOSE 5176

CMD ["npm", "run", "dev", "--", "--host", "--port", "5176"]
