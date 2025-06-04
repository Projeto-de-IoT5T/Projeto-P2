FROM node:22-slim AS builder

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build


FROM node:22-slim AS production

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --production

COPY --from=builder /app/dist ./dist

EXPOSE 3000

# Comando padrão
CMD ["node", "dist/main"]
