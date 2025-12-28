FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
COPY prisma ./prisma

RUN npx prisma generate --schema=prisma/main/schema.prisma
RUN npx prisma generate --schema=prisma/audit/schema.prisma

EXPOSE ${PORT}

CMD ["npm", "run", "start:dev"]