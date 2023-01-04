FROM node:14 AS deps
WORKDIR /app

COPY ./package.json ./yarn.lock ./
RUN yarn install --frozen-lockfile

COPY ./src ./src
COPY ./public ./public
RUN yarn build_prod

FROM node:14 AS runner
WORKDIR /app

ARG PORT
ENV PORT $PORT

COPY --from=deps /app/package.json /app/yarn.lock ./
COPY --from=deps /app/build ./build
COPY --from=deps /app/src ./src
COPY --from=deps /app/public ./public

RUN yarn install --frozen-lockfile
EXPOSE 3002
CMD ["yarn", "start"]