FROM phusion/baseimage:0.9.18
MAINTAINER Gravebot

# Setup system deps
RUN apt-get update
RUN apt-get -y install build-essential libxml2-dev python git libfontconfig1

# Setup Node
ENV NODE_VERSION $NODE_VERSION
ENV NPM_VERSION $NPM_VERSION

RUN git clone https://github.com/creationix/nvm.git /.nvm
RUN echo "source /.nvm/nvm.sh" >> /etc/bash.bashrc
RUN /bin/bash -c 'source /.nvm/nvm.sh && nvm install $NODE_VERSION && nvm use $NODE_VERSION && nvm alias default $NODE_VERSION && ln -s /.nvm/versions/node/v$NODE_VERSION/bin/node /usr/local/bin/node && ln -s /.nvm/versions/node/v$NODE_VERSION/bin/npm /usr/local/bin/npm'
RUN npm install -g npm@$NPM_VERSION

# Copy bot
COPY . /app/
WORKDIR /app/

# Install node deps
RUN npm install --production
RUN npm run postinstall

# Cleanup
RUN apt-get -y remove --purge --auto-remove build-essential libxml2-dev python git
RUN apt-get clean && apt-get autoclean
RUN node scripts/docker/remove-babel.js
RUN npm prune --production
RUN rm -rf src/ scripts/ /var/lib/apt/lists/* /var/tmp/* /usr/share/man /tmp/* /root/.npm /root/.node-gyp /usr/lib/node_modules/npm/man /usr/lib/node_modules/npm/doc /usr/lib/node_modules/npm/html

ENV PREFIX !
ENV PORT 5000
EXPOSE $PORT

CMD ["npm", "start"]
