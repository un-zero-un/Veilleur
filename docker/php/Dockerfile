FROM docker.un-zero-un.net/php:7.2-alpine

RUN apk update \
 && apk add zlib-dev libxml2-dev git mysql php7-pdo_mysql

RUN docker-php-ext-install zip dom mysqli pdo_mysql

USER root
WORKDIR /www

CMD ["php-fpm", "-R"]
