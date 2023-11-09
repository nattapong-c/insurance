FROM node:16-alpine
WORKDIR /app

COPY ./app/package.json ./app/yarn.lock ./
RUN yarn install --frozen-lockfile

COPY ./app .
RUN yarn build_docker

CMD yarn start