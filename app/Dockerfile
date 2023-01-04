FROM node:14 AS deps
WORKDIR /app

COPY ./package.json ./yarn.lock ./
RUN yarn install --frozen-lockfile

COPY ./src ./src
COPY ./public ./public
RUN yarn build_prod

ARG PORT
ENV PORT $PORT
ENV NODE_ENV production

EXPOSE 3000
CMD [ "npx", "serve", "build" ]