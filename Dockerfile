# Dockerfile
FROM node:14.17.1-alpine

# update and install dependency
RUN apk update && apk upgrade
RUN apk add git
RUN apk add g++ make python

# create destination directory
RUN mkdir -p /usr/src/hermes
WORKDIR /usr/src/hermes

# copy the app, note .dockerignore
COPY . /usr/src/hermes/
RUN npm ci

EXPOSE 8060

ENTRYPOINT [ "npm", "start" ]
