FROM mysql
MAINTAINER ViktorGarba
RUN mkdir -p /usr/src/schema
WORKDIR /usr/src/schema
COPY . .
ADD schema.sql /docker-entrypoint-initdb.d
