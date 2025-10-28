FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

# 👇 Copia os dois diretórios do Prisma
COPY prisma ./prisma
COPY . .

# 👇 Gera os dois clientes Prisma (para main e audit)
RUN npx prisma generate --schema=prisma/main/schema.prisma
RUN npx prisma generate --schema=prisma/audit/schema.prisma

CMD ["npm", "run", "start:prod"]
