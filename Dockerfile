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

ENV NODE_ENV=production

RUN npm ci  \
    # Write entrypoint.
    && printf "ls\nnpm run migrate:latest\nnpm run start\n" > entrypoint.sh

EXPOSE 8060

CMD ["/bin/sh", "entrypoint.sh"]
