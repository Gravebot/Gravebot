FROM alpine:3.3
MAINTAINER Gravebot

# Install setup that rarely changes.
RUN apk add --update nodejs && \
  npm install -g npm@3.10.3 && \
  rm -rf /usr/share/man /tmp/* /var/tmp/* /var/cache/apk/* /root/.npm /root/.node-gyp /usr/lib/node_modules/npm/man /usr/lib/node_modules/npm/doc /usr/lib/node_modules/npm/html

# Copy package.json
COPY ./package.json /app/package.json
WORKDIR /app/

# Install required APKs needed for building, install node modules, fix phantom, then cleanup.
RUN apk add --update git python build-base curl bash && \
  echo "Fixing PhantomJS" && \
  curl -Ls "https://github.com/dustinblackman/phantomized/releases/download/2.1.1/dockerized-phantomjs.tar.gz" | tar xz -C / && \
  echo "Installing node modules" && \
  sed -i '/postinstall/d' package.json && \
  npm install --production && \
  apk del git python build-base curl && \
  rm -rf /usr/share/man /tmp/* /var/tmp/* /var/cache/apk/* /root/.npm /root/.node-gyp

# Copy bot
COPY . /app/

# Post install
RUN npm run postinstall

ENV PREFIX !
ENV PORT 5000
EXPOSE $PORT

CMD ["npm", "start"]
