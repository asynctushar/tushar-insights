# ---------- Production ----------
FROM node:20-slim

WORKDIR /app

RUN corepack enable

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

EXPOSE 1337

CMD ["yarn", "start"]
