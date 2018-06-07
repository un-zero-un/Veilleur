dev: run assets

run:
	docker-compose up -d

veilleur:
	docker-compose exec php php bin/console veilleur:slack:receive

import:
	docker-compose exec php php bin/console veilleur:slack:import

assets:
	docker-compose exec nginx yarn run encore dev --watch


reset:
	docker-compose exec php ./reset.sh



assets_prod:
	docker-compose exec nginx yarn run encore production

genkeys:
	openssl genrsa -out var/jwt/private.pem -aes256 4096
	openssl rsa -pubout -in var/jwt/private.pem -out var/jwt/public.pem

gendb:
    docker-compose -f docker-compose.prod.yml exec php ./reset.sh
