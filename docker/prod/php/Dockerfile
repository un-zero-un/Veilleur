FROM php:7.2.4-fpm-alpine3.7

RUN apk update && \
    apk add php7-pdo_pgsql>7.2 postgresql-dev php7>7.2 php7-pcntl>7.2 &&\
    docker-php-ext-install pdo_pgsql pcntl &&\
    apk del postgresql-dev && rm /var/cache/apk/*

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/bin --filename=composer
ENV COMPOSER_ALLOW_SUPERUSER=1 \
    SYMFONY_ENV=prod

RUN sed -i "s/user = www-data/user = root/g" /usr/local/etc/php-fpm.d/www.conf && sed -i "s/group = www-data/group = root/g" /usr/local/etc/php-fpm.d/www.conf

COPY . /www

USER root
WORKDIR /www

# Setting some default env variables
ENV POSTGRES_HOST=database \
    POSTGRES_PORT=5432 \
    POSTGRES_DB=veilleur \
    POSTGRES_USER=veilleur \
    POSTGRES_PASSWORD=veilleur \
    API_NAME=Veilleur\ API \
    API_DESCRIPTION='API to interact with veilleur'


RUN mkdir -p var/cache # Make composer know that he's running Symfony 3 and not 2
RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader
RUN php bin/console cache:warmup --env=prod --no-debug

CMD ["php-fpm", "-R"]
