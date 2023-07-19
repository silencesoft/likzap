FROM node:alpine as base

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn
COPY . .

FROM base as production
ENV NODE_PATH=./build
RUN yarn build
