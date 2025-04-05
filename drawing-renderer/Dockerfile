FROM node:alpine

COPY ./package.json /code/package.json
COPY ./yarn.lock /code/yarn.lock
WORKDIR /code

RUN corepack enable
RUN yarn install

COPY . /code
