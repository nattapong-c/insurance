FROM node:16-alpine
WORKDIR /app

COPY ./service/package.json ./service/yarn.lock ./
RUN apk add --update python3 make g++\
   && rm -rf /var/cache/apk/*
RUN yarn install --frozen-lockfile

COPY ./service .
RUN yarn build

CMD ["node", "build/app.js"]