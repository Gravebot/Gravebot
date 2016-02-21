FROM alpine:3.3
MAINTAINER Gravebot

# Copy bot
COPY . /app/
WORKDIR /app/

# Installs apks, fixes phantom, npm install and removes unused deps after babel build, then major cleanup.
RUN apk add --update fontconfig git libxml2-dev nodejs python build-base curl bash && \
  npm install -g npm@3.7.2 && \
  curl -Ls "https://github.com/dustinblackman/phantomized/releases/download/2.1.1/dockerized-phantomjs.tar.gz" | tar xz -C / && \
  npm install --production && \
  npm run postinstall && \
  node scripts/docker/remove-babel.js && \
  npm prune --production && \
  apk del git libxml2-dev python build-base curl && \
  rm -rf tests/ src/ scripts/ /usr/share/man /tmp/* /var/cache/apk/* /root/.npm /root/.node-gyp /usr/lib/node_modules/npm/man /usr/lib/node_modules/npm/doc /usr/lib/node_modules/npm/html

ENV PREFIX !
ENV PORT 5000
EXPOSE $PORT

CMD ["npm", "start"]
