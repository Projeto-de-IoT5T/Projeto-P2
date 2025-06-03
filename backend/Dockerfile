FROM node:22-slim

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

RUN yarn global add nodemon ts-node typescript tsconfig-paths

COPY . .

EXPOSE 3000

CMD ["yarn", "start:dev"]
