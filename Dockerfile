FROM node:4.2.3-slim
MAINTAINER Gravebot

RUN apt-get update
RUN apt-get -y install build-essential libxml2-dev python git

COPY . /app/

WORKDIR /app/

RUN npm install --production

RUN apt-get -y remove --purge --auto-remove build-essential libxml2-dev python git
RUN apt-get clean
RUN rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /root/.npm

ENV PREFIX !
ENV PORT 5000
EXPOSE $PORT

CMD ["npm", "start"]
