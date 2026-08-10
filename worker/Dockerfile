FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN DATABASE_URL="postgresql://dummy:dummy@postgres:5432/dummy" npx prisma generate

CMD ["npm","run","start"]