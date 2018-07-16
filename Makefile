dev: run reset

run: packages assets
	docker-compose up -d
packages:
	docker-compose exec php composer install
	docker-compose exec nginx yarn

assets:
	docker-compose exec nginx yarn run encore dev --watch


reset:
	docker-compose exec php ./reset.sh

######################
#                    #
#  Production tools  #
#                    #
######################

build:
	docker-compose -f docker-compose.prod.yml build php
	docker-compose -f docker-compose.prod.yml build nginx
	docker-compose -f docker-compose.prod.yml build veilleur

veilleur:
	docker-compose -f docker-compose.prod.yml exec php php bin/console veilleur:slack:receive

import:
	docker-compose -f docker-compose.prod.yml exec php php bin/console veilleur:slack:import

assets_prod:
	docker-compose -f docker-compose.prod.yml exec nginx yarn run encore production

genkeys:
	mdkir -p var/jwt
	openssl genrsa -out var/jwt/private.pem -aes256 4096
	openssl rsa -pubout -in var/jwt/private.pem -out var/jwt/public.pem

gendb:
	docker-compose -f docker-compose.prod.yml exec php ./reset.sh
