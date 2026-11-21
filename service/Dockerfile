FROM node:22-alpine
WORKDIR /app

RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    font-noto-thai \
    python3 \
    make \
    g++

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

COPY ./service/package.json ./service/yarn.lock ./
RUN yarn install --frozen-lockfile

COPY ./service .
RUN yarn build

CMD ["node", "dist/app.js"]
