FROM node:20-alpine

RUN apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev git

WORKDIR /app

# Copy only package files first (better caching)
COPY package.json yarn.lock ./

# Install dependencies with yarn
RUN yarn install --frozen-lockfile

# Copy the rest of the project
COPY . .

# Build Strapi admin panel
RUN yarn build

EXPOSE 1337

CMD ["yarn", "start"]
