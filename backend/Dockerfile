FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .
 
RUN DATABASE_URL="postgresql://postgres:password@postgres:5432/mydatabase" npx prisma generate

EXPOSE 4000

CMD ["npm", "run", "dev"]