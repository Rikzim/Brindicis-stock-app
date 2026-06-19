FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5176

CMD ["npm", "run", "dev", "--", "--host", "--port", "5176"]
