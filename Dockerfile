FROM ubuntu:14.04

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update -y
RUN apt-get install build-essential curl sudo -y

RUN curl -sL https://deb.nodesource.com/setup_4.x | sudo bash -
RUN apt-get install nodejs -y

COPY . /usr/src

EXPOSE 8000

WORKDIR /usr/src

RUN npm install

CMD [ "npm", "start" ]

