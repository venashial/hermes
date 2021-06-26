# Dockerfile
FROM node:14.17.1-alpine

# update and install dependency
RUN apk update && apk upgrade
RUN apk add git

# create destination directory
RUN mkdir -p /usr/src/hermes
WORKDIR /usr/src/hermes

# copy the app, note .dockerignore
COPY . /usr/src/hermes/
RUN npm ci

ARG VERSION_ID=unknown

RUN npm run build

EXPOSE 3000


ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

ENTRYPOINT [ "npm", "start" ]
