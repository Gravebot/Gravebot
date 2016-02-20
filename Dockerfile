FROM alpine:3.3
MAINTAINER Gravebot

# Setup system deps
RUN apk add --update fontconfig git libxml2-dev nodejs python build-base curl bash
RUN npm install -g npm@3.7.2

# Fix PhantomJS
RUN curl -Ls "https://github.com/Gravebot/phantomized/releases/download/2.1.1/dockerized-phantomjs.tar.gz" | tar xz -C /

# Copy bot
COPY . /app/
WORKDIR /app/

# Install node deps
RUN npm install --production
# For some reason postinstall fails when done through npm install
RUN npm run postinstall

# Cleanup
RUN node scripts/docker/remove-babel.js
RUN npm prune --production
RUN apk del git libxml2-dev python build-base curl
RUN rm -rf tests/ src/ scripts/
RUN rm -rf /usr/share/man /tmp/* /var/cache/apk/* /root/.npm /root/.node-gyp /usr/lib/node_modules/npm/man /usr/lib/node_modules/npm/doc /usr/lib/node_modules/npm/html

ENV PREFIX !
ENV PORT 5000
EXPOSE $PORT

CMD ["npm", "start"]
