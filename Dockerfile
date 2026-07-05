FROM node:22-alpine AS builder

WORKDIR /usr/src/app

RUN apk add --no-cache openssl

COPY package*.json ./
COPY package-lock.json* ./
COPY prisma ./prisma/

RUN npm ci

COPY . .

RUN npx prisma generate
RUN npm run build

FROM node:22-alpine

WORKDIR /usr/src/app

RUN apk add --no-cache openssl

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma

ENV PORT=4000
EXPOSE ${PORT}

CMD ["node", "dist/main"]
