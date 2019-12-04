FROM node:10.16.0

RUN apt-get update && apt-get install -y nodejs --no-install-recommends && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app
ADD . /usr/src/app

RUN npm install
