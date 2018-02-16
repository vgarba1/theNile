FROM node
MAINTAINER ViktorGarba
RUN apt-get update
RUN apt-get install -y vim 
RUN apt-get update -y
RUN mkdir -p /usr/src/inventoryservice
WORKDIR /usr/src/inventoryservice
COPY package.json ./
RUN npm install
COPY . .
EXPOSE 8080
CMD node index.js
