FROM node:20

WORKDIR /app

# Enable corepack (for Yarn)
RUN corepack enable

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

EXPOSE 1337

CMD ["yarn", "start"]
