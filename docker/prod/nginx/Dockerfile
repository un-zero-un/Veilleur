FROM veilleur_php AS assets
RUN php bin/console assets:install

FROM node:9.11.1-alpine AS node
FROM nginx:1.13.12-alpine

RUN apk update \
	&& apk add libstdc++ \
	&& rm -rf /tmp/* /var/cache/apk/*

USER root
WORKDIR /build

# NodeJS copy from node image
COPY --from=node /usr/local/share/doc/node /usr/local/share/doc/node
COPY --from=node /usr/local/bin/node /usr/local/bin/node
COPY --from=node /usr/local/include/node /usr/local/include/node
COPY --from=node /usr/local/lib/node_modules /usr/local/lib/node_modules
COPY --from=node /opt/yarn-* /opt/yarn
RUN ln -vs /usr/local/lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm \
		&& ln -vs /opt/yarn/bin/yarn /usr/local/bin/yarn \
		&& ln -vs /opt/yarn/bin/yarnpkg /usr/local/bin/yarnpkg

# Setting up nginx
RUN rm -rf /etc/nginx/conf.d \
		&& mkdir -p /etc/nginx/sites-available \
		&& mkdir -p /etc/nginx/sites-enabled

ADD docker/prod/nginx/nginx.conf /etc/nginx/nginx.conf
ADD docker/prod/nginx/www.conf /etc/nginx/sites-available/www.conf
RUN ln -s /etc/nginx/sites-available/www.conf /etc/nginx/sites-enabled/www.conf

# Copying the web folder which contains Symfony's files
COPY --from=assets /www/web /www/web

# Building the react app and moving it to the right folder
RUN mkdir -p /build/app/Resources/frontend && mkdir -p /build/web
COPY --from=assets /www/app/Resources/frontend /build/app/Resources/frontend
COPY --from=assets /www/webpack.config.js /build/webpack.config.js
COPY --from=assets /www/package.json /build/package.json
COPY --from=assets /www/package-lock.json /build/package-lock.json
COPY --from=assets /www/yarn.lock /build/yarn.lock
COPY --from=assets /www/.babelrc /build/.babelrc

RUN yarn
RUN yarn run encore production

RUN cp -R /build/web/build/* /www/web/build/
RUN rm -rf /build

WORKDIR /www

ENTRYPOINT ["nginx"]
