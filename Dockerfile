FROM node:20-slim

WORKDIR /usr/src/app

# Copy package trước để cache layer
COPY package*.json ./

RUN npm install

# Copy source
COPY . .

EXPOSE 3443

CMD ["sh", "-c", "npx knex migrate:latest --env production && npm start"]