FROM node:22-slim

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --production

COPY . .

RUN yarn build

EXPOSE 3000

CMD ["node", "dist/main"]
