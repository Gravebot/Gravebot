FROM phusion/baseimage:0.9.18
MAINTAINER Gravebot

# Setup system deps
RUN apt-get update
RUN apt-get -y install build-essential libxml2-dev python git libicu52 libjpeg8 libfontconfig1 libwebp5 libssl1.0.0

# Setup Node
ENV NODE_VERSION 4.2.6
ENV NPM_VERSION 2.14.14
RUN git clone https://github.com/creationix/nvm.git /.nvm
RUN echo "source /.nvm/nvm.sh" >> /etc/bash.bashrc
RUN /bin/bash -c 'source /.nvm/nvm.sh && nvm install $NODE_VERSION && nvm use $NODE_VERSION && nvm alias default $NODE_VERSION && ln -s /.nvm/versions/node/v$NODE_VERSION/bin/node /usr/local/bin/node && ln -s /.nvm/versions/node/v$NODE_VERSION/bin/npm /usr/local/bin/npm'
RUN npm install -g npm@$NPM_VERSION

# Copy bot
COPY . /app/
WORKDIR /app/

# Install node deps
RUN npm install --production

# Cleanup
RUN apt-get -y remove --purge --auto-remove build-essential libxml2-dev python git
RUN apt-get clean
RUN rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /root/.npm

ENV PREFIX !
ENV PORT 5000
EXPOSE $PORT

CMD ["npm", "start"]
