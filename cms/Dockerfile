# ---------- Production ----------
FROM node:20-slim

WORKDIR /app

RUN corepack enable

COPY package.json yarn.lock ./

RUN yarn install --production --frozen-lockfile

COPY --from=builder /app/build ./build
COPY --from=builder /app/config ./config
COPY --from=builder /app/src ./src
COPY --from=builder /app/public ./public
COPY --from=builder /app/database ./database
COPY --from=builder /app/.tmp ./.tmp

RUN yarn build

EXPOSE 1337

CMD ["yarn", "start"]
