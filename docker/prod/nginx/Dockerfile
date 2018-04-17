FROM veilleur_php AS assets

RUN php bin/console assets:install

FROM nginx:1.13.12-alpine

RUN rm -rf /etc/nginx/conf.d \
 && mkdir -p /etc/nginx/sites-available \
 && mkdir -p /etc/nginx/sites-enabled

ADD docker/prod/nginx/nginx.conf /etc/nginx/nginx.conf
ADD docker/prod/nginx/www.conf /etc/nginx/sites-available/www.conf
RUN ln -s /etc/nginx/sites-available/www.conf /etc/nginx/sites-enabled/www.conf

COPY --from=assets /www/web /www/web

ENTRYPOINT ["nginx"]
